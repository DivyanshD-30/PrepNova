const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const jdAnalysisController = require("../controllers/jdAnalysis.controller")

const jdAnalysisRouter = express.Router()

/**
 * @route POST /api/jd/analyze
 * @description Paste a job description, get a match analysis against the user's profile
 * @access private
 */
jdAnalysisRouter.post(
    "/analyze",
    authMiddleware.authUser,
    jdAnalysisController.analyzeJdController
)

module.exports = jdAnalysisRouter
