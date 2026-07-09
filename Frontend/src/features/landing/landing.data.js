import {
  FiZap, FiMessageSquare, FiVideo, FiFileText, FiClipboard, FiCode,
  FiLayers, FiUsers, FiMic, FiBriefcase, FiMap, FiCheck, FiStar,
} from 'react-icons/fi'

export const FEATURES = [
  {
    icon: FiZap,
    title: 'AI Interview Generator',
    description: 'Generate a tailored interview based on company, role, experience level, and tech stack in seconds.',
    glow: 'primary',
  },
  {
    icon: FiMessageSquare,
    title: 'Practice Interview',
    description: 'A ChatGPT-style conversation with a typing AI interviewer, voice mode, and live progress tracking.',
    glow: 'secondary',
  },
  {
    icon: FiVideo,
    title: 'Mock Video Interview',
    description: 'Camera preview, mic indicator, question timer, and fullscreen recording mode for realistic practice.',
    glow: 'accent',
  },
  {
    icon: FiFileText,
    title: 'Resume Analyzer',
    description: 'Get an ATS score, strengths, weaknesses, and concrete suggestions with visual charts.',
    glow: 'success',
  },
  {
    icon: FiClipboard,
    title: 'JD Analyzer',
    description: 'Paste a job description and see keyword matches, missing skills, and what to learn next.',
    glow: 'primary',
  },
  {
    icon: FiCode,
    title: 'Coding Round',
    description: 'A full code editor with test cases, submissions, a timer, and a competitive leaderboard.',
    glow: 'accent',
  },
  {
    icon: FiLayers,
    title: 'System Design Prep',
    description: 'Interactive roadmaps, real architecture diagrams, and case studies with a whiteboard mode.',
    glow: 'secondary',
  },
  {
    icon: FiUsers,
    title: 'Behavioral Questions',
    description: 'STAR-method cards with AI feedback, example answers, and a personal scoring system.',
    glow: 'success',
  },
  {
    icon: FiMic,
    title: 'HR Round Simulator',
    description: 'Conversational HR practice with a confidence score and emotion-analysis insights.',
    glow: 'primary',
  },
  {
    icon: FiBriefcase,
    title: 'Company Preparation',
    description: 'Deep-dive company profiles: interview process, past questions, salary insights, resources.',
    glow: 'accent',
  },
  {
    icon: FiMap,
    title: 'Learning Roadmap',
    description: 'A personalized, interactive roadmap with weekly goals and a visual progress tracker.',
    glow: 'secondary',
  },
  {
    icon: FiLayers,
    title: 'Flashcards & Notes',
    description: 'Swipeable flashcards plus a full markdown notes system with folders, search, and tags.',
    glow: 'success',
  },
]

export const HOW_IT_WORKS = [
  {
    title: 'Tell us your target role',
    description: 'Share the company, role, experience level, and tech stack you\u2019re preparing for.',
  },
  {
    title: 'Get a tailored prep plan',
    description: 'Our AI generates technical, behavioral, and HR questions matched to that exact role.',
  },
  {
    title: 'Practice like it\u2019s real',
    description: 'Run mock interviews with voice, video, and a live AI interviewer that reacts to your answers.',
  },
  {
    title: 'Track progress & improve',
    description: 'See your scores, skill gaps, and a roadmap that adapts as you get stronger.',
  },
]

export const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Apple',
  'Stripe', 'Airbnb', 'Uber', 'Salesforce', 'Adobe', 'Spotify',
]

export const CATEGORIES = [
  { title: 'Frontend Engineering', count: 240 },
  { title: 'Backend Engineering', count: 310 },
  { title: 'Full Stack', count: 280 },
  { title: 'System Design', count: 95 },
  { title: 'Data Structures & Algorithms', count: 420 },
  { title: 'Behavioral & HR', count: 150 },
  { title: 'Product Management', count: 110 },
  { title: 'DevOps & Cloud', count: 130 },
]

export const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'SDE-2, hired at a FAANG company',
    quote: 'The mock interviews felt closer to the real thing than anything else I tried. I walked into my onsite already calm.',
    rating: 5,
  },
  {
    name: 'Daniel Osei',
    role: 'Frontend Engineer, Series B startup',
    quote: 'The resume analyzer caught three gaps I never noticed. My interview callback rate doubled within two weeks.',
    rating: 5,
  },
  {
    name: 'Mei Lin',
    role: 'New Grad, Backend Engineer',
    quote: 'The system design roadmap broke down concepts I\u2019d been avoiding for months. Finally clicked.',
    rating: 5,
  },
  {
    name: 'Carlos Vega',
    role: 'Engineering Manager candidate',
    quote: 'Behavioral prep with STAR feedback made my answers tighter and way more specific.',
    rating: 4,
  },
]

export const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get a feel for AI-powered interview prep.',
    features: [
      '3 AI-generated interview plans / month',
      'Basic resume analysis',
      'Community question bank',
      'Email support',
    ],
    cta: 'Start for free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/ month',
    description: 'For active job seekers who want every edge.',
    features: [
      'Unlimited AI interview plans',
      'Mock video interviews',
      'Advanced resume + JD analysis',
      'Coding round with leaderboard',
      'Priority support',
    ],
    cta: 'Start Pro trial',
    highlighted: true,
  },
  {
    name: 'Teams',
    price: '$49',
    period: '/ month',
    description: 'For bootcamps, universities, and career coaches.',
    features: [
      'Everything in Pro',
      'Up to 10 seats',
      'Cohort analytics dashboard',
      'Custom company question banks',
      'Dedicated success manager',
    ],
    cta: 'Talk to sales',
    highlighted: false,
  },
]

export const FAQS = [
  {
    q: 'How does the AI Interview Generator work?',
    a: 'You tell us the company, role, experience level, difficulty, and tech stack. Our AI then builds a full interview plan with technical, behavioral, and HR questions tailored to that combination.',
  },
  {
    q: 'Is the mock video interview recorded or stored?',
    a: 'Recordings are processed for feedback and are never shared. You can delete any recording from your dashboard at any time.',
  },
  {
    q: 'Can I use PrepNova if I don\u2019t have a resume yet?',
    a: 'Yes. You can use the quick self-description field instead, and our AI will build a plan from that alone.',
  },
  {
    q: 'Do you support non-technical roles?',
    a: 'Yes — behavioral, HR round, and company-preparation tools work for any role, and our question bank spans product, design, and more.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, you can cancel from your subscription settings at any time with no cancellation fee.',
  },
]

export const STATS = [
  { label: 'Interview plans generated', value: 128000, suffix: '+' },
  { label: 'Average match-score improvement', value: 34, suffix: '%' },
  { label: 'Companies covered', value: 540, suffix: '+' },
  { label: 'Mock interviews completed', value: 86000, suffix: '+' },
]
