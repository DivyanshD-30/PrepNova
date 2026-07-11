const interviewReportModel = require("../models/interviewReport.model")
const practiceSessionModel = require("../models/practiceSession.model")

/**
 * @route GET /api/dashboard/summary
 * @description Returns totalInterviews, averageScore, streakDays, hoursPracticed, xp, level, nextLevelXp
 */
async function getSummaryController(req, res) {
    try {
        const userId = req.user.id

        const reports = await interviewReportModel
            .find({ user: userId })
            .select("matchScore createdAt")

        const totalInterviews = reports.length

        const scored = reports.filter(r => r.matchScore != null)
        const averageScore = scored.length
            ? Math.round(scored.reduce((sum, r) => sum + r.matchScore, 0) / scored.length)
            : 0

        // Streak: count consecutive days (today backward) that have at least one report or practice session
        const sessions = await practiceSessionModel.find({ user: userId }).select("createdAt")
        const allDates = [
            ...reports.map(r => r.createdAt),
            ...sessions.map(s => s.createdAt)
        ].map(d => new Date(d).toDateString())
        const uniqueDays = [...new Set(allDates)].map(d => new Date(d)).sort((a, b) => b - a)

        let streakDays = 0
        let current = new Date()
        current.setHours(0, 0, 0, 0)
        for (const day of uniqueDays) {
            const d = new Date(day)
            d.setHours(0, 0, 0, 0)
            if (d.getTime() === current.getTime()) {
                streakDays++
                current.setDate(current.getDate() - 1)
            } else {
                break
            }
        }

        // XP: 50 per interview report + 20 per practice session + 10 per streak day
        const xp = (totalInterviews * 50) + (sessions.length * 20) + (streakDays * 10)
        const level = Math.floor(xp / 500) + 1
        const nextLevelXp = level * 500
        const hoursPracticed = Math.round((sessions.length * 0.5 + totalInterviews * 0.75) * 10) / 10

        res.status(200).json({
            message: "Dashboard summary fetched.",
            summary: { totalInterviews, averageScore, streakDays, hoursPracticed, xp, level, nextLevelXp }
        })
    } catch (err) {
        console.error("getSummaryController error:", err)
        res.status(500).json({ message: "Failed to fetch summary.", error: err.message })
    }
}

/**
 * @route GET /api/dashboard/score-trend
 * @description Returns last 7 days average scores  [{ day, score }]
 */
async function getScoreTrendController(req, res) {
    try {
        const userId = req.user.id
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const trend = []

        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            d.setHours(0, 0, 0, 0)
            const end = new Date(d)
            end.setHours(23, 59, 59, 999)

            const reports = await interviewReportModel.find({
                user: userId,
                createdAt: { $gte: d, $lte: end },
                matchScore: { $ne: null }
            }).select("matchScore")

            const score = reports.length
                ? Math.round(reports.reduce((s, r) => s + r.matchScore, 0) / reports.length)
                : 0

            trend.push({ day: days[d.getDay()], score })
        }

        res.status(200).json({ message: "Score trend fetched.", scoreTrend: trend })
    } catch (err) {
        console.error("getScoreTrendController error:", err)
        res.status(500).json({ message: "Failed to fetch score trend.", error: err.message })
    }
}

/**
 * @route GET /api/dashboard/recent-interviews
 * @description Returns last 5 interview reports (lightweight)
 */
async function getRecentInterviewsController(req, res) {
    try {
        const reports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title matchScore createdAt")

        const recentInterviews = reports.map(r => ({
            id: r._id,
            title: r.title,
            score: r.matchScore,
            date: r.createdAt.toISOString().split("T")[0],
            status: "completed"
        }))

        res.status(200).json({ message: "Recent interviews fetched.", recentInterviews })
    } catch (err) {
        console.error("getRecentInterviewsController error:", err)
        res.status(500).json({ message: "Failed to fetch recent interviews.", error: err.message })
    }
}

/**
 * @route GET /api/dashboard/heatmap
 * @description Returns 84 days of activity intensity [{ day, intensity }]
 */
async function getHeatmapController(req, res) {
    try {
        const userId = req.user.id
        const heatmap = []

        for (let i = 83; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            d.setHours(0, 0, 0, 0)
            const end = new Date(d)
            end.setHours(23, 59, 59, 999)

            const [reportCount, sessionCount] = await Promise.all([
                interviewReportModel.countDocuments({ user: userId, createdAt: { $gte: d, $lte: end } }),
                practiceSessionModel.countDocuments({ user: userId, createdAt: { $gte: d, $lte: end } })
            ])

            const total = reportCount + sessionCount
            const intensity = total === 0 ? 0 : total === 1 ? 1 : total === 2 ? 2 : total <= 4 ? 3 : 4

            heatmap.push({ day: 83 - i, intensity })
        }

        res.status(200).json({ message: "Heatmap fetched.", heatmap })
    } catch (err) {
        console.error("getHeatmapController error:", err)
        res.status(500).json({ message: "Failed to fetch heatmap.", error: err.message })
    }
}

module.exports = { getSummaryController, getScoreTrendController, getRecentInterviewsController, getHeatmapController }
