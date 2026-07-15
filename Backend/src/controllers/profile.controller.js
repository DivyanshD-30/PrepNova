const bcrypt = require("bcryptjs")
const userModel = require("../models/user.model")
const interviewReportModel = require("../models/interviewReport.model")
const practiceSessionModel = require("../models/practiceSession.model")
const behavioralAttemptModel = require("../models/behavioralAttempt.model")

/**
 * @route GET /api/profile
 */
async function getProfileController(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password")
        if (!user) return res.status(404).json({ message: "User not found." })

        const [totalInterviews, totalPractice, totalBehavioral] = await Promise.all([
            interviewReportModel.countDocuments({ user: req.user.id }),
            practiceSessionModel.countDocuments({ user: req.user.id }),
            behavioralAttemptModel.countDocuments({ user: req.user.id }),
        ])

        const xp = (totalInterviews * 50) + (totalPractice * 20) + (totalBehavioral * 15)
        const level = Math.floor(xp / 500) + 1
        const nextLevelXp = level * 500

        res.status(200).json({
            message: "Profile fetched.",
            profile: {
                _id: user._id,
                username: user.username,
                email: user.email,
                stats: { totalInterviews, totalPractice, totalBehavioral, xp, level, nextLevelXp }
            }
        })
    } catch (err) {
        console.error("getProfileController error:", err)
        res.status(500).json({ message: "Failed to fetch profile.", error: err.message })
    }
}

/**
 * @route PATCH /api/profile
 * body: { username }
 */
async function updateProfileController(req, res) {
    try {
        const { username } = req.body
        if (!username?.trim()) return res.status(400).json({ message: "Username is required." })

        const existing = await userModel.findOne({ username, _id: { $ne: req.user.id } })
        if (existing) return res.status(400).json({ message: "Username already taken." })

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { username: username.trim() },
            { new: true }
        ).select("-password")

        res.status(200).json({ message: "Profile updated.", user })
    } catch (err) {
        console.error("updateProfileController error:", err)
        res.status(500).json({ message: "Failed to update profile.", error: err.message })
    }
}

/**
 * @route PATCH /api/profile/password
 * body: { currentPassword, newPassword }
 */
async function changePasswordController(req, res) {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) return res.status(400).json({ message: "Both fields are required." })
        if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters." })

        const user = await userModel.findById(req.user.id)
        const valid = await bcrypt.compare(currentPassword, user.password)
        if (!valid) return res.status(401).json({ message: "Current password is incorrect." })

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        res.status(200).json({ message: "Password changed successfully." })
    } catch (err) {
        console.error("changePasswordController error:", err)
        res.status(500).json({ message: "Failed to change password.", error: err.message })
    }
}

module.exports = { getProfileController, updateProfileController, changePasswordController }
