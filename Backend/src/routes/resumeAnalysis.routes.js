const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const upload = require("../middlewares/file.middleware")
const resumeAnalysisController = require("../controllers/resumeAnalysis.controller")

const resumeAnalysisRouter = express.Router()

/**
 * @route POST /api/resume/analyze
 * @description Upload a resume PDF and get an ATS analysis
 * @access private
 */
resumeAnalysisRouter.post(
    "/analyze",
    authMiddleware.authUser,
    upload.single("resume"),
    resumeAnalysisController.analyzeResumeController
)

/**
 * @route GET /api/resume/history
 * @description List past resume analyses for the logged in user
 * @access private
 */
resumeAnalysisRouter.get(
    "/history",
    authMiddleware.authUser,
    resumeAnalysisController.getResumeAnalysisHistoryController
)

/**
 * @route GET /api/resume/analysis/:id
 * @description Get a single past resume analysis by id
 * @access private
 */
resumeAnalysisRouter.get(
    "/analysis/:id",
    authMiddleware.authUser,
    resumeAnalysisController.getResumeAnalysisByIdController
)

module.exports = resumeAnalysisRouter
