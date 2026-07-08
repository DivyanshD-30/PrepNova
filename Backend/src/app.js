const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/* Routes */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const practiceRouter = require("./routes/practice.routes")
const dashboardRouter = require("./routes/dashboard.routes")
const resumeAnalysisRouter = require("./routes/resumeAnalysis.routes")
const jdAnalysisRouter = require("./routes/jdAnalysis.routes")
const behavioralRouter = require("./routes/behavioral.routes")
const codingRouter = require("./routes/coding.routes")
const hrRoundRouter = require("./routes/hrRound.routes")
const companyPrepRouter = require("./routes/companyPrep.routes")
const roadmapRouter = require("./routes/roadmap.routes")
const flashcardsRouter = require("./routes/flashcards.routes")
const notesRouter = require("./routes/notes.routes")
const bookmarksRouter = require("./routes/bookmarks.routes")
const notificationsRouter = require("./routes/notifications.routes")
const profileRouter = require("./routes/profile.routes")
const subscriptionRouter = require("./routes/subscription.routes")
const systemDesignRouter = require("./routes/systemDesign.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/practice", practiceRouter)
app.use("/api/dashboard", dashboardRouter)
app.use("/api/resume", resumeAnalysisRouter)
app.use("/api/jd", jdAnalysisRouter)
app.use("/api/behavioral", behavioralRouter)
app.use("/api/coding", codingRouter)
app.use("/api/hr-round", hrRoundRouter)
app.use("/api/company-prep", companyPrepRouter)
app.use("/api/roadmap", roadmapRouter)
app.use("/api/flashcards", flashcardsRouter)
app.use("/api/notes", notesRouter)
app.use("/api/bookmarks", bookmarksRouter)
app.use("/api/notifications", notificationsRouter)
app.use("/api/profile", profileRouter)
app.use("/api/subscription", subscriptionRouter)
app.use("/api/system-design", systemDesignRouter)

/* Global error handler */
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err)
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    })
})

module.exports = app
