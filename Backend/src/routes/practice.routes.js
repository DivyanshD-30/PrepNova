const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const practiceController = require("../controllers/practice.controller")

const practiceRouter = express.Router()

/**
 * @route POST /api/practice/session
 * @description Start a new practice session
 * @access private
 */
practiceRouter.post("/session", authMiddleware.authUser, practiceController.startSessionController)

/**
 * @route GET /api/practice/session/:id
 * @description Get/resume a practice session
 * @access private
 */
practiceRouter.get("/session/:id", authMiddleware.authUser, practiceController.getSessionController)

/**
 * @route POST /api/practice/session/:id/message
 * @description Send a user message and get AI reply
 * @access private
 */
practiceRouter.post("/session/:id/message", authMiddleware.authUser, practiceController.sendMessageController)

/**
 * @route PATCH /api/practice/session/:id/end
 * @description End a session early
 * @access private
 */
practiceRouter.patch("/session/:id/end", authMiddleware.authUser, practiceController.endSessionController)

module.exports = practiceRouter
