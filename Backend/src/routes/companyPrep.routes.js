const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const companyPrepController = require("../controllers/companyPrep.controller")

const companyPrepRouter = express.Router()

/**
 * @route GET /api/company-prep/featured
 */
companyPrepRouter.get(
    "/featured",
    authMiddleware.authUser,
    companyPrepController.getFeaturedController
)

/**
 * @route GET /api/company-prep/search?q=goo
 */
companyPrepRouter.get(
    "/search",
    authMiddleware.authUser,
    companyPrepController.searchCompaniesController
)

/**
 * @route GET /api/company-prep/:slug
 */
companyPrepRouter.get(
    "/:slug",
    authMiddleware.authUser,
    companyPrepController.getCompanyBySlugController
)

module.exports = companyPrepRouter
