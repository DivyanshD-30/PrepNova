const { generateSystemDesignCase } = require("../services/ai.service")

const TOPICS = [
    { id: "url-shortener",  label: "URL Shortener",          category: "Classic",      difficulty: "medium" },
    { id: "twitter-feed",   label: "Twitter/X Feed",         category: "Social",       difficulty: "hard"   },
    { id: "rate-limiter",   label: "Rate Limiter",           category: "Infrastructure",difficulty: "medium" },
    { id: "cdn",            label: "CDN",                    category: "Infrastructure",difficulty: "hard"   },
    { id: "chat-app",       label: "Real-Time Chat",         category: "Social",       difficulty: "medium" },
    { id: "notification-svc",label:"Notification Service",   category: "Infrastructure",difficulty: "medium" },
    { id: "search-engine",  label: "Search Autocomplete",    category: "Classic",      difficulty: "medium" },
    { id: "ride-sharing",   label: "Ride-Sharing Backend",   category: "Product",      difficulty: "hard"   },
    { id: "video-streaming",label: "Video Streaming",        category: "Product",      difficulty: "hard"   },
    { id: "e-commerce",     label: "E-Commerce Platform",   category: "Product",      difficulty: "hard"   },
    { id: "payment-system", label: "Payment System",        category: "Infrastructure",difficulty: "hard"   },
    { id: "key-value-store",label: "Distributed Key-Value Store",category:"Classic",   difficulty: "hard"   },
]

const cache = {}

/**
 * @route GET /api/system-design/topics
 */
function getTopicsController(req, res) {
    res.status(200).json({ message: "Topics fetched.", topics: TOPICS })
}

/**
 * @route GET /api/system-design/case/:id
 * Generates + caches an in-depth case study for the given topic.
 */
async function getCaseStudyController(req, res) {
    try {
        const topic = TOPICS.find(t => t.id === req.params.id)
        if (!topic) return res.status(404).json({ message: "Topic not found." })

        if (cache[topic.id]) {
            return res.status(200).json({ message: "Case study fetched.", caseStudy: cache[topic.id] })
        }

        const caseStudy = await generateSystemDesignCase({ topic: topic.label, difficulty: topic.difficulty })
        cache[topic.id] = { ...caseStudy, topicId: topic.id, label: topic.label }

        res.status(200).json({ message: "Case study generated.", caseStudy: cache[topic.id] })
    } catch (err) {
        console.error("getCaseStudyController error:", err)
        res.status(500).json({ message: "Failed to generate case study.", error: err.message })
    }
}

module.exports = { getTopicsController, getCaseStudyController }
