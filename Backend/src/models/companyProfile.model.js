const mongoose = require("mongoose")

const interviewRoundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    durationMinutes: {
        type: Number
    }
}, { _id: false })

const pastQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        enum: ["common", "occasional", "rare"],
        default: "occasional"
    }
}, { _id: false })

const salaryInsightSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    range: {
        type: String,
        required: true
    }
}, { _id: false })

const companyProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    about: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    interviewProcess: [interviewRoundSchema],
    pastQuestions: [pastQuestionSchema],
    salaryInsights: [salaryInsightSchema],
    resources: [String],
    cultureNotes: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model("CompanyProfile", companyProfileSchema)
