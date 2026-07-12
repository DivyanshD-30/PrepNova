const hrRoundSessionModel = require("../models/hrRoundSession.model")
const { generateHrReply, summarizeHrSession } = require("../services/ai.service")

const SESSION_LENGTH = 5

/**
 * @route POST /api/hr-round/session
 * @description Start a new HR round session for a given role. Returns the
 *              session id and an opening question from the AI interviewer.
 * @access private
 */
async function startSessionController(req, res) {
    try {
        const { role } = req.body

        const openerReply = await generateHrReply({
            role: role || "General",
            conversationHistory: [],
            userMessage: "(start of interview)",
            turnIndex: 0,
            sessionLength: SESSION_LENGTH
        })

        const session = await hrRoundSessionModel.create({
            user: req.user.id,
            role: role || "General",
            messages: [{ role: "ai", text: openerReply.reply, detectedTone: null }],
            status: "active",
            totalTurns: 0
        })

        res.status(201).json({
            message: "HR round session started.",
            session: {
                id: session._id,
                role: session.role,
                status: session.status,
                messages: session.messages
            }
        })

    } catch (err) {
        console.error("startSessionController (hr-round) error:", err)
        res.status(500).json({ message: "Failed to start HR round session.", error: err.message })
    }
}

/**
 * @route POST /api/hr-round/session/:id/message
 * @description Send a user message, get the AI interviewer's reply plus a
 *              rough detected tone for the candidate's message (see
 *              ai.service.js generateHrReply() for the exact limitation).
 * @access private
 */
async function sendMessageController(req, res) {
    try {
        const { id } = req.params
        const { message } = req.body

        if (!message?.trim()) {
            return res.status(400).json({ message: "Message is required." })
        }

        const session = await hrRoundSessionModel.findOne({ _id: id, user: req.user.id })

        if (!session) {
            return res.status(404).json({ message: "Session not found." })
        }

        if (session.status === "completed") {
            return res.status(400).json({ message: "This session is already completed." })
        }

        const nextTurn = session.totalTurns + 1

        const aiResult = await generateHrReply({
            role: session.role,
            conversationHistory: session.messages,
            userMessage: message.trim(),
            turnIndex: nextTurn,
            sessionLength: SESSION_LENGTH
        })

        session.messages.push({ role: "user", text: message.trim(), detectedTone: aiResult.detectedTone })
        session.messages.push({ role: "ai", text: aiResult.reply, detectedTone: null })
        session.totalTurns = nextTurn

        const done = aiResult.done || nextTurn >= SESSION_LENGTH

        if (done) {
            session.status = "completed"
            try {
                const summaryResult = await summarizeHrSession({ role: session.role, conversationHistory: session.messages })
                session.confidenceScore = summaryResult.confidenceScore
                session.summary = summaryResult.summary
            } catch (summaryErr) {
                // Don't fail the whole request if only the summary step fails —
                // the session is still usefully completed without it.
                console.error("summarizeHrSession error:", summaryErr)
            }
        }

        await session.save()

        res.status(200).json({
            message: "Message sent.",
            reply: aiResult.reply,
            detectedTone: aiResult.detectedTone,
            done,
            progress: { current: session.totalTurns, total: SESSION_LENGTH },
            confidenceScore: session.confidenceScore,
            summary: session.summary
        })

    } catch (err) {
        console.error("sendMessageController (hr-round) error:", err)
        res.status(500).json({ message: "Failed to send message.", error: err.message })
    }
}

/**
 * @route GET /api/hr-round/session/:id
 * @description Get a session by id, to resume or review it.
 * @access private
 */
async function getSessionController(req, res) {
    try {
        const session = await hrRoundSessionModel.findOne({ _id: req.params.id, user: req.user.id })

        if (!session) {
            return res.status(404).json({ message: "Session not found." })
        }

        res.status(200).json({
            message: "Session fetched.",
            session: {
                id: session._id,
                role: session.role,
                status: session.status,
                messages: session.messages,
                progress: { current: session.totalTurns, total: SESSION_LENGTH },
                confidenceScore: session.confidenceScore,
                summary: session.summary
            }
        })

    } catch (err) {
        console.error("getSessionController (hr-round) error:", err)
        res.status(500).json({ message: "Failed to fetch session.", error: err.message })
    }
}

module.exports = {
    startSessionController,
    sendMessageController,
    getSessionController
}
