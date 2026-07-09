const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 * @route POST /api/interview/generate
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required." })
        }

        let resumeContent = ""
        if (req.file) {
            // pdf-parse accepts a Buffer directly
            const pdfData = await pdfParse(req.file.buffer)
            resumeContent = pdfData.text
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })

    } catch (err) {
        console.error("generateInterViewReportController error:", err)
        res.status(500).json({ message: "Failed to generate interview report.", error: err.message })
    }
}


/**
 * @description Controller to get interview report by interviewId.
 * @route GET /api/interview/reports/:interviewId
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })

    } catch (err) {
        console.error("getInterviewReportByIdController error:", err)
        res.status(500).json({ message: "Failed to fetch interview report.", error: err.message })
    }
}


/**
 * @description Controller to get all interview reports of logged in user.
 * @route GET /api/interview/reports
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })

    } catch (err) {
        console.error("getAllInterviewReportsController error:", err)
        res.status(500).json({ message: "Failed to fetch interview reports.", error: err.message })
    }
}


/**
 * @description Controller to generate resume PDF.
 *              interviewReportId is now read from req.body (frontend sends it in POST body).
 * @route POST /api/interview/resume-pdf
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.body

        if (!interviewReportId) {
            return res.status(400).json({ message: "interviewReportId is required." })
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)

    } catch (err) {
        console.error("generateResumePdfController error:", err)
        res.status(500).json({ message: "Failed to generate resume PDF.", error: err.message })
    }
}


module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}
