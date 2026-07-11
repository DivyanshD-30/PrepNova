// Dummy data + mock conversation engine for the Practice Interview feature.
// Replace `getMockAiResponse` with a real call to the backend once it exists.
//
// @future-endpoint POST /api/practice/session            - start a session
// @future-endpoint POST /api/practice/session/:id/message - send a user message, get AI reply
// @future-endpoint GET  /api/practice/session/:id         - resume a session
// @future-endpoint PATCH /api/practice/session/:id/end     - end + score a session

export const PRACTICE_TOPICS = [
  { id: 'frontend', label: 'Frontend Engineering' },
  { id: 'backend', label: 'Backend Engineering' },
  { id: 'system-design', label: 'System Design' },
  { id: 'behavioral', label: 'Behavioral' },
]

export const MOCK_QUESTION_BANK = {
  frontend: [
    'Tell me about a time you optimized a slow-loading page. What was your approach?',
    'How would you design a reusable component library for a large team?',
    'Walk me through how you would debug a memory leak in a React application.',
    'How do you decide between client-side and server-side rendering for a feature?',
    'Describe a tricky CSS layout bug you fixed and how you diagnosed it.',
  ],
  backend: [
    'How would you design a rate limiter for a public API?',
    'Tell me about a time you had to optimize a slow database query.',
    'How do you approach designing idempotent APIs?',
    'Walk me through how you would handle a sudden 10x spike in traffic.',
  ],
  'system-design': [
    'Design a URL shortening service like bit.ly. Walk me through your approach.',
    'How would you design a notification system that scales to millions of users?',
    'Design the backend for a real-time chat application.',
  ],
  behavioral: [
    'Tell me about a time you disagreed with a teammate. How did you handle it?',
    'Describe a project that failed. What did you learn?',
    'Tell me about a time you had to deliver difficult feedback.',
  ],
}

const FOLLOW_UPS = [
  "That's a solid approach. What trade-offs did you consider along the way?",
  'Good answer. How would your solution change if the scale increased 10x?',
  "I like that. Can you walk me through how you'd measure whether it actually worked?",
  'Interesting — what would you do differently if you had to do it again?',
  "Makes sense. What was the hardest part of that for you personally?",
]

/**
 * Simulates an AI interviewer's reply. In production this becomes a single
 * POST to /api/practice/session/:id/message with { message } and the
 * response shape { reply, progress, done }.
 */
export function getMockAiResponse({ topic, turnIndex }) {
  const bank = MOCK_QUESTION_BANK[topic] || MOCK_QUESTION_BANK.frontend
  if (turnIndex === 0) {
    return bank[0]
  }
  if (turnIndex < bank.length) {
    // Alternate between a follow-up and the next fresh question for variety
    return turnIndex % 2 === 1
      ? FOLLOW_UPS[turnIndex % FOLLOW_UPS.length]
      : bank[turnIndex]
  }
  return "That wraps up this practice round. You've covered the core areas well — check your summary on the right for a breakdown."
}

export const SESSION_LENGTH = 6 // turns before a session is considered "complete"
