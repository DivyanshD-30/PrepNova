const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const codingController = require("../controllers/coding.controller")

const codingRouter = express.Router()

/**
 * @route GET /api/coding/problems?topic=Arrays&difficulty=Easy
 */
codingRouter.get(
    "/problems",
    authMiddleware.authUser,
    codingController.getProblemsController
)

/**
 * @route GET /api/coding/problems/:id
 */
codingRouter.get(
    "/problems/:id",
    authMiddleware.authUser,
    codingController.getProblemByIdController
)

/**
 * @route POST /api/coding/submit
 */
codingRouter.post(
    "/submit",
    authMiddleware.authUser,
    codingController.submitCodeController
)

/**
 * @route GET /api/coding/leaderboard
 */
codingRouter.get(
    "/leaderboard",
    authMiddleware.authUser,
    codingController.getLeaderboardController
)

/**
 * @route GET /api/coding/submissions
 */
codingRouter.get(
    "/submissions",
    authMiddleware.authUser,
    codingController.getMySubmissionsController
)

module.exports = codingRouter
