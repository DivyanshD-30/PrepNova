const mongoose = require("mongoose")

const roadmapProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true, unique: true },
    completedTopics: [{ type: String }],
    weeklyGoal: { type: Number, default: 5 },
    targetRole: { type: String, default: "Full Stack Engineer" }
}, { timestamps: true })

module.exports = mongoose.model("RoadmapProgress", roadmapProgressSchema)
