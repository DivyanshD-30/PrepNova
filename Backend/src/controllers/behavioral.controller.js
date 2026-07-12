const { generateBehavioralQuestion, evaluateBehavioralAnswer } = require("../services/ai.service")
const behavioralAttemptModel = require("../models/behavioralAttempt.model")

const CATEGORIES = ["Teamwork", "Leadership", "Conflict Resolution", "Failure & Learning", "Ownership", "Communication"]

/**
 * @description Generate a fresh behavioral question for a category.
 * @route GET /api/behavioral/question?category=Teamwork
 * @access private
 */
async function getQuestionController(req, res) {
    try {
        const category = req.query.category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]

        const { question, whatInterviewerLooksFor } = await generateBehavioralQuestion({ category })

        res.status(200).json({
            message: "Question generated.",
            question,
            category,
            whatInterviewerLooksFor
        })

    } catch (err) {
        console.error("getQuestionController error:", err)
        res.status(500).json({ message: "Failed to generate question.", error: err.message })
    }
}

/**
 * @description List available behavioral categories.
 * @route GET /api/behavioral/categories
 * @access private
 */
function getCategoriesController(req, res) {
    res.status(200).json({ message: "Categories fetched.", categories: CATEGORIES })
}

/**
 * @description Submit an answer to a behavioral question, get scored AI feedback.
 * @route POST /api/behavioral/answer
 * @access private
 */
async function submitAnswerController(req, res) {
    try {
        const { question, category, userAnswer } = req.body

        if (!question || !userAnswer || userAnswer.trim().length < 20) {
            return res.status(400).json({ message: "A question and a substantive answer (20+ characters) are required." })
        }

        const feedbackByAi = await evaluateBehavioralAnswer({ question, userAnswer })

        const attempt = await behavioralAttemptModel.create({
            user: req.user.id,
            question,
            category: category || "General",
            userAnswer,
            score: feedbackByAi.score,
            starBreakdown: feedbackByAi.starBreakdown,
            feedback: feedbackByAi.feedback,
            strengths: feedbackByAi.strengths,
            improvements: feedbackByAi.improvements,
            exampleAnswer: feedbackByAi.exampleAnswer
        })

        res.status(201).json({
            message: "Answer evaluated.",
            attempt
        })

    } catch (err) {
        console.error("submitAnswerController error:", err)
        res.status(500).json({ message: "Failed to evaluate answer.", error: err.message })
    }
}

/**
 * @description List past behavioral attempts for the logged in user.
 * @route GET /api/behavioral/history
 * @access private
 */
async function getHistoryController(req, res) {
    try {
        const history = await behavioralAttemptModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("question category score createdAt")

        res.status(200).json({
            message: "History fetched.",
            history
        })

    } catch (err) {
        console.error("getHistoryController error:", err)
        res.status(500).json({ message: "Failed to fetch history.", error: err.message })
    }
}

module.exports = {
    getQuestionController,
    getCategoriesController,
    submitAnswerController,
    getHistoryController
}
