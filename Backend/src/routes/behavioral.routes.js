const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const behavioralController = require("../controllers/behavioral.controller")

const behavioralRouter = express.Router()

/**
 * @route GET /api/behavioral/categories
 */
behavioralRouter.get(
    "/categories",
    authMiddleware.authUser,
    behavioralController.getCategoriesController
)

/**
 * @route GET /api/behavioral/question?category=Teamwork
 */
behavioralRouter.get(
    "/question",
    authMiddleware.authUser,
    behavioralController.getQuestionController
)

/**
 * @route POST /api/behavioral/answer
 */
behavioralRouter.post(
    "/answer",
    authMiddleware.authUser,
    behavioralController.submitAnswerController
)

/**
 * @route GET /api/behavioral/history
 */
behavioralRouter.get(
    "/history",
    authMiddleware.authUser,
    behavioralController.getHistoryController
)

module.exports = behavioralRouter
