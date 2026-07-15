const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const flashcardsController = require("../controllers/flashcards.controller")

const flashcardsRouter = express.Router()

/** GET  /api/flashcards */
flashcardsRouter.get("/", authMiddleware.authUser, flashcardsController.getFlashcardsController)
/** POST /api/flashcards/:id/favorite */
flashcardsRouter.post("/:id/favorite", authMiddleware.authUser, flashcardsController.toggleFavoriteController)

module.exports = flashcardsRouter
