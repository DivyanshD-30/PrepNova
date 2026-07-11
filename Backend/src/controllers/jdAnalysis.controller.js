const { analyzeJobDescription } = require("../services/ai.service")
const jdAnalysisModel = require("../models/jdAnalysis.model")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to analyze a job description against the user's profile.
 *              Uses the resume/self-description from the user's most recent
 *              interview report (if any) as profile context, since the JD
 *              Analyzer does not require a fresh upload every time.
 * @route POST /api/jd/analyze
 * @access private
 */
async function analyzeJdController(req, res) {
    try {
        const { jobDescription } = req.body

        if (!jobDescription || jobDescription.trim().length < 30) {
            return res.status(400).json({ message: "A full job description is required (at least a few sentences)." })
        }

        // Pull the most recent interview report for this user to use as profile
        // context (resume text + self description), if one exists.
        const latestReport = await interviewReportModel
            .findOne({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("resume selfDescription")

        const resumeText = latestReport?.resume || ""
        const selfDescription = latestReport?.selfDescription || ""

        const analysisByAi = await analyzeJobDescription({ jobDescription, resumeText, selfDescription })

        const analysis = await jdAnalysisModel.create({
            user: req.user.id,
            jobDescription,
            ...analysisByAi
        })

        res.status(201).json({
            message: "Job description analyzed successfully.",
            analysis
        })

    } catch (err) {
        console.error("analyzeJdController error:", err)
        res.status(500).json({ message: "Failed to analyze job description.", error: err.message })
    }
}

module.exports = { analyzeJdController }
