const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const roadmapController = require("../controllers/roadmap.controller")

const roadmapRouter = express.Router()

/** GET /api/roadmap */
roadmapRouter.get("/", authMiddleware.authUser, roadmapController.getRoadmapController)
/** PATCH /api/roadmap/progress */
roadmapRouter.patch("/progress", authMiddleware.authUser, roadmapController.updateProgressController)

module.exports = roadmapRouter
