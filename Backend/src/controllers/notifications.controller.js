const notificationModel = require("../models/notification.model")

async function seedWelcomeNotif(userId) {
    const count = await notificationModel.countDocuments({ user: userId })
    if (count === 0) {
        await notificationModel.create({
            user: userId,
            title: "Welcome to PrepNova! 🎉",
            message: "Your account is ready. Start with the AI Interview Generator to get your first interview report.",
            type: "platform"
        })
    }
}

/**
 * @route GET /api/notifications
 */
async function getNotificationsController(req, res) {
    try {
        await seedWelcomeNotif(req.user.id)
        const notifications = await notificationModel.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50)
        const unreadCount = await notificationModel.countDocuments({ user: req.user.id, read: false })
        res.status(200).json({ message: "Notifications fetched.", notifications, unreadCount })
    } catch (err) {
        console.error("getNotificationsController error:", err)
        res.status(500).json({ message: "Failed to fetch notifications.", error: err.message })
    }
}

/**
 * @route PATCH /api/notifications/:id/read
 */
async function markReadController(req, res) {
    try {
        const notif = await notificationModel.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { read: true },
            { new: true }
        )
        if (!notif) return res.status(404).json({ message: "Notification not found." })
        res.status(200).json({ message: "Marked as read.", notification: notif })
    } catch (err) {
        console.error("markReadController error:", err)
        res.status(500).json({ message: "Failed to mark as read.", error: err.message })
    }
}

/**
 * @route PATCH /api/notifications/read-all
 */
async function markAllReadController(req, res) {
    try {
        await notificationModel.updateMany({ user: req.user.id, read: false }, { read: true })
        res.status(200).json({ message: "All notifications marked as read." })
    } catch (err) {
        console.error("markAllReadController error:", err)
        res.status(500).json({ message: "Failed to mark all as read.", error: err.message })
    }
}

module.exports = { getNotificationsController, markReadController, markAllReadController }
