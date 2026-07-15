const flashcardModel = require("../models/flashcard.model")
const userFlashcardModel = require("../models/userFlashcard.model")

const SEED_FLASHCARDS = [
    { topic: "JavaScript", category: "Frontend", difficulty: "easy",   question: "What is the difference between `let`, `const`, and `var`?", answer: "`var` is function-scoped and hoisted. `let` is block-scoped and not hoisted to a value. `const` is block-scoped and cannot be reassigned (though objects/arrays it points to can be mutated)." },
    { topic: "JavaScript", category: "Frontend", difficulty: "medium", question: "Explain the event loop in JavaScript.", answer: "JS is single-threaded. The event loop pulls callbacks from the task queue and microtask queue into the call stack when it's empty. Microtasks (Promises) run before macrotasks (setTimeout)." },
    { topic: "JavaScript", category: "Frontend", difficulty: "hard",   question: "What is closure and give a real-world use case?", answer: "A closure is a function that retains access to its outer scope even after the outer function has returned. Common use: factory functions, memoisation, and module patterns (data privacy)." },
    { topic: "React", category: "Frontend", difficulty: "easy",       question: "What is the difference between props and state?", answer: "Props are read-only inputs passed from parent to child. State is local, mutable data managed inside a component that triggers a re-render when changed." },
    { topic: "React", category: "Frontend", difficulty: "medium",     question: "When would you use `useCallback` vs `useMemo`?", answer: "`useMemo` memoises a computed value; `useCallback` memoises a function reference. Use them to avoid unnecessary re-renders in child components that receive these as props." },
    { topic: "System Design", category: "Architecture", difficulty: "medium", question: "What is horizontal vs vertical scaling?", answer: "Vertical scaling = adding more power (CPU/RAM) to one machine. Horizontal scaling = adding more machines. Horizontal scaling is preferred for large-scale systems as it avoids a single point of failure." },
    { topic: "System Design", category: "Architecture", difficulty: "hard",   question: "Explain CAP theorem.", answer: "A distributed system can guarantee at most two of: Consistency, Availability, Partition tolerance. Since partitions always occur in practice, you choose between CP (consistent but may be unavailable) or AP (available but may return stale data)." },
    { topic: "Databases", category: "Backend", difficulty: "easy",    question: "What is an index and why does it help?", answer: "An index is a data structure (typically a B-tree) that lets the DB locate rows without a full table scan. It speeds up reads but slows down writes due to index maintenance." },
    { topic: "Databases", category: "Backend", difficulty: "medium",  question: "What is the N+1 query problem?", answer: "When fetching a list of N records and then making N separate queries for related data. Fix it with JOIN queries, eager loading, or DataLoader (batching)." },
    { topic: "Algorithms", category: "DSA", difficulty: "easy",       question: "What is the time complexity of binary search?", answer: "O(log n). Each step halves the search space, so for n elements you need at most log₂(n) comparisons." },
    { topic: "Algorithms", category: "DSA", difficulty: "medium",     question: "Explain dynamic programming in one sentence and give an example.", answer: "DP breaks problems into overlapping subproblems and caches their solutions to avoid recomputation. Classic example: Fibonacci (top-down memoisation) or 0/1 Knapsack (bottom-up tabulation)." },
    { topic: "Behavioral", category: "Soft Skills", difficulty: "medium", question: "What does STAR stand for and how do you use it?", answer: "Situation, Task, Action, Result. Structure every behavioral answer: describe the context (S), your specific responsibility (T), the concrete steps you took (A), and the measurable outcome (R)." },
    { topic: "Networking", category: "Backend", difficulty: "easy",   question: "What is the difference between HTTP and HTTPS?", answer: "HTTPS is HTTP with TLS encryption. It ensures data confidentiality (encrypted), integrity (not tampered), and authentication (server identity verified via certificate)." },
    { topic: "Networking", category: "Backend", difficulty: "medium", question: "What happens when you type a URL in a browser?", answer: "DNS resolves the domain → TCP handshake with the server → TLS handshake (HTTPS) → HTTP request sent → server processes it → HTTP response → browser parses HTML, fetches sub-resources, renders." },
    { topic: "CSS", category: "Frontend", difficulty: "medium",       question: "What is the CSS Box Model?", answer: "Every element is a box of: content, padding (inside border), border, margin (outside border). `box-sizing: border-box` includes padding and border in the width, which is usually what you want." },
]

async function seedIfEmpty() {
    const count = await flashcardModel.countDocuments()
    if (count === 0) {
        await flashcardModel.insertMany(SEED_FLASHCARDS)
    }
}

/**
 * @route GET /api/flashcards?topic=X&difficulty=Y
 */
async function getFlashcardsController(req, res) {
    try {
        await seedIfEmpty()
        const { topic, difficulty } = req.query
        const filter = {}
        if (topic) filter.topic = topic
        if (difficulty) filter.difficulty = difficulty

        const cards = await flashcardModel.find(filter).sort({ topic: 1 })

        const userCards = await userFlashcardModel.find({ user: req.user.id })
        const favMap = {}
        userCards.forEach(uc => { favMap[uc.flashcard.toString()] = uc.favorited })

        const topics = [...new Set(SEED_FLASHCARDS.map(c => c.topic))]

        res.status(200).json({
            message: "Flashcards fetched.",
            flashcards: cards.map(c => ({
                ...c.toObject(),
                favorited: favMap[c._id.toString()] || false
            })),
            topics
        })
    } catch (err) {
        console.error("getFlashcardsController error:", err)
        res.status(500).json({ message: "Failed to fetch flashcards.", error: err.message })
    }
}

/**
 * @route POST /api/flashcards/:id/favorite
 * body: { favorited: true|false }
 */
async function toggleFavoriteController(req, res) {
    try {
        const { id } = req.params
        const { favorited } = req.body

        const card = await flashcardModel.findById(id)
        if (!card) return res.status(404).json({ message: "Flashcard not found." })

        await userFlashcardModel.findOneAndUpdate(
            { user: req.user.id, flashcard: id },
            { favorited, lastSeen: new Date() },
            { upsert: true, new: true }
        )

        res.status(200).json({ message: "Favorite updated.", favorited })
    } catch (err) {
        console.error("toggleFavoriteController error:", err)
        res.status(500).json({ message: "Failed to update favorite.", error: err.message })
    }
}

module.exports = { getFlashcardsController, toggleFavoriteController }
