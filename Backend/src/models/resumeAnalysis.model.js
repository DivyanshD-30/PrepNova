const mongoose = require("mongoose")

const scoreBreakdownSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, { _id: false })

const suggestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    impact: {
        type: String,
        enum: ["high", "medium", "low"],
        required: true
    }
}, { _id: false })

const keywordMatchSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true
    },
    found: {
        type: Boolean,
        required: true
    }
}, { _id: false })

const resumeAnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    resumeText: {
        type: String,
        required: true
    },
    atsScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    scoreBreakdown: [scoreBreakdownSchema],
    strengths: [String],
    weaknesses: [String],
    suggestions: [suggestionSchema],
    keywordMatches: [keywordMatchSchema]
}, { timestamps: true })

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema)
