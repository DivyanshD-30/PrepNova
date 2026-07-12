const mongoose = require("mongoose")

const starBreakdownSchema = new mongoose.Schema({
    situation: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    task: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    action: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    result: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    }
}, { _id: false })

const behavioralAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    question: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    userAnswer: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    starBreakdown: starBreakdownSchema,
    feedback: {
        type: String,
        required: true
    },
    strengths: [String],
    improvements: [String],
    exampleAnswer: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("BehavioralAttempt", behavioralAttemptSchema)
