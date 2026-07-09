const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()


/**
 * @route POST /api/interview/generate
 * @description Generate new interview report on the basis of user self description, resume PDF and job description.
 * @access private
 */
interviewRouter.post("/generate", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)


/**
 * @route GET /api/interview/reports
 * @description Get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/reports", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/reports/:id
 * @description Get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/reports/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route POST /api/interview/resume-pdf
 * @description Generate resume PDF; interviewReportId is sent in the request body.
 * @access private
 */
interviewRouter.post("/resume-pdf", authMiddleware.authUser, interviewController.generateResumePdfController)


module.exports = interviewRouter
