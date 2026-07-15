const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const subscriptionController = require("../controllers/subscription.controller")
const subscriptionRouter = express.Router()

subscriptionRouter.get("/plans", authMiddleware.authUser, subscriptionController.getPlansController)
subscriptionRouter.post("/checkout", authMiddleware.authUser, subscriptionController.checkoutController)
module.exports = subscriptionRouter
