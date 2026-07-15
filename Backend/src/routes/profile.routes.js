const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const profileController = require("../controllers/profile.controller")
const profileRouter = express.Router()

profileRouter.get("/", authMiddleware.authUser, profileController.getProfileController)
profileRouter.patch("/", authMiddleware.authUser, profileController.updateProfileController)
profileRouter.patch("/password", authMiddleware.authUser, profileController.changePasswordController)
module.exports = profileRouter
