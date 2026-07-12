const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const hrRoundController = require("../controllers/hrRound.controller")

const hrRoundRouter = express.Router()

/**
 * @route POST /api/hr-round/session
 */
hrRoundRouter.post(
    "/session",
    authMiddleware.authUser,
    hrRoundController.startSessionController
)

/**
 * @route POST /api/hr-round/session/:id/message
 */
hrRoundRouter.post(
    "/session/:id/message",
    authMiddleware.authUser,
    hrRoundController.sendMessageController
)

/**
 * @route GET /api/hr-round/session/:id
 */
hrRoundRouter.get(
    "/session/:id",
    authMiddleware.authUser,
    hrRoundController.getSessionController
)

module.exports = hrRoundRouter
