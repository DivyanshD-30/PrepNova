const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const MODEL = "gemini-2.5-flash";

// ─── Schemas ────────────────────────────────────────────────────────────────

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("A technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question — points to cover, approach, etc.")
    })).describe("Technical questions that may be asked in the interview, with intention and suggested answer"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("A behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question using the STAR method or similar")
    })).describe("Behavioral questions that may be asked in the interview, with intention and suggested answer"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("A skill the candidate is lacking relative to the job description"),
        severity: z.enum(["low", "medium", "high"]).describe("How critical this gap is for the role")
    })).describe("List of skill gaps in the candidate's profile"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("Day number in the plan, starting from 1"),
        focus: z.string().describe("Main focus area for this day, e.g. data structures, system design"),
        tasks: z.array(z.string()).describe("Concrete tasks to complete on this day")
    })).describe("A day-wise preparation plan for the candidate"),
    title: z.string().describe("The job title extracted from the job description")
})

const resumeAnalysisSchema = z.object({
    atsScore: z.number().describe("Overall ATS compatibility score from 0 to 100"),
    scoreBreakdown: z.array(z.object({
        label: z.string().describe("Sub-score category, e.g. Formatting, Keyword Match, Section Structure, Readability"),
        value: z.number().describe("Score for this category from 0 to 100")
    })).describe("Breakdown of the ATS score into 4 sub-categories: Formatting, Keyword Match, Section Structure, Readability"),
    strengths: z.array(z.string()).describe("3-5 specific strengths found in the resume"),
    weaknesses: z.array(z.string()).describe("3-5 specific weaknesses or issues found in the resume"),
    suggestions: z.array(z.object({
        title: z.string().describe("Short title of the suggestion"),
        detail: z.string().describe("Specific, actionable detail on how to implement this suggestion"),
        impact: z.enum(["high", "medium", "low"]).describe("How much this suggestion would improve the resume")
    })).describe("3-5 concrete, actionable suggestions to improve the resume, ordered by impact"),
    keywordMatches: z.array(z.object({
        keyword: z.string().describe("A relevant technical or role-specific keyword"),
        found: z.boolean().describe("Whether this keyword was found in the resume")
    })).describe("6-10 relevant keywords for the candidate's likely target roles, and whether each was found in the resume")
})

const jdAnalysisSchema = z.object({
    matchPercentage: z.number().describe("Overall match percentage (0-100) between the candidate profile and the job description"),
    matchedSkills: z.array(z.string()).describe("Skills required by the JD that the candidate already has"),
    missingSkills: z.array(z.string()).describe("Skills required or strongly preferred by the JD that the candidate is missing"),
    niceToHaveSkills: z.array(z.string()).describe("Skills mentioned as a bonus/nice-to-have in the JD that the candidate doesn't have"),
    learningSuggestions: z.array(z.object({
        skill: z.string().describe("A missing skill to learn"),
        reason: z.string().describe("Why this skill matters for this specific role, referencing the JD"),
        resources: z.array(z.string()).describe("2-3 concrete resource names or types to learn this skill")
    })).describe("Prioritized learning suggestions for the top missing skills"),
    seniorityMatch: z.string().describe("How the candidate's experience level compares to what the JD asks for, e.g. 'Mid to Senior'"),
    roleSummary: z.string().describe("A 1-2 sentence summary of what this role actually involves day to day")
})

const behavioralQuestionSchema = z.object({
    question: z.string().describe("A behavioral interview question for the given category"),
    whatInterviewerLooksFor: z.string().describe("A short note on what the interviewer is trying to assess with this question")
})

const behavioralFeedbackSchema = z.object({
    score: z.number().describe("Overall score from 0-100 for how well the answer addressed the question using the STAR method"),
    starBreakdown: z.object({
        situation: z.number().describe("0-100, how clearly the situation/context was set up"),
        task: z.number().describe("0-100, how clearly the specific task/responsibility was defined"),
        action: z.number().describe("0-100, how clearly and specifically the actions taken were described"),
        result: z.number().describe("0-100, how clearly the outcome/impact was quantified or described")
    }),
    feedback: z.string().describe("2-4 sentences of direct, constructive feedback on this specific answer"),
    strengths: z.array(z.string()).describe("1-3 specific things the candidate did well in this answer"),
    improvements: z.array(z.string()).describe("1-3 specific, actionable things to improve in this answer"),
    exampleAnswer: z.string().describe("A strong example answer to this question using the STAR method, in first person")
})

const codingProblemGenSchema = z.object({
    title: z.string().describe("A short, descriptive title for the coding problem"),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    description: z.string().describe("The full problem statement, written clearly, including what the function should do"),
    constraints: z.array(z.string()).describe("3-5 constraints, e.g. input size limits, value ranges"),
    examples: z.array(z.object({
        input: z.string(),
        output: z.string(),
        explanation: z.string()
    })).describe("2-3 worked examples"),
    testCases: z.array(z.object({
        input: z.string().describe("Function input, formatted as it would be called, e.g. '[2,7,11,15], 9'"),
        expectedOutput: z.string().describe("The expected return value as a string"),
        isHidden: z.boolean().describe("True for test cases not shown to the user upfront")
    })).describe("5-8 test cases covering normal cases, edge cases, and at least 2 hidden cases"),
    starterCode: z.string().describe("JavaScript starter function signature with a comment, e.g. 'function solve(nums, target) {\\n  // your code here\\n}'")
})

const codeReviewSchema = z.object({
    testResults: z.array(z.object({
        passed: z.boolean().describe("Whether this submission's logic would produce the expected output for this test case"),
        reasoning: z.string().describe("1 sentence on why it passed or failed for this specific case")
    })).describe("One result per test case provided, in the same order"),
    overallFeedback: z.string().describe("2-4 sentences of feedback on code quality, correctness, and complexity"),
    timeComplexity: z.string().describe("Big-O time complexity estimate, e.g. 'O(n log n)'"),
    spaceComplexity: z.string().describe("Big-O space complexity estimate, e.g. 'O(n)'")
})

const hrReplySchema = z.object({
    reply: z.string().describe("The HR interviewer's next message — a question or a brief acknowledgement followed by a question"),
    // This is a lightweight heuristic classification based on word choice and
    // hedging language in the candidate's last message — NOT real vocal tone,
    // facial expression, or biometric emotion analysis. See the comment above
    // generateHrReply() in this file for the full limitation.
    detectedTone: z.enum(["confident", "neutral", "hesitant"]).describe("A rough read on the candidate's tone in their last message, based on word choice and hedging language only"),
    done: z.boolean().describe("True if this should be the final message of the round (wrap-up, no further question)")
})

const hrSummarySchema = z.object({
    confidenceScore: z.number().describe("Overall confidence score 0-100 based on hedging language, clarity, and directness across the conversation"),
    summary: z.string().describe("2-4 sentences summarizing how the candidate came across in this HR round, and one concrete tip for next time")
})

const companyProfileGenSchema = z.object({
    about: z.string().describe("2-3 sentence overview of what the company does"),
    industry: z.string().describe("Primary industry, e.g. 'Cloud Infrastructure', 'E-commerce'"),
    interviewProcess: z.array(z.object({
        name: z.string().describe("Round name, e.g. 'Phone Screen', 'Onsite Technical', 'Bar Raiser'"),
        description: z.string().describe("What happens in this round"),
        durationMinutes: z.number().describe("Typical duration in minutes")
    })).describe("4-6 typical interview rounds in order"),
    pastQuestions: z.array(z.object({
        question: z.string(),
        category: z.string().describe("e.g. Technical, Behavioral, System Design"),
        frequency: z.enum(["common", "occasional", "rare"])
    })).describe("6-10 realistic past interview questions for this company"),
    salaryInsights: z.array(z.object({
        role: z.string().describe("e.g. 'Software Engineer'"),
        level: z.string().describe("e.g. 'Entry Level', 'Senior', 'Staff'"),
        range: z.string().describe("A realistic total compensation range, e.g. '$130k - $170k'")
    })).describe("4-6 role/level salary data points"),
    resources: z.array(z.string()).describe("4-6 specific, useful prep resources or resource types for this company"),
    cultureNotes: z.string().describe("2-3 sentences on the company's interview culture/style and what they tend to value in candidates")
})

// ─── generateInterviewReport ─────────────────────────────────────────────────

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a comprehensive interview report for a candidate with the following details:

Resume:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}

Return a structured JSON object following the provided schema exactly.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)
}

// ─── generatePdfFromHtml ──────────────────────────────────────────────────────

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pdfBuffer
}

// ─── generateResumePdf ────────────────────────────────────────────────────────

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("Complete, self-contained HTML for the resume, styled inline, ready to render as a PDF via Puppeteer")
    })

    const prompt = `Create a tailored, ATS-friendly resume in HTML format for a candidate with these details:

Resume / Background:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description (tailor the resume toward this role):
${jobDescription}

Requirements:
- Return a single JSON object with one key "html" containing the full HTML document (<!DOCTYPE html> ... </html>).
- Use only inline CSS — no external stylesheets, no <link> tags.
- The design should be clean, professional, and simple — subtle colour accents are fine.
- Content must not sound AI-generated; use natural, professional language.
- Ideal length when printed to A4 PDF: 1–2 pages.
- Optimise for ATS parsability (no tables for layout, logical heading order, standard section names).`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const { html } = JSON.parse(response.text)
    return await generatePdfFromHtml(html)
}

// ─── analyzeResume ────────────────────────────────────────────────────────────

/**
 * Analyzes resume text for ATS compatibility — score, breakdown, strengths,
 * weaknesses, actionable suggestions, and keyword coverage.
 */
async function analyzeResume({ resumeText }) {

    const prompt = `You are an expert ATS (Applicant Tracking System) resume reviewer. Analyze the following resume text in detail.

Resume Text:
${resumeText}

Evaluate:
1. Overall ATS compatibility score (0-100).
2. A breakdown into exactly 4 categories: Formatting, Keyword Match, Section Structure, Readability — each scored 0-100.
3. 3-5 genuine strengths, citing specifics from the resume.
4. 3-5 genuine weaknesses or ATS risks, citing specifics from the resume.
5. 3-5 concrete, actionable suggestions to improve the resume, each with a title, a specific detail, and an impact level (high/medium/low).
6. 6-10 relevant keywords for the candidate's likely target roles (inferred from their experience), marking which ones were actually found in the resume text.

Return a structured JSON object following the provided schema exactly. Be specific and reference actual content from the resume — do not give generic advice.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumeAnalysisSchema),
        }
    })

    return JSON.parse(response.text)
}

// ─── analyzeJobDescription ────────────────────────────────────────────────────

/**
 * Analyzes a job description against the candidate's profile (resume text
 * and/or self description) — match percentage, skill gaps, and a learning plan.
 */
async function analyzeJobDescription({ jobDescription, resumeText, selfDescription }) {

    const prompt = `You are an expert technical recruiter. Compare the following candidate profile against the job description and produce a detailed match analysis.

Candidate Resume / Background:
${resumeText || "Not provided"}

Candidate Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}

Evaluate:
1. Overall match percentage (0-100) between the candidate and this specific role.
2. Skills required by the JD that the candidate already demonstrates (matchedSkills).
3. Skills required or strongly preferred by the JD that the candidate appears to be missing (missingSkills).
4. Skills mentioned as a bonus/nice-to-have that the candidate doesn't have (niceToHaveSkills).
5. For the top 2-4 missing skills, a learning suggestion: why it matters for THIS role (reference the JD directly), and 2-3 concrete resources or resource types to learn it.
6. How the candidate's experience level compares to what the JD asks for (seniorityMatch), e.g. "Mid to Senior", "Entry Level", "Overqualified".
7. A 1-2 sentence plain-language summary of what this role actually involves day to day (roleSummary).

If little or no candidate profile was provided, base matchedSkills/missingSkills on a reasonable generalist baseline and note this implicitly in roleSummary. Return a structured JSON object following the provided schema exactly.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(jdAnalysisSchema),
        }
    })

    return JSON.parse(response.text)
}

// ─── generateBehavioralQuestion ───────────────────────────────────────────────

/**
 * Generates a single behavioral interview question for a given category.
 */
async function generateBehavioralQuestion({ category }) {

    const prompt = `Generate one realistic, specific behavioral interview question for the category "${category}".

Avoid generic phrasing like "Tell me about a time" if possible — vary the question structure. The question should be something a real interviewer at a tech company would ask. Return a structured JSON object following the provided schema exactly.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(behavioralQuestionSchema),
        }
    })

    return JSON.parse(response.text)
}

// ─── evaluateBehavioralAnswer ─────────────────────────────────────────────────

/**
 * Scores a user's answer to a behavioral question using the STAR method,
 * and returns structured feedback plus a model example answer.
 */
async function evaluateBehavioralAnswer({ question, userAnswer }) {

    const prompt = `You are an expert interview coach. Evaluate the following answer to a behavioral interview question using the STAR method (Situation, Task, Action, Result).

Question:
${question}

Candidate's Answer:
${userAnswer}

Score each STAR component from 0-100, give an overall score, write 2-4 sentences of direct constructive feedback, list 1-3 specific strengths and 1-3 specific improvements, and write a strong example answer to this same question in first person using the STAR method.

Return a structured JSON object following the provided schema exactly. Be honest — if the answer is weak or doesn't follow STAR, the scores should reflect that.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(behavioralFeedbackSchema),
        }
    })

    return JSON.parse(response.text)
}

// ─── generateCodingProblem ────────────────────────────────────────────────────

/**
 * Generates a single coding problem (with test cases) for a given topic and
 * difficulty, in the style of a technical interview question.
 */
async function generateCodingProblem({ topic, difficulty }) {

    const prompt = `Generate one technical interview coding problem.

Topic: ${topic}
Difficulty: ${difficulty}

The problem should be solvable in JavaScript, self-contained (no external libraries), and have a single clear function signature. Include 5-8 test cases covering normal inputs, edge cases (empty input, single element, etc.), and mark at least 2 of them as hidden (isHidden: true) — these should be less obvious edge cases not shown in the examples.

Return a structured JSON object following the provided schema exactly.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(codingProblemGenSchema),
        }
    })

    return JSON.parse(response.text)
}

// ─── reviewCodeSubmission ─────────────────────────────────────────────────────

/**
 * IMPORTANT LIMITATION — read before relying on this in production:
 *
 * This does NOT execute the submitted code. There is no sandboxed code
 * execution runtime in this stack (no Docker runner, no judge0 integration,
 * no vm2/isolated-vm). Running arbitrary user-submitted code server-side
 * without a real sandbox is a security risk, so this function instead asks
 * the AI to *reason* about whether the code would pass each test case by
 * reading it — similar to a human code reviewer doing a desk-check, not a
 * real interpreter.
 *
 * This means: results can be wrong if the AI misreads subtle logic, and it
 * cannot catch true runtime errors (e.g. actual stack overflows, real
 * timeouts) the way execution would. It IS good enough for: practice
 * feedback, complexity estimates, and catching obviously wrong logic — which
 * is what this feature is for. For a real "verdict" leaderboard you would
 * want to swap this for an actual execution backend (e.g. Judge0 API,
 * a Docker-based runner, or isolated-vm) — the function signature below is
 * designed so that swap only touches this one function.
 */
async function reviewCodeSubmission({ problemDescription, testCases, code, language = "javascript" }) {

    const prompt = `You are an expert code reviewer acting as a test runner. Read the following ${language} code and determine, by reasoning through the logic, whether it would produce the correct output for each test case.

Problem:
${problemDescription}

Code submitted:
\`\`\`${language}
${code}
\`\`\`

Test cases (input -> expected output):
${testCases.map((tc, i) => `${i + 1}. Input: ${tc.input} -> Expected: ${tc.expectedOutput}`).join("\n")}

For each test case, in the same order, determine whether the code's logic would produce the expected output, with 1 sentence of reasoning. Then give overall feedback on code quality and correctness, and estimate time and space complexity in Big-O notation.

Return a structured JSON object following the provided schema exactly.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(codeReviewSchema),
        }
    })

    return JSON.parse(response.text)
}

// ─── generateHrReply ───────────────────────────────────────────────────────────

/**
 * IMPORTANT LIMITATION — read before treating detectedTone as real signal:
 *
 * "Emotion analysis" here is the AI reading the candidate's TEXT and making a
 * rough judgment based on word choice, hedging phrases ("I think maybe...",
 * "I'm not totally sure but..."), and directness — NOT real emotion
 * detection. Real emotion/confidence analysis would need voice tone (pitch,
 * pace, pauses) or facial expression analysis from video, neither of which
 * exists in this stack. This is a text-only heuristic, intentionally framed
 * to the user as a "placeholder" per the original feature spec. Treat
 * detectedTone as a rough, occasionally-wrong signal, not a measurement.
 */
async function generateHrReply({ role, conversationHistory, userMessage, turnIndex, sessionLength }) {

    const historyText = conversationHistory.map((m) => `${m.role === "ai" ? "Interviewer" : "Candidate"}: ${m.text}`).join("\n")

    const prompt = `You are conducting an HR round interview for a "${role}" position. This is a conversational, behavioral-style HR interview (not technical) — covering motivation, fit, expectations, and soft skills.

Conversation so far:
${historyText}

Candidate's latest message:
${userMessage}

This is turn ${turnIndex} of ${sessionLength}. ${turnIndex >= sessionLength ? "This should be your final message — thank the candidate and wrap up warmly, no new question. Set done to true." : "Continue the conversation naturally with a brief acknowledgement and your next question. Set done to false."}

Also classify the candidate's tone in their latest message as confident, neutral, or hesitant, based only on their word choice, hedging language, and directness — be conservative, default to neutral if unclear.

Return a structured JSON object following the provided schema exactly.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(hrReplySchema),
        }
    })

    return JSON.parse(response.text)
}

// ─── summarizeHrSession ────────────────────────────────────────────────────────

/**
 * Produces a final confidence score and summary for a completed HR round,
 * based on the full conversation transcript. Same text-only heuristic
 * limitation as generateHrReply() above applies to confidenceScore.
 */
async function summarizeHrSession({ role, conversationHistory }) {

    const historyText = conversationHistory.map((m) => `${m.role === "ai" ? "Interviewer" : "Candidate"}: ${m.text}`).join("\n")

    const prompt = `Review this completed HR round interview transcript for a "${role}" position and assess the candidate's overall confidence and communication.

Transcript:
${historyText}

Score their overall confidence from 0-100 based on hedging language, clarity, and directness throughout the conversation (not on whether their answers were "correct" — there's no correct answer in an HR round). Write a 2-4 sentence summary of how they came across, plus one concrete, actionable tip for next time.

Return a structured JSON object following the provided schema exactly.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(hrSummarySchema),
        }
    })

    return JSON.parse(response.text)
}

// ─── generateCompanyProfile ───────────────────────────────────────────────────

/**
 * Generates a full company interview-prep profile: about, interview process,
 * past questions, salary insights, resources, and culture notes.
 */
async function generateCompanyProfile({ companyName }) {

    const prompt = `Generate a realistic interview-preparation profile for "${companyName}" as if for a job seeker preparing to interview there.

Cover: what the company does, their typical interview process (4-6 rounds), realistic past interview questions across categories (technical, behavioral, system design as relevant), salary insights for a few common roles/levels, useful prep resources, and notes on their interview culture and what they value in candidates.

Base this on realistic, plausible patterns for a company like this — if you don't have certain knowledge of this exact company, generate something representative and reasonable for a company of this type, and keep claims general rather than inventing specific confidential details.

Return a structured JSON object following the provided schema exactly.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(companyProfileGenSchema),
        }
    })

    return JSON.parse(response.text)
}

module.exports = {
    generateInterviewReport,
    generateResumePdf,
    analyzeResume,
    analyzeJobDescription,
    generateBehavioralQuestion,
    evaluateBehavioralAnswer,
    generateCodingProblem,
    reviewCodeSubmission,
    generateHrReply,
    summarizeHrSession,
    generateCompanyProfile,
    generateSystemDesignCase
}

// ─── generateSystemDesignCase ─────────────────────────────────────────────────

const systemDesignCaseSchema = z.object({
    overview: z.string().describe("2-3 sentence plain-language overview of the system being designed"),
    requirements: z.object({
        functional: z.array(z.string()).describe("4-6 functional requirements"),
        nonFunctional: z.array(z.string()).describe("4-6 non-functional requirements (scale, latency, availability)")
    }),
    components: z.array(z.object({
        name: z.string().describe("Component name, e.g. Load Balancer, Database, Cache"),
        role: z.string().describe("What this component does in the system"),
        technology: z.string().describe("Recommended technology, e.g. Redis, PostgreSQL, Nginx")
    })).describe("5-8 key components in the architecture"),
    scalingStrategies: z.array(z.string()).describe("3-5 concrete strategies to scale this system"),
    tradeoffs: z.array(z.object({
        decision: z.string().describe("A design decision that was made"),
        pro: z.string().describe("Why this choice is good"),
        con: z.string().describe("The downside or risk of this choice")
    })).describe("3-5 key design tradeoffs"),
    estimations: z.object({
        dau: z.string().describe("Estimated daily active users"),
        requestsPerSecond: z.string().describe("Estimated peak requests per second"),
        storagePerYear: z.string().describe("Estimated storage growth per year")
    }),
    interviewTips: z.array(z.string()).describe("3-5 tips for presenting this design in an interview setting")
})

async function generateSystemDesignCase({ topic, difficulty }) {
    const prompt = `Generate a comprehensive system design case study for: "${topic}" (Difficulty: ${difficulty}).

Cover: a plain-language overview, functional and non-functional requirements, 5-8 key architectural components with their technology choices, scaling strategies, design tradeoffs (with pros and cons), back-of-envelope estimations (DAU, RPS, storage), and tips for presenting this design in a real interview.

Keep language concrete and specific — this is study material for a software engineer preparing for a system design interview. Return a structured JSON object following the provided schema exactly.`

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(systemDesignCaseSchema),
        }
    })

    return JSON.parse(response.text)
}

