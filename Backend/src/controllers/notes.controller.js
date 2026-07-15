const noteModel = require("../models/note.model")

/**
 * @route GET /api/notes?folder=X&tag=Y&search=Z
 */
async function getNotesController(req, res) {
    try {
        const { folder, tag, search } = req.query
        const filter = { user: req.user.id }
        if (folder) filter.folder = folder
        if (tag) filter.tags = tag
        if (search) filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
        ]

        const notes = await noteModel.find(filter).sort({ updatedAt: -1 }).select("-__v")
        const allNotes = await noteModel.find({ user: req.user.id }).select("folder tags")
        const folders = [...new Set(allNotes.map(n => n.folder))]
        const tags = [...new Set(allNotes.flatMap(n => n.tags))]

        res.status(200).json({ message: "Notes fetched.", notes, folders, tags })
    } catch (err) {
        console.error("getNotesController error:", err)
        res.status(500).json({ message: "Failed to fetch notes.", error: err.message })
    }
}

/**
 * @route POST /api/notes
 * body: { title, content, tags, folder }
 */
async function createNoteController(req, res) {
    try {
        const { title, content, tags, folder } = req.body
        const note = await noteModel.create({
            user: req.user.id,
            title: title || "Untitled Note",
            content: content || "",
            tags: tags || [],
            folder: folder || "General"
        })
        res.status(201).json({ message: "Note created.", note })
    } catch (err) {
        console.error("createNoteController error:", err)
        res.status(500).json({ message: "Failed to create note.", error: err.message })
    }
}

/**
 * @route PATCH /api/notes/:id
 * body: { title, content, tags, folder }
 */
async function updateNoteController(req, res) {
    try {
        const note = await noteModel.findOne({ _id: req.params.id, user: req.user.id })
        if (!note) return res.status(404).json({ message: "Note not found." })

        const { title, content, tags, folder } = req.body
        if (title != null) note.title = title
        if (content != null) note.content = content
        if (tags != null) note.tags = tags
        if (folder != null) note.folder = folder

        await note.save()
        res.status(200).json({ message: "Note updated.", note })
    } catch (err) {
        console.error("updateNoteController error:", err)
        res.status(500).json({ message: "Failed to update note.", error: err.message })
    }
}

/**
 * @route DELETE /api/notes/:id
 */
async function deleteNoteController(req, res) {
    try {
        const note = await noteModel.findOneAndDelete({ _id: req.params.id, user: req.user.id })
        if (!note) return res.status(404).json({ message: "Note not found." })
        res.status(200).json({ message: "Note deleted." })
    } catch (err) {
        console.error("deleteNoteController error:", err)
        res.status(500).json({ message: "Failed to delete note.", error: err.message })
    }
}

module.exports = { getNotesController, createNoteController, updateNoteController, deleteNoteController }
