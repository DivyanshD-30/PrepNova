const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const notesController = require("../controllers/notes.controller")

const notesRouter = express.Router()

/** GET    /api/notes */
notesRouter.get("/", authMiddleware.authUser, notesController.getNotesController)
/** POST   /api/notes */
notesRouter.post("/", authMiddleware.authUser, notesController.createNoteController)
/** PATCH  /api/notes/:id */
notesRouter.patch("/:id", authMiddleware.authUser, notesController.updateNoteController)
/** DELETE /api/notes/:id */
notesRouter.delete("/:id", authMiddleware.authUser, notesController.deleteNoteController)

module.exports = notesRouter
