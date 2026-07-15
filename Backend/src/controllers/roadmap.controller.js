const roadmapProgressModel = require("../models/roadmapProgress.model")

const ROADMAP = {
    "Full Stack Engineer": [
        { id: "html-css", label: "HTML & CSS Fundamentals", category: "Frontend" },
        { id: "javascript", label: "JavaScript (ES6+)", category: "Frontend" },
        { id: "react", label: "React & Component Design", category: "Frontend" },
        { id: "state-management", label: "State Management", category: "Frontend" },
        { id: "nodejs", label: "Node.js & Express", category: "Backend" },
        { id: "rest-apis", label: "REST API Design", category: "Backend" },
        { id: "mongodb", label: "MongoDB & Mongoose", category: "Backend" },
        { id: "sql", label: "SQL & Relational Databases", category: "Backend" },
        { id: "auth", label: "Authentication & JWT", category: "Backend" },
        { id: "docker", label: "Docker & Containers", category: "DevOps" },
        { id: "git", label: "Git & Version Control", category: "DevOps" },
        { id: "system-design-basics", label: "System Design Basics", category: "System Design" },
        { id: "data-structures", label: "Data Structures", category: "DSA" },
        { id: "algorithms", label: "Algorithms & Complexity", category: "DSA" },
        { id: "testing", label: "Unit & Integration Testing", category: "Quality" },
    ],
    "Frontend Engineer": [
        { id: "html-css", label: "HTML & CSS Fundamentals", category: "Basics" },
        { id: "javascript", label: "JavaScript (ES6+)", category: "Basics" },
        { id: "typescript", label: "TypeScript", category: "Language" },
        { id: "react", label: "React & Hooks", category: "Framework" },
        { id: "next", label: "Next.js / SSR", category: "Framework" },
        { id: "state-management", label: "State Management", category: "Architecture" },
        { id: "performance", label: "Web Performance Optimization", category: "Architecture" },
        { id: "accessibility", label: "Accessibility (WCAG)", category: "Quality" },
        { id: "testing-fe", label: "Frontend Testing", category: "Quality" },
        { id: "data-structures", label: "Data Structures & Algorithms", category: "DSA" },
    ],
    "Backend Engineer": [
        { id: "nodejs", label: "Node.js & Express", category: "Runtime" },
        { id: "rest-apis", label: "REST & GraphQL APIs", category: "APIs" },
        { id: "sql", label: "SQL & Query Optimization", category: "Databases" },
        { id: "mongodb", label: "NoSQL Databases", category: "Databases" },
        { id: "caching", label: "Caching (Redis)", category: "Scalability" },
        { id: "queues", label: "Message Queues", category: "Scalability" },
        { id: "auth", label: "Auth, OAuth & Security", category: "Security" },
        { id: "docker", label: "Docker & Kubernetes", category: "DevOps" },
        { id: "system-design-basics", label: "System Design", category: "Architecture" },
        { id: "data-structures", label: "Data Structures & Algorithms", category: "DSA" },
    ],
}

const ROLES = Object.keys(ROADMAP)

/**
 * @route GET /api/roadmap
 */
async function getRoadmapController(req, res) {
    try {
        const progress = await roadmapProgressModel.findOne({ user: req.user.id })
        const role = progress?.targetRole || "Full Stack Engineer"
        const topics = ROADMAP[role] || ROADMAP["Full Stack Engineer"]

        res.status(200).json({
            message: "Roadmap fetched.",
            roadmap: {
                role,
                topics,
                completedTopics: progress?.completedTopics || [],
                weeklyGoal: progress?.weeklyGoal || 5,
                roles: ROLES
            }
        })
    } catch (err) {
        console.error("getRoadmapController error:", err)
        res.status(500).json({ message: "Failed to fetch roadmap.", error: err.message })
    }
}

/**
 * @route PATCH /api/roadmap/progress
 * body: { topicId, completed, weeklyGoal, targetRole }
 */
async function updateProgressController(req, res) {
    try {
        const { topicId, completed, weeklyGoal, targetRole } = req.body

        let progress = await roadmapProgressModel.findOne({ user: req.user.id })
        if (!progress) {
            progress = new roadmapProgressModel({ user: req.user.id })
        }

        if (targetRole && ROLES.includes(targetRole)) {
            progress.targetRole = targetRole
        }
        if (weeklyGoal != null) {
            progress.weeklyGoal = weeklyGoal
        }
        if (topicId != null) {
            if (completed && !progress.completedTopics.includes(topicId)) {
                progress.completedTopics.push(topicId)
            } else if (!completed) {
                progress.completedTopics = progress.completedTopics.filter(t => t !== topicId)
            }
        }

        await progress.save()

        res.status(200).json({ message: "Progress updated.", progress })
    } catch (err) {
        console.error("updateProgressController error:", err)
        res.status(500).json({ message: "Failed to update progress.", error: err.message })
    }
}

module.exports = { getRoadmapController, updateProgressController }
