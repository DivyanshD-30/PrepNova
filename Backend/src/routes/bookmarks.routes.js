const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const bookmarksController = require("../controllers/bookmarks.controller")
const bookmarksRouter = express.Router()

bookmarksRouter.get("/", authMiddleware.authUser, bookmarksController.getBookmarksController)
bookmarksRouter.post("/", authMiddleware.authUser, bookmarksController.addBookmarkController)
bookmarksRouter.delete("/:id", authMiddleware.authUser, bookmarksController.deleteBookmarkController)
module.exports = bookmarksRouter
