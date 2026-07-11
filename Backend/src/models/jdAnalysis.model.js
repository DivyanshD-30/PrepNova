const mongoose = require("mongoose")

const learningSuggestionSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    resources: [String]
}, { _id: false })

const jdAnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    matchPercentage: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    matchedSkills: [String],
    missingSkills: [String],
    niceToHaveSkills: [String],
    learningSuggestions: [learningSuggestionSchema],
    seniorityMatch: {
        type: String,
        required: true
    },
    roleSummary: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("JdAnalysis", jdAnalysisSchema)
