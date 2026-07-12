const { generateCodingProblem, reviewCodeSubmission } = require("../services/ai.service")
const codingProblemModel = require("../models/codingProblem.model")
const codingSubmissionModel = require("../models/codingSubmission.model")

const TOPICS = ["Arrays", "Strings", "Hash Maps", "Linked Lists", "Trees", "Dynamic Programming", "Graphs", "Sorting & Searching"]
const DIFFICULTIES = ["Easy", "Medium", "Hard"]

/**
 * @description List coding problems, optionally filtered by topic/difficulty.
 *              If fewer than 3 problems exist for the requested filter, a
 *              fresh one is generated and cached so the bank grows over time.
 * @route GET /api/coding/problems?topic=Arrays&difficulty=Easy
 * @access private
 */
async function getProblemsController(req, res) {
    try {
        const { topic, difficulty } = req.query
        const filter = {}
        if (topic) filter.topic = topic
        if (difficulty) filter.difficulty = difficulty

        let problems = await codingProblemModel
            .find(filter)
            .select("title difficulty topic points createdAt")
            .sort({ createdAt: -1 })
            .limit(20)

        if (problems.length < 3) {
            const genTopic = topic || TOPICS[Math.floor(Math.random() * TOPICS.length)]
            const genDifficulty = difficulty || DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)]

            const problemByAi = await generateCodingProblem({ topic: genTopic, difficulty: genDifficulty })

            const created = await codingProblemModel.create({
                ...problemByAi,
                topic: genTopic
            })

            problems = [
                { _id: created._id, title: created.title, difficulty: created.difficulty, topic: created.topic, points: created.points, createdAt: created.createdAt },
                ...problems
            ]
        }

        res.status(200).json({
            message: "Problems fetched.",
            problems,
            topics: TOPICS,
            difficulties: DIFFICULTIES
        })

    } catch (err) {
        console.error("getProblemsController error:", err)
        res.status(500).json({ message: "Failed to fetch problems.", error: err.message })
    }
}

/**
 * @description Get a single coding problem in full (including visible test cases only).
 * @route GET /api/coding/problems/:id
 * @access private
 */
async function getProblemByIdController(req, res) {
    try {
        const problem = await codingProblemModel.findById(req.params.id)

        if (!problem) {
            return res.status(404).json({ message: "Problem not found." })
        }

        const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden)

        res.status(200).json({
            message: "Problem fetched.",
            problem: {
                _id: problem._id,
                title: problem.title,
                difficulty: problem.difficulty,
                topic: problem.topic,
                description: problem.description,
                constraints: problem.constraints,
                examples: problem.examples,
                starterCode: problem.starterCode,
                points: problem.points,
                visibleTestCases
            }
        })

    } catch (err) {
        console.error("getProblemByIdController error:", err)
        res.status(500).json({ message: "Failed to fetch problem.", error: err.message })
    }
}

/**
 * @description Submit code for a problem. See ai.service.js reviewCodeSubmission()
 *              for an important limitation: this is AI code review, not real
 *              sandboxed execution.
 * @route POST /api/coding/submit
 * @access private
 */
async function submitCodeController(req, res) {
    try {
        const { problemId, code, language, timeTakenSeconds } = req.body

        if (!problemId || !code || code.trim().length < 5) {
            return res.status(400).json({ message: "A problem id and code are required." })
        }

        const problem = await codingProblemModel.findById(problemId)
        if (!problem) {
            return res.status(404).json({ message: "Problem not found." })
        }

        const reviewByAi = await reviewCodeSubmission({
            problemDescription: problem.description,
            testCases: problem.testCases,
            code,
            language: language || "javascript"
        })

        const testResults = reviewByAi.testResults.map((result, i) => ({
            passed: result.passed,
            input: problem.testCases[i]?.input,
            expectedOutput: problem.testCases[i]?.expectedOutput,
            reasoning: result.reasoning
        }))

        const passedCount = testResults.filter((r) => r.passed).length
        const totalCount = testResults.length
        const score = totalCount > 0 ? Math.round((passedCount / totalCount) * problem.points) : 0

        const submission = await codingSubmissionModel.create({
            user: req.user.id,
            problem: problem._id,
            code,
            language: language || "javascript",
            testResults,
            passedCount,
            totalCount,
            score,
            feedback: `${reviewByAi.overallFeedback}\n\nTime complexity: ${reviewByAi.timeComplexity} | Space complexity: ${reviewByAi.spaceComplexity}`,
            timeTakenSeconds
        })

        res.status(201).json({
            message: "Submission reviewed.",
            submission,
            timeComplexity: reviewByAi.timeComplexity,
            spaceComplexity: reviewByAi.spaceComplexity
        })

    } catch (err) {
        console.error("submitCodeController error:", err)
        res.status(500).json({ message: "Failed to review submission.", error: err.message })
    }
}

/**
 * @description Top scorers, aggregated across all submissions.
 * @route GET /api/coding/leaderboard
 * @access private
 */
async function getLeaderboardController(req, res) {
    try {
        const leaderboard = await codingSubmissionModel.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalScore: { $sum: "$score" },
                    problemsSolved: { $sum: { $cond: [{ $eq: ["$passedCount", "$totalCount"] }, 1, 0] } },
                    submissions: { $sum: 1 }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 20 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    username: "$userInfo.username",
                    totalScore: 1,
                    problemsSolved: 1,
                    submissions: 1
                }
            }
        ])

        res.status(200).json({
            message: "Leaderboard fetched.",
            leaderboard
        })

    } catch (err) {
        console.error("getLeaderboardController error:", err)
        res.status(500).json({ message: "Failed to fetch leaderboard.", error: err.message })
    }
}

/**
 * @description List the logged in user's past submissions.
 * @route GET /api/coding/submissions
 * @access private
 */
async function getMySubmissionsController(req, res) {
    try {
        const submissions = await codingSubmissionModel
            .find({ user: req.user.id })
            .populate("problem", "title difficulty topic")
            .sort({ createdAt: -1 })
            .limit(50)

        res.status(200).json({
            message: "Submissions fetched.",
            submissions
        })

    } catch (err) {
        console.error("getMySubmissionsController error:", err)
        res.status(500).json({ message: "Failed to fetch submissions.", error: err.message })
    }
}

module.exports = {
    getProblemsController,
    getProblemByIdController,
    submitCodeController,
    getLeaderboardController,
    getMySubmissionsController
}
