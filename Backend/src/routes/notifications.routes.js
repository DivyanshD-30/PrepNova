const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const notificationsController = require("../controllers/notifications.controller")
const notificationsRouter = express.Router()

notificationsRouter.get("/", authMiddleware.authUser, notificationsController.getNotificationsController)
notificationsRouter.patch("/read-all", authMiddleware.authUser, notificationsController.markAllReadController)
notificationsRouter.patch("/:id/read", authMiddleware.authUser, notificationsController.markReadController)
module.exports = notificationsRouter
