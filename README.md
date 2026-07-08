<div align="center">

# 🚀 PrepNova

### AI-Powered Interview Preparation Platform

**PrepNova** helps software engineers land their dream jobs through AI-generated interview reports, live mock interviews, behavioral coaching, coding practice, system design prep, and personalised learning roadmaps — all in one place.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)

</div>

---

## 📸 Overview

PrepNova is a full-stack SaaS application that uses **Google Gemini 2.5 Flash** to generate structured, schema-validated AI responses across every prep domain. Users get personalised interview reports, real-time mock practice sessions, resume analysis, company-specific prep guides, and a complete learning toolkit — all under one authenticated dashboard.

---

## ✨ Features

### 🎯 Core
| Feature | Description |
|---|---|
| **AI Interview Generator** | Upload your resume + paste a JD → get a match score, technical/behavioral questions with answers, skill gap analysis, and a day-by-day preparation plan |
| **Practice Interview** | Live ChatGPT-style mock interview with an AI interviewer. Topic-based (Frontend, Backend, System Design, Behavioral), 6-turn sessions, real-time progress tracking |
| **Dashboard** | Score trends, activity heatmap (84 days), XP system, level progression, streak counter, recent reports — all computed from real data |

### 🧠 Interview Prep
| Feature | Description |
|---|---|
| **Resume Analyzer** | Upload a PDF resume → AI returns ATS score (0–100), strengths, weaknesses, keyword suggestions |
| **JD Analyzer** | Paste any job description → AI returns match score, required vs missing skills, what to learn next |
| **Behavioral Round** | 10-question bank with STAR-method AI feedback — situation, task, action, result breakdown per answer |
| **HR Round Simulator** | Conversational HR interview simulator with confidence scoring |
| **Coding Round** | Problem bank with a built-in code editor, test case runner, and leaderboard |
| **System Design** | 12 topic case studies (URL shortener, Chat app, CDN, etc.) — AI generates requirements, components, scaling strategies, tradeoffs, estimations, and interview tips on demand |
| **Company Prep** | AI-generated company-specific prep profiles — interview process, past questions, culture, salary insights |

### 📚 Study Tools
| Feature | Description |
|---|---|
| **Learning Roadmap** | Role-based roadmaps (Full Stack, Frontend, Backend) with topic-level progress tracking and weekly goal setting |
| **Flashcards** | 15 seed cards across JS, React, System Design, DSA, Behavioral, Networking, CSS — filterable by topic, favoritable, flip animation |
| **Notes** | Full markdown notepad with folders, tags, search, and debounced auto-save |
| **Bookmarks** | Save questions, companies, flashcards, and notes — filterable by type |

### 👤 Account
| Feature | Description |
|---|---|
| **Profile** | Live XP/level stats, username update, password change |
| **Notifications** | Platform, streak, achievement, and reminder notifications with read/unread tracking |
| **Subscription** | Free / Pro / Team plan viewer with Stripe checkout stub |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI framework |
| **Vite** | 7 | Build tool & dev server |
| **React Router** | 7 | Client-side routing |
| **Axios** | 1.13 | HTTP client for all API calls |
| **Framer Motion** | 12 | Page transitions & animations |
| **Recharts** | 3.9 | Score trend charts & data visualisation |
| **React Icons** | 5.6 | Icon library (Feather icons) |
| **Sass** | 1.97 | Scoped component styling |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js + Express** | 5.2 | REST API server |
| **MongoDB + Mongoose** | 9.2 | Primary database & ODM |
| **JSON Web Tokens** | 9.0 | Stateless authentication |
| **bcryptjs** | 3.0 | Password hashing |
| **Multer** | 2.0 | Resume PDF file uploads (memory storage) |
| **pdf-parse** | 1.1 | Extract text from uploaded PDF resumes |
| **Puppeteer** | 24 | Headless Chrome for PDF resume generation |
| **cookie-parser** | 1.4 | HTTP-only cookie handling |
| **cors** | 2.8 | Cross-origin request configuration |
| **dotenv** | 17 | Environment variable management |

### AI Layer
| Technology | Purpose |
|---|---|
| **Google Gemini 2.5 Flash** (`@google/genai`) | Primary LLM for all AI features |
| **Zod** | Runtime schema validation for AI responses |
| **zod-to-json-schema** | Converts Zod schemas to JSON Schema for Gemini's `responseSchema` — enforces structured output |

> **How the AI layer works:** Every AI call uses Gemini's `responseMimeType: "application/json"` + `responseSchema` (derived from Zod schemas via `zod-to-json-schema`). This means Gemini's output is always a valid, typed JSON object — no prompt parsing, no regex extraction, no hallucinated field names. The Zod schema defines the contract; Gemini is constrained to honour it.

---

## 🗂 Project Structure

```
PrepNova/
├── Backend/
│   ├── server.js                 # Entry point
│   ├── .env                      # Environment variables (not committed)
│   └── src/
│       ├── app.js                # Express app, middleware, all route mounts
│       ├── config/
│       │   └── database.js       # Mongoose connection
│       ├── middlewares/
│       │   ├── auth.middleware.js # JWT verification
│       │   └── file.middleware.js # Multer setup
│       ├── models/               # 16 Mongoose models
│       ├── controllers/          # 18 controller files (one per feature)
│       ├── routes/               # 18 route files (one per feature)
│       └── services/
│           └── ai.service.js     # All Gemini AI calls + Zod schemas
│
└── Frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx               # Root — ToastProvider > AuthProvider > InterviewProvider > Router
        ├── app.routes.jsx        # All routes (public + protected)
        ├── main.jsx
        ├── config/
        │   └── navigation.js     # Sidebar nav config
        ├── styles/               # Global SCSS variables & mixins
        ├── pages/
        │   └── ComingSoon.jsx    # Scaffold page for mock-video
        ├── components/
        │   ├── layout/           # AppLayout, Sidebar, Topbar, Navbar, Footer
        │   └── ui/               # Button, GlassCard, Badge, Toast, Skeleton, PageHeader…
        └── features/             # 17 feature folders, each self-contained:
            ├── auth/             # Login, Register, Protected route, AuthContext
            ├── dashboard/        # Dashboard + 8 sub-components + dashboard.api.js
            ├── generator/        # AI report generator + report viewer
            ├── practice/         # Live mock interview chat
            ├── interview/        # InterviewContext + useInterview hook
            ├── resume-analyzer/  # Resume PDF upload & ATS analysis
            ├── jd-analyzer/      # JD paste & skill gap analysis
            ├── behavioral/       # STAR-method Q&A with AI feedback
            ├── coding-round/     # Code editor + problem bank + leaderboard
            ├── hr-round/         # HR chat simulator
            ├── company-prep/     # Company-specific prep profiles
            ├── system-design/    # Case study viewer (12 topics)
            ├── roadmap/          # Role-based progress roadmap
            ├── flashcards/       # Flip card study tool
            ├── notes/            # Markdown notepad with auto-save
            ├── bookmarks/        # Saved items across all features
            ├── notifications/    # In-app notification centre
            ├── profile/          # Account details + XP stats
            └── subscription/     # Plan viewer + Stripe checkout stub
```

---

## 🔑 Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_google_ai_studio_api_key
```

Get your Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey) — the free tier is sufficient for development.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- Google AI Studio API key

### Backend

```bash
cd Backend
npm install
# create your .env file (see above)
npm run dev       # starts on http://localhost:3000
```

### Frontend

```bash
cd Frontend
npm install
npm run dev       # starts on http://localhost:5173
```

---

## 🌐 API Routes

| Prefix | Feature |
|---|---|
| `/api/auth` | Register, login, logout, get-me |
| `/api/interview` | Generate report, list reports, get by ID, generate resume PDF |
| `/api/practice` | Start session, send message, get session, end session |
| `/api/dashboard` | Summary stats, score trend, recent interviews, activity heatmap |
| `/api/resume` | Analyze resume PDF |
| `/api/jd` | Analyze job description |
| `/api/behavioral` | Question bank, submit answer, get AI feedback |
| `/api/coding` | Problem list, submit solution, leaderboard |
| `/api/hr-round` | Start/continue HR simulation session |
| `/api/company-prep` | Search company, get prep profile |
| `/api/system-design` | Topic list, AI-generated case study |
| `/api/roadmap` | Get roadmap, update progress |
| `/api/flashcards` | Get cards (filtered), toggle favorite |
| `/api/notes` | CRUD notes with folder/tag/search |
| `/api/bookmarks` | Add, list, delete bookmarks |
| `/api/notifications` | List, mark read, mark all read |
| `/api/profile` | Get profile + stats, update username, change password |
| `/api/subscription` | View plans, initiate checkout |

---

## 🔒 Authentication Flow

1. User registers/logs in → server signs a JWT → stores it in an **HTTP-only cookie**
2. Every protected request sends the cookie automatically (no `Authorization` header needed)
3. `auth.middleware.js` verifies the JWT, attaches `req.user` for all downstream controllers
4. Blacklisted tokens (logout) are stored in MongoDB to prevent reuse

---

## 🤖 AI Features Deep Dive

All AI features go through `src/services/ai.service.js`. Each function:

1. Defines a **Zod schema** describing the exact shape of the response
2. Converts it to JSON Schema using `zod-to-json-schema`
3. Passes it to Gemini with `responseMimeType: "application/json"` and `responseSchema`
4. Parses and returns the guaranteed-valid JSON

| Function | Gemini Output |
|---|---|
| `generateInterviewReport` | Match score, technical Qs, behavioral Qs, skill gaps, prep plan, job title |
| `generateResumePdf` | Complete HTML resume (inline CSS, ATS-optimised) rendered to PDF by Puppeteer |
| `analyzeResume` | ATS score, strengths, weaknesses, keyword suggestions |
| `analyzeJobDescription` | Match score, required skills, missing skills, learning priorities |
| `getBehavioralFeedback` | STAR breakdown, score, strengths, improvements |
| `generateHrResponse` | HR interviewer reply + confidence scoring |
| `generateCompanyProfile` | Interview process, culture, past questions, salary insights, resources |
| `generateSystemDesignCase` | Requirements, components, scaling strategies, tradeoffs, estimations, interview tips |

---

## 📄 License

MIT — feel free to fork, extend, and deploy.

---

<div align="center">
Built with ❤️ using React, Node.js, MongoDB & Google Gemini
</div>
