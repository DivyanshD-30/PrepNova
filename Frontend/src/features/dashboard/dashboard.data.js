// Dummy data for the Dashboard. Replace with real API responses once the
// backend endpoints below exist. Shapes are intentionally close to what a
// REST API would return, to keep the swap low-effort.

// @future-endpoint GET /api/dashboard/summary
export const DASHBOARD_SUMMARY = {
  totalInterviews: 42,
  averageScore: 78,
  streakDays: 9,
  hoursPracticed: 36,
  xp: 2340,
  level: 7,
  nextLevelXp: 3000,
}

// @future-endpoint GET /api/dashboard/score-trend
export const SCORE_TREND = [
  { day: 'Mon', score: 62 },
  { day: 'Tue', score: 68 },
  { day: 'Wed', score: 64 },
  { day: 'Thu', score: 74 },
  { day: 'Fri', score: 71 },
  { day: 'Sat', score: 80 },
  { day: 'Sun', score: 78 },
]

// @future-endpoint GET /api/dashboard/category-breakdown
export const CATEGORY_BREAKDOWN = [
  { name: 'Technical', value: 40 },
  { name: 'Behavioral', value: 25 },
  { name: 'System Design', value: 20 },
  { name: 'HR Round', value: 15 },
]

// @future-endpoint GET /api/dashboard/recent-interviews
export const RECENT_INTERVIEWS = [
  { id: 'int_1', company: 'Google', role: 'Frontend Engineer', score: 84, date: '2026-06-26', status: 'completed' },
  { id: 'int_2', company: 'Stripe', role: 'Backend Engineer', score: 71, date: '2026-06-24', status: 'completed' },
  { id: 'int_3', company: 'Netflix', role: 'Full Stack Engineer', score: null, date: '2026-06-29', status: 'scheduled' },
  { id: 'int_4', company: 'Airbnb', role: 'Senior Frontend Engineer', score: 90, date: '2026-06-20', status: 'completed' },
]

// @future-endpoint GET /api/dashboard/achievements
export const ACHIEVEMENTS = [
  { id: 'ach_1', title: '7-Day Streak', description: 'Practiced 7 days in a row', unlocked: true },
  { id: 'ach_2', title: 'Resume Pro', description: 'Scored 90+ on ATS analysis', unlocked: true },
  { id: 'ach_3', title: 'Coding Streak', description: 'Solved 10 coding problems', unlocked: false },
  { id: 'ach_4', title: 'System Designer', description: 'Completed 5 case studies', unlocked: false },
]

// @future-endpoint GET /api/dashboard/heatmap
// Generates a 12-week activity heatmap (84 days) with pseudo-random intensity
export const ACTIVITY_HEATMAP = Array.from({ length: 84 }).map((_, i) => ({
  day: i,
  intensity: Math.floor(Math.random() * 5), // 0 = no activity, 4 = heavy activity
}))

// @future-endpoint GET /api/dashboard/upcoming
export const UPCOMING_INTERVIEWS = [
  { id: 'up_1', company: 'Netflix', role: 'Full Stack Engineer', date: 'Jun 29, 2026', time: '10:00 AM' },
  { id: 'up_2', company: 'Adobe', role: 'UI Engineer', date: 'Jul 02, 2026', time: '2:30 PM' },
]
