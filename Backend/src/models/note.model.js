const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    title: { type: String, required: true, default: "Untitled Note" },
    content: { type: String, default: "" },
    tags: [{ type: String }],
    folder: { type: String, default: "General" }
}, { timestamps: true })

module.exports = mongoose.model("Note", noteSchema)
