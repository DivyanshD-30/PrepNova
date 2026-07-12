const companyProfileModel = require("../models/companyProfile.model")
const { generateCompanyProfile } = require("../services/ai.service")

function slugify(name) {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

const FEATURED_COMPANIES = ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple", "Stripe", "Uber"]

/**
 * @route GET /api/company-prep/featured
 * @description List featured/suggested company names for quick access.
 * @access private
 */
function getFeaturedController(req, res) {
    res.status(200).json({ message: "Featured companies fetched.", companies: FEATURED_COMPANIES })
}

/**
 * @route GET /api/company-prep/search?q=goo
 * @description Search previously generated company profiles by name prefix.
 * @access private
 */
async function searchCompaniesController(req, res) {
    try {
        const { q } = req.query

        const filter = q ? { name: { $regex: `^${q}`, $options: "i" } } : {}

        const companies = await companyProfileModel
            .find(filter)
            .select("name slug industry")
            .limit(10)

        res.status(200).json({ message: "Companies fetched.", companies })

    } catch (err) {
        console.error("searchCompaniesController error:", err)
        res.status(500).json({ message: "Failed to search companies.", error: err.message })
    }
}

/**
 * @route GET /api/company-prep/:slug
 * @description Get a full company prep profile by slug. If it doesn't exist
 *              yet, generate it with AI and cache it permanently — so the
 *              first person to look up a company "seeds" it for everyone
 *              after them.
 * @access private
 */
async function getCompanyBySlugController(req, res) {
    try {
        const { slug } = req.params

        let profile = await companyProfileModel.findOne({ slug })

        if (!profile) {
            // Reconstruct a reasonable display name from the slug, e.g.
            // "general-electric" -> "General Electric", so freshly-typed
            // company names that don't exist yet still generate sensibly.
            const companyName = slug
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")

            const profileByAi = await generateCompanyProfile({ companyName })

            profile = await companyProfileModel.create({
                name: companyName,
                slug,
                ...profileByAi
            })
        }

        res.status(200).json({ message: "Company profile fetched.", profile })

    } catch (err) {
        if (err.code === 11000) {
            // Race condition: two requests generated the same new slug at
            // once. Just re-fetch the one that won instead of erroring.
            const profile = await companyProfileModel.findOne({ slug: req.params.slug })
            if (profile) {
                return res.status(200).json({ message: "Company profile fetched.", profile })
            }
        }
        console.error("getCompanyBySlugController error:", err)
        res.status(500).json({ message: "Failed to fetch company profile.", error: err.message })
    }
}

module.exports = {
    getFeaturedController,
    searchCompaniesController,
    getCompanyBySlugController
}
