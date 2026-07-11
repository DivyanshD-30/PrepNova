const pdfParse = require("pdf-parse")
const { analyzeResume } = require("../services/ai.service")
const resumeAnalysisModel = require("../models/resumeAnalysis.model")

/**
 * @description Controller to analyze an uploaded resume PDF for ATS compatibility.
 * @route POST /api/resume/analyze
 * @access private
 */
async function analyzeResumeController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "A resume file is required." })
        }

        const pdfData = await pdfParse(req.file.buffer)
        const resumeText = pdfData.text

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ message: "Could not extract enough text from this resume. Please upload a text-based PDF." })
        }

        const analysisByAi = await analyzeResume({ resumeText })

        const analysis = await resumeAnalysisModel.create({
            user: req.user.id,
            fileName: req.file.originalname,
            resumeText,
            ...analysisByAi
        })

        res.status(201).json({
            message: "Resume analyzed successfully.",
            analysis
        })

    } catch (err) {
        console.error("analyzeResumeController error:", err)
        res.status(500).json({ message: "Failed to analyze resume.", error: err.message })
    }
}

/**
 * @description Controller to get a single past resume analysis by id.
 * @route GET /api/resume/analysis/:id
 * @access private
 */
async function getResumeAnalysisByIdController(req, res) {
    try {
        const analysis = await resumeAnalysisModel.findOne({ _id: req.params.id, user: req.user.id })

        if (!analysis) {
            return res.status(404).json({ message: "Resume analysis not found." })
        }

        res.status(200).json({ message: "Resume analysis fetched.", analysis })

    } catch (err) {
        console.error("getResumeAnalysisByIdController error:", err)
        res.status(500).json({ message: "Failed to fetch resume analysis.", error: err.message })
    }
}

/**
 * @description Controller to list all past resume analyses for the logged in user (lightweight).
 * @route GET /api/resume/history
 * @access private
 */
async function getResumeAnalysisHistoryController(req, res) {
    try {
        const history = await resumeAnalysisModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("fileName atsScore createdAt")

        res.status(200).json({
            message: "Resume analysis history fetched.",
            history: history.map((h) => ({
                id: h._id,
                fileName: h.fileName,
                atsScore: h.atsScore,
                analyzedAt: h.createdAt
            }))
        })

    } catch (err) {
        console.error("getResumeAnalysisHistoryController error:", err)
        res.status(500).json({ message: "Failed to fetch resume analysis history.", error: err.message })
    }
}

module.exports = {
    analyzeResumeController,
    getResumeAnalysisByIdController,
    getResumeAnalysisHistoryController
}
