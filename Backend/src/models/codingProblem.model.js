const mongoose = require("mongoose")

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },
    expectedOutput: {
        type: String,
        required: true
    },
    isHidden: {
        type: Boolean,
        default: false
    }
}, { _id: false })

const codingProblemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    constraints: [String],
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    testCases: [testCaseSchema],
    starterCode: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 100
    }
}, { timestamps: true })

module.exports = mongoose.model("CodingProblem", codingProblemSchema)
