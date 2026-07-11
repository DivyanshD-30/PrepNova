const practiceSessionModel = require("../models/practiceSession.model")
const { generatePracticeReply } = require("../services/ai.service")

const SESSION_LENGTH = 6

const QUESTION_BANK = {
    frontend: [
        "Tell me about a time you optimized a slow-loading page. What was your approach?",
        "How would you design a reusable component library for a large team?",
        "Walk me through how you would debug a memory leak in a React application.",
        "How do you decide between client-side and server-side rendering for a feature?",
        "Describe a tricky CSS layout bug you fixed and how you diagnosed it.",
        "How do you approach accessibility when building UI components?"
    ],
    backend: [
        "How would you design a rate limiter for a public API?",
        "Tell me about a time you had to optimize a slow database query.",
        "How do you approach designing idempotent APIs?",
        "Walk me through how you would handle a sudden 10x spike in traffic.",
        "How do you handle database migrations in a production environment?",
        "Explain your approach to error handling and logging in a backend service."
    ],
    "system-design": [
        "Design a URL shortening service like bit.ly. Walk me through your approach.",
        "How would you design a notification system that scales to millions of users?",
        "Design the backend for a real-time chat application.",
        "How would you design a distributed cache?",
        "Design an e-commerce product search system.",
        "How would you architect a video streaming platform?"
    ],
    behavioral: [
        "Tell me about a time you disagreed with a teammate. How did you handle it?",
        "Describe a project that failed. What did you learn?",
        "Tell me about a time you had to deliver difficult feedback.",
        "Describe a situation where you had to work under a tight deadline.",
        "Tell me about a time you took initiative without being asked.",
        "How do you handle competing priorities when everything seems urgent?"
    ]
}

const FOLLOW_UPS = [
    "That's a solid approach. What trade-offs did you consider along the way?",
    "Good answer. How would your solution change if the scale increased 10x?",
    "I like that. Can you walk me through how you'd measure whether it actually worked?",
    "Interesting — what would you do differently if you had to do it again?",
    "Makes sense. What was the hardest part of that for you personally?"
]

function getAiOpener(topic) {
    const bank = QUESTION_BANK[topic] || QUESTION_BANK.frontend
    return bank[0]
}

function getAiFollowUp(topic, turnIndex, userMessage) {
    const bank = QUESTION_BANK[topic] || QUESTION_BANK.frontend
    if (turnIndex < bank.length) {
        return turnIndex % 2 === 1
            ? FOLLOW_UPS[turnIndex % FOLLOW_UPS.length]
            : bank[turnIndex]
    }
    return "That wraps up this practice round. You've covered the core areas well — check your summary for a breakdown."
}


/**
 * @route POST /api/practice/session
 * @description Start a new practice session, returns session id + first AI question
 */
async function startSessionController(req, res) {
    try {
        const { topic } = req.body

        if (!topic || !QUESTION_BANK[topic]) {
            return res.status(400).json({ message: "Invalid topic. Choose: frontend, backend, system-design, behavioral." })
        }

        const firstQuestion = getAiOpener(topic)

        const session = await practiceSessionModel.create({
            user: req.user.id,
            topic,
            messages: [{ role: "ai", text: firstQuestion }],
            status: "active",
            totalTurns: 0
        })

        res.status(201).json({
            message: "Practice session started.",
            session: {
                id: session._id,
                topic: session.topic,
                status: session.status,
                messages: session.messages
            }
        })
    } catch (err) {
        console.error("startSessionController error:", err)
        res.status(500).json({ message: "Failed to start session.", error: err.message })
    }
}


/**
 * @route POST /api/practice/session/:id/message
 * @description Send a user message, get AI reply. Returns { reply, done, progress }
 */
async function sendMessageController(req, res) {
    try {
        const { id } = req.params
        const { message } = req.body

        if (!message?.trim()) {
            return res.status(400).json({ message: "Message is required." })
        }

        const session = await practiceSessionModel.findOne({ _id: id, user: req.user.id })

        if (!session) {
            return res.status(404).json({ message: "Session not found." })
        }

        if (session.status === "completed") {
            return res.status(400).json({ message: "This session is already completed." })
        }

        // Save user message
        session.messages.push({ role: "user", text: message.trim() })
        session.totalTurns += 1

        const done = session.totalTurns >= SESSION_LENGTH

        // Generate AI reply
        const aiReply = done
            ? "That wraps up this practice round. You've covered the core areas well — great effort!"
            : getAiFollowUp(session.topic, session.totalTurns, message.trim())

        session.messages.push({ role: "ai", text: aiReply })

        if (done) {
            session.status = "completed"
        }

        await session.save()

        res.status(200).json({
            message: "Message sent.",
            reply: aiReply,
            done,
            progress: { current: session.totalTurns, total: SESSION_LENGTH }
        })
    } catch (err) {
        console.error("sendMessageController error:", err)
        res.status(500).json({ message: "Failed to send message.", error: err.message })
    }
}


/**
 * @route GET /api/practice/session/:id
 * @description Get a session by id (to resume)
 */
async function getSessionController(req, res) {
    try {
        const session = await practiceSessionModel.findOne({ _id: req.params.id, user: req.user.id })

        if (!session) {
            return res.status(404).json({ message: "Session not found." })
        }

        res.status(200).json({
            message: "Session fetched.",
            session: {
                id: session._id,
                topic: session.topic,
                status: session.status,
                messages: session.messages,
                progress: { current: session.totalTurns, total: SESSION_LENGTH }
            }
        })
    } catch (err) {
        console.error("getSessionController error:", err)
        res.status(500).json({ message: "Failed to fetch session.", error: err.message })
    }
}


/**
 * @route PATCH /api/practice/session/:id/end
 * @description Manually end a session early
 */
async function endSessionController(req, res) {
    try {
        const session = await practiceSessionModel.findOne({ _id: req.params.id, user: req.user.id })

        if (!session) {
            return res.status(404).json({ message: "Session not found." })
        }

        session.status = "completed"
        await session.save()

        res.status(200).json({ message: "Session ended.", session: { id: session._id, status: session.status } })
    } catch (err) {
        console.error("endSessionController error:", err)
        res.status(500).json({ message: "Failed to end session.", error: err.message })
    }
}

module.exports = { startSessionController, sendMessageController, getSessionController, endSessionController }
