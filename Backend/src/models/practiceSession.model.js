const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["ai", "user"],
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { _id: false })

const practiceSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    topic: {
        type: String,
        enum: ["frontend", "backend", "system-design", "behavioral"],
        required: true
    },
    messages: [messageSchema],
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active"
    },
    totalTurns: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

module.exports = mongoose.model("PracticeSession", practiceSessionSchema)
