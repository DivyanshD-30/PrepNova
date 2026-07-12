const mongoose = require("mongoose")

const testResultSchema = new mongoose.Schema({
    passed: {
        type: Boolean,
        required: true
    },
    input: String,
    expectedOutput: String,
    reasoning: String
}, { _id: false })

const codingSubmissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CodingProblem",
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: "javascript"
    },
    // NOTE: testResults are produced by an AI code reviewer reasoning about
    // the code against each test case — NOT by sandboxed execution. There is
    // no code execution runtime in this stack yet. See ai.service.js comment
    // on reviewCodeSubmission() for the exact limitation and what a real
    // implementation would need (e.g. judge0, a Docker-based runner, or a
    // vm2/isolated-vm sandbox).
    testResults: [testResultSchema],
    passedCount: {
        type: Number,
        required: true
    },
    totalCount: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    feedback: {
        type: String
    },
    timeTakenSeconds: {
        type: Number
    }
}, { timestamps: true })

module.exports = mongoose.model("CodingSubmission", codingSubmissionSchema)
