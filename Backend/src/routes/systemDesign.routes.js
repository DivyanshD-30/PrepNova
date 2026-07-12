const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const systemDesignController = require("../controllers/systemDesign.controller")
const systemDesignRouter = express.Router()

systemDesignRouter.get("/topics", authMiddleware.authUser, systemDesignController.getTopicsController)
systemDesignRouter.get("/case/:id", authMiddleware.authUser, systemDesignController.getCaseStudyController)
module.exports = systemDesignRouter
