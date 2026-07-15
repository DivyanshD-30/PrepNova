const mongoose = require("mongoose")

const bookmarkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    type: { type: String, enum: ["question", "company", "flashcard", "note"], required: true },
    refId: { type: String, required: true },
    title: { type: String, required: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true })

bookmarkSchema.index({ user: 1, type: 1, refId: 1 }, { unique: true })
module.exports = mongoose.model("Bookmark", bookmarkSchema)
