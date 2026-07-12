const mongoose = require("mongoose")

const hrMessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["ai", "user"],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    // Placeholder field — see ai.service.js generateHrReply() for why this
    // is a lightweight heuristic and not real emotion/sentiment analysis.
    detectedTone: {
        type: String,
        enum: ["confident", "neutral", "hesitant", null],
        default: null
    }
}, { _id: false })

const hrRoundSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    role: {
        type: String,
        default: "General"
    },
    messages: [hrMessageSchema],
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active"
    },
    totalTurns: {
        type: Number,
        default: 0
    },
    confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    summary: {
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("HrRoundSession", hrRoundSessionSchema)
