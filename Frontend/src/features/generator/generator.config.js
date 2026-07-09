// Config for the AI Interview Generator's extended targeting fields.
// These fields (company, role, experience, difficulty, tech stack, interview
// type) are NOT yet accepted by the backend — today the real endpoint
// (POST /api/interview/) only takes { jobDescription, selfDescription, resume }.
//
// They are collected here and shown in the generated payload so the UI/UX is
// fully ready; wiring them in later just means adding these fields to the
// Express controller + Mongoose schema and appending them to the FormData
// in interview.api.js.

export const EXPERIENCE_LEVELS = ['Internship', 'Entry Level', 'Mid Level', 'Senior', 'Staff / Principal']

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard', 'Adaptive']

export const TECH_STACKS = [
  'React', 'Node.js', 'Python', 'Java', 'Go', 'TypeScript',
  'AWS', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Next.js',
]

export const INTERVIEW_TYPES = ['Technical', 'Behavioral', 'System Design', 'HR Round', 'Mixed']

export const POPULAR_COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Apple', 'Stripe', 'Uber',
]
