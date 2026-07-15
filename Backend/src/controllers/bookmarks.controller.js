const bookmarkModel = require("../models/bookmark.model")

/**
 * @route GET /api/bookmarks?type=X
 */
async function getBookmarksController(req, res) {
    try {
        const filter = { user: req.user.id }
        if (req.query.type) filter.type = req.query.type
        const bookmarks = await bookmarkModel.find(filter).sort({ createdAt: -1 })
        res.status(200).json({ message: "Bookmarks fetched.", bookmarks })
    } catch (err) {
        console.error("getBookmarksController error:", err)
        res.status(500).json({ message: "Failed to fetch bookmarks.", error: err.message })
    }
}

/**
 * @route POST /api/bookmarks
 * body: { type, refId, title, meta }
 */
async function addBookmarkController(req, res) {
    try {
        const { type, refId, title, meta } = req.body
        if (!type || !refId || !title) return res.status(400).json({ message: "type, refId, and title are required." })
        const bookmark = await bookmarkModel.findOneAndUpdate(
            { user: req.user.id, type, refId },
            { title, meta: meta || {} },
            { upsert: true, new: true }
        )
        res.status(201).json({ message: "Bookmark added.", bookmark })
    } catch (err) {
        console.error("addBookmarkController error:", err)
        res.status(500).json({ message: "Failed to add bookmark.", error: err.message })
    }
}

/**
 * @route DELETE /api/bookmarks/:id
 */
async function deleteBookmarkController(req, res) {
    try {
        const bm = await bookmarkModel.findOneAndDelete({ _id: req.params.id, user: req.user.id })
        if (!bm) return res.status(404).json({ message: "Bookmark not found." })
        res.status(200).json({ message: "Bookmark removed." })
    } catch (err) {
        console.error("deleteBookmarkController error:", err)
        res.status(500).json({ message: "Failed to delete bookmark.", error: err.message })
    }
}

module.exports = { getBookmarksController, addBookmarkController, deleteBookmarkController }
