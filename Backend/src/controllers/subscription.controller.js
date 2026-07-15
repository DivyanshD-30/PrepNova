const PLANS = [
    {
        id: "free",
        name: "Free",
        price: 0,
        billingCycle: "forever",
        description: "Get started with core prep tools.",
        features: [
            "5 AI interview reports/month",
            "Practice interview sessions",
            "Behavioral question bank",
            "Basic flashcards",
            "Community support"
        ],
        limits: { interviewReports: 5, practiceSession: 10 },
        cta: "Current Plan",
        highlighted: false
    },
    {
        id: "pro",
        name: "Pro",
        price: 12,
        billingCycle: "month",
        description: "Everything you need to land your next role.",
        features: [
            "Unlimited AI interview reports",
            "Unlimited practice sessions",
            "Resume & JD Analyzer",
            "HR Round simulator",
            "Coding round with leaderboard",
            "Company prep profiles",
            "Priority support"
        ],
        limits: { interviewReports: -1, practiceSession: -1 },
        cta: "Upgrade to Pro",
        highlighted: true
    },
    {
        id: "team",
        name: "Team",
        price: 49,
        billingCycle: "month",
        description: "For bootcamps and prep groups.",
        features: [
            "Everything in Pro",
            "Up to 10 team members",
            "Team analytics dashboard",
            "Shared company profiles",
            "Dedicated onboarding",
            "Custom branding"
        ],
        limits: { interviewReports: -1, practiceSession: -1 },
        cta: "Contact Sales",
        highlighted: false
    }
]

/**
 * @route GET /api/subscription/plans
 */
function getPlansController(req, res) {
    res.status(200).json({ message: "Plans fetched.", plans: PLANS, currentPlan: "free" })
}

/**
 * @route POST /api/subscription/checkout
 * body: { planId }
 * NOTE: This is a stub. Real payment processing (e.g. Stripe) would be
 * integrated here. Currently returns a placeholder checkout URL.
 */
function checkoutController(req, res) {
    const { planId } = req.body
    const plan = PLANS.find(p => p.id === planId)
    if (!plan) return res.status(404).json({ message: "Plan not found." })
    if (planId === "free") return res.status(400).json({ message: "You are already on the free plan." })
    if (planId === "team") return res.status(200).json({ message: "Please contact sales@prepnova.com to set up a Team plan.", contactSales: true })
    res.status(200).json({
        message: "Checkout initiated.",
        checkoutUrl: "https://checkout.stripe.com/placeholder",
        planId,
        note: "Payment integration (Stripe) is not yet configured. This is a stub endpoint."
    })
}

module.exports = { getPlansController, checkoutController }
