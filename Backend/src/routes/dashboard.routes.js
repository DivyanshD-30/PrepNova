const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const dashboardController = require("../controllers/dashboard.controller")

const dashboardRouter = express.Router()

/**
 * @route GET /api/dashboard/summary
 */
dashboardRouter.get("/summary", authMiddleware.authUser, dashboardController.getSummaryController)

/**
 * @route GET /api/dashboard/score-trend
 */
dashboardRouter.get("/score-trend", authMiddleware.authUser, dashboardController.getScoreTrendController)

/**
 * @route GET /api/dashboard/recent-interviews
 */
dashboardRouter.get("/recent-interviews", authMiddleware.authUser, dashboardController.getRecentInterviewsController)

/**
 * @route GET /api/dashboard/heatmap
 */
dashboardRouter.get("/heatmap", authMiddleware.authUser, dashboardController.getHeatmapController)

module.exports = dashboardRouter
