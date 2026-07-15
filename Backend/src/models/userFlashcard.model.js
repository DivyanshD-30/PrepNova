const mongoose = require("mongoose")

const userFlashcardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    flashcard: { type: mongoose.Schema.Types.ObjectId, ref: "Flashcard", required: true },
    favorited: { type: Boolean, default: false },
    lastSeen: { type: Date }
}, { timestamps: true })

userFlashcardSchema.index({ user: 1, flashcard: 1 }, { unique: true })
module.exports = mongoose.model("UserFlashcard", userFlashcardSchema)
