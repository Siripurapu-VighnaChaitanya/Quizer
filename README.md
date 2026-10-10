# ExamPrep Hub

A fast, lightweight, responsive government-exam question-practice web application inspired by the clean, topic-wise learning experience of IndiaBIX.

**ExamPrep Hub** helps students prepare for Indian competitive and government examinations (including **RRB NTPC**, **RRB Group D**, **SSC CGL**, **SSC CHSL**, and State-level examinations) by practicing subject-wise and topic-wise MCQs with immediate feedback, step-by-step solutions, alternative solving methods, and progressively increasing difficulty.

---

## Key Features

- **Open Access, Zero Friction**: No mandatory login or registration. Starts immediately in any browser.
- **100% Database-Free Architecture**: No PostgreSQL, MySQL, MongoDB, SQLite, or Redis. All questions are stored in structured JSON files with in-memory caching on backend startup.
- **200 Original Verified MCQs**: Exactly 20 questions across each of the 10 starter topics (4 questions for each of the 5 difficulty levels).
- **Five Standardized Difficulty Levels**:
  - **Level 1 — Basic**: Direct definitions, fundamental concepts, and elementary recall.
  - **Level 2 — Easy**: Straightforward calculations and single-step applications.
  - **Level 3 — Medium**: Multi-step reasoning and standard exam patterns.
  - **Level 4 — Hard**: Conceptual depth, higher-tier problem solving, and closely related distractors.
  - **Level 5 — Exam Level**: Real-world competitive examination standard questions.
- **Practice Mode & Deliberate Learning**:
  - **Instant or Check Mode**: Option to check immediately upon selection or use a deliberate "Check Answer" button.
  - **Show Answer / Solution**: Reveals verified answer and full explanation. Transparently marks the question as revealed and awards **0 points**.
  - **Comprehensive Explanations**: Includes simple explanations, step-by-step breakdowns, **Alternative Methods** (Standard vs. Shortcut / Trick), and **Exam Tips**.
  - **Question Navigator Palette**: Interactive color-coded palette allowing one-click jumping between questions with live stats (Correct, Incorrect, Revealed, Remaining).
  - **Progressive Practice Mode**: Dynamically adapts difficulty based on user accuracy streaks.
  - **Retry Mistakes**: Dedicated filter to practice only questions answered incorrectly.
- **Exam-Style Mock Test Mode**:
  - Presets for **RRB NTPC (CBT-1)**, **SSC CGL (Tier-I)**, and Subject Sectionals, or custom configurations.
  - Timed countdown timer or untimed practice.
  - Authoritative backend grading with configurable negative marking (e.g. -0.25, -0.33, -0.50).
  - Answer keys and explanations are withheld during the exam to prevent leakage.
  - Full post-test review with complete step-by-step solutions and accuracy metrics.
- **Local Progress Persistence**:
  - Optional browser `localStorage` tracks progress and topic attempts offline without syncing claims.
  - Works reliably even if `localStorage` is disabled or corrupted.

---

## Technology Stack

### Frontend
- **Framework**: React.js (v19) + Vite
- **Language**: JavaScript (ES Modules)
- **Styling**: Vanilla CSS design system (no TailwindCSS)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

### Backend
- **Language**: Python 3.10+ (tested on Python 3.13)
- **Framework**: FastAPI
- **Data Validation**: Pydantic v2
- **ASGI Server**: Uvicorn
- **Automated Testing**: Pytest + HTTPX

### Storage
- **Format**: Structured JSON files in `backend/app/data/`
- **Cache**: Fast in-memory dictionaries populated on startup
- **Client**: React state + optional safe `localStorage`

---

## Project Structure

```text
Quizer/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application entry point
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       ├── health.py           # Health check endpoint
│   │   │       ├── exams.py            # Exam metadata and marking schemes
│   │   │       ├── subjects.py         # Subject listing
│   │   │       ├── topics.py           # Topic discovery with subject filters
│   │   │       ├── questions.py        # Question query and single retrieval
│   │   │       ├── practice.py         # Practice evaluation & reveal routes
│   │   │       ├── mock_tests.py       # Mock test generation & submission
│   │   │       └── quality.py          # Quality and validation report route
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py              # Pydantic schemas and request/response models
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── question_service.py     # In-memory JSON loading & filtering
│   │   │   ├── practice_service.py     # Answer evaluation & progressive hints
│   │   │   └── mock_test_service.py    # Test generation & authoritative scoring
│   │   └── data/
│   │       ├── manifest.json           # Master registry of exams, subjects & topics
│   │       ├── mathematics/
│   │       │   ├── percentages.json            # 20 MCQs (L1-L5)
│   │       │   ├── ratio_and_proportion.json   # 20 MCQs (L1-L5)
│   │       │   └── time_and_work.json          # 20 MCQs (L1-L5)
│   │       ├── reasoning/
│   │       │   ├── number_series.json          # 20 MCQs (L1-L5)
│   │       │   ├── blood_relations.json        # 20 MCQs (L1-L5)
│   │       │   └── direction_sense.json        # 20 MCQs (L1-L5)
│   │       ├── indian_polity/
│   │       │   ├── fundamental_rights.json     # 20 MCQs (L1-L5)
│   │       │   └── parliament_and_lawmaking.json# 20 MCQs (L1-L5)
│   │       └── general_science/
│   │           ├── physics_fundamentals.json   # 20 MCQs (L1-L5)
│   │           └── biology_fundamentals.json   # 20 MCQs (L1-L5)
│   ├── scripts/
│   │   └── validate_questions.py       # Standalone question bank validator
│   ├── tests/
│   │   ├── test_health.py
│   │   ├── test_subjects_topics.py
│   │   ├── test_questions.py
│   │   ├── test_practice.py
│   │   ├── test_mock_tests.py
│   │   └── test_validation.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Breadcrumbs.jsx
│   │   │   ├── DifficultyBadge.jsx
│   │   │   ├── ExplanationBox.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   └── QuestionPalette.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── SubjectPage.jsx
│   │   │   ├── PracticePage.jsx
│   │   │   ├── MockTestsPage.jsx
│   │   │   ├── MockTestActivePage.jsx
│   │   │   ├── MockTestResultPage.jsx
│   │   │   ├── ExamsOverviewPage.jsx
│   │   │   └── QualityReportPage.jsx
│   │   ├── services/
│   │   │   ├── api.js                  # Frontend Fetch API client
│   │   │   └── storage.js              # Safe LocalStorage abstraction
│   │   ├── styles/
│   │   │   └── index.css               # Clean modern design system
│   │   ├── App.jsx                     # View router & session state
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .gitignore
└── README.md
```

---

## Installation & Setup

### Prerequisites
- **Python**: 3.10+
- **Node.js**: v18+ with `npm`

### 1. Backend Setup

Open a terminal in the root project directory:

```bash
# Optional: create and activate a virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate

# On Linux/macOS:
source .venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt
```

### 2. Frontend Setup

In a separate terminal or after backend installation:

```bash
cd frontend
npm install
cd ..
```

---

## Running the Application

### 1. Start the Backend Server
From the project root:

```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/api/health`

### 2. Start the Frontend Development Server
From the `frontend/` directory:

```bash
cd frontend
npm run dev
```

- Web Application: `http://localhost:5173/`

*(Vite is configured with an automatic proxy forwarding `/api` calls directly to `http://127.0.0.1:8000`)*

---

## Initial Question Bank Overview

ExamPrep Hub ships with **200 original MCQs** across 10 starter topics (20 questions per topic, 4 questions across each of the 5 difficulty levels):

| Subject | Topic | Questions Published | Difficulty Breakdown |
| :--- | :--- | :---: | :---: |
| **Mathematics** | Percentages | 20 | 4 Basic, 4 Easy, 4 Medium, 4 Hard, 4 Exam |
| **Mathematics** | Ratio and Proportion | 20 | 4 Basic, 4 Easy, 4 Medium, 4 Hard, 4 Exam |
| **Mathematics** | Time and Work | 20 | 4 Basic, 4 Easy, 4 Medium, 4 Hard, 4 Exam |
| **Reasoning** | Number Series | 20 | 4 Basic, 4 Easy, 4 Medium, 4 Hard, 4 Exam |
| **Reasoning** | Blood Relations | 20 | 4 Basic, 4 Easy, 4 Medium, 4 Hard, 4 Exam |
| **Reasoning** | Direction Sense | 20 | 4 Basic, 4 Easy, 4 Medium, 4 Hard, 4 Exam |
| **Indian Polity** | Fundamental Rights | 20 | 4 Basic, 4 Easy, 4 Medium, 4 Hard, 4 Exam |
| **Indian Polity** | Parliament & Lawmaking | 20 | 4 Basic, 4 Easy, 4 Medium, 4 Hard, 4 Exam |
| **General Science** | Physics Fundamentals | 20 | 4 Basic, 4 Easy, 4 Medium, 4 Hard, 4 Exam |
| **General Science** | Biology Fundamentals | 20 | 4 Basic, 4 Easy, 4 Medium, 4 Hard, 4 Exam |
| **Total** | **10 Starter Topics** | **200 MCQs** | **40 Questions per Level (1-5)** |

---

## Question Schema & Format

All questions adhere strictly to this schema:

```json
{
  "id": "MATH-PERCENT-001",
  "subject": "mathematics",
  "topic": "percentages",
  "difficulty": 1,
  "question": "What is 25% of 480?",
  "options": [
    {"id": "A", "text": "110"},
    {"id": "B", "text": "120"},
    {"id": "C", "text": "130"},
    {"id": "D", "text": "140"}
  ],
  "correct_option": "B",
  "explanation": {
    "simple": "25% of any quantity is equivalent to one-fourth of that quantity.",
    "steps": [
      "Express 25% as a fraction: 25/100 = 1/4.",
      "Multiply 1/4 by 480: 480 ÷ 4 = 120."
    ],
    "methods": [
      {
        "name": "Fraction Method",
        "steps": ["25% = 1/4", "480 / 4 = 120"]
      },
      {
        "name": "Unitary Method",
        "steps": ["10% of 480 = 48", "20% = 96", "5% = 24", "25% = 96 + 24 = 120"]
      }
    ],
    "exam_tip": "Remember common fraction equivalents: 25% = 1/4, 50% = 1/2, 75% = 3/4.",
    "reference": "NCERT Class 7 Mathematics - Comparing Quantities"
  }
}
```

### Adding New Subjects or Topics
1. Register the subject or topic in `backend/app/data/manifest.json`.
2. Set `"is_available": true` and `"file": "<subject_folder>/<topic_file>.json"`.
3. Add the question records in that JSON file.
4. Run the validator (`python backend/scripts/validate_questions.py`) to verify schema and distribution. No code modification is needed!

---

## Running Automated Validation & Tests

### 1. Question Bank Validator
Verify schema syntax, duplicate IDs, 4 options, verified answer keys, and 5-level difficulty distribution:

```bash
python backend/scripts/validate_questions.py
```

### 2. Pytest Backend Suite
Run the 23 automated integration tests:

```bash
python -m pytest backend/tests -v
```

### 3. Frontend Production Build
Validate the client code bundle:

```bash
cd frontend
npm run build
cd ..
```

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health status and loaded question count |
| `GET` | `/api/exams` | Examination profiles and marking schemes |
| `GET` | `/api/subjects` | All subjects and topic lists |
| `GET` | `/api/topics?subject={id}` | Topic discovery with optional subject filter |
| `GET` | `/api/questions?topic={id}&difficulty={n}` | Filter questions (answers withheld by default) |
| `GET` | `/api/questions/{question_id}` | Retrieve question details |
| `POST` | `/api/practice/submit` | Evaluate selected option and get explanation |
| `POST` | `/api/practice/reveal` | Reveal verified solution (awards 0 points) |
| `GET` | `/api/mock-tests` | Available mock test presets |
| `POST` | `/api/mock-tests/generate` | Generate timed/untimed mock exam |
| `POST` | `/api/mock-tests/submit` | Grade mock submission and provide question review |
| `GET` | `/api/quality-report` | Real-time question bank validation report |

---

## Database-Free Architecture Rationale

- **Simplicity & Zero Maintenance**: Eliminates connection pool overhead, database migrations, connection timeouts, and external credential management.
- **Speed & Predictability**: All question files are parsed once on startup and stored in memory. Queries execute in sub-millisecond time.
- **Portability**: The entire application and its 200 questions run offline without third-party services, Docker containers, or cloud databases.
- **Git-Tracked Content**: Every question edit, answer key fix, or exam tip is version-controlled via Git history.

---

## 🌐 100% Free Hosting Guide

ExamPrep Hub requires **no database, no paid services, and no credit card** to deploy.

See [FREE_HOSTING_GUIDE.md](file:///c:/Users/Siripurapu%20Chaitanya/Desktop/Quizer/FREE_HOSTING_GUIDE.md) for full instructions:
- **Recommended Setup**: **Vercel** (Frontend CDN) + **Render** (Python FastAPI Backend).
- **All-in-One Setup**: **Render** or **Koyeb** running the multi-stage [Dockerfile](file:///c:/Users/Siripurapu%20Chaitanya/Desktop/Quizer/Dockerfile) or [render.yaml](file:///c:/Users/Siripurapu%20Chaitanya/Desktop/Quizer/render.yaml).
- **SPA Fallbacks**: Pre-configured [vercel.json](file:///c:/Users/Siripurapu%20Chaitanya/Desktop/Quizer/vercel.json) and `_redirects` ensure deep links refresh cleanly on edge networks.

---

## Known Limitations & Planned Enhancements

- **Syllabus Scope**: The initial release covers 10 starter topics (200 MCQs). Planned topics (Number System, Mensuration, Coding-Decoding, Modern Indian History, Chemistry) are registered in the manifest and marked as *Upcoming* in the UI.
- **Cross-Device Syncing**: Progress is saved locally per browser (`localStorage`). There is intentionally no centralized user tracking or multi-device sync in this release.
- **Future Enhancements**: Custom bookmarks, printable formula cheat-sheets, and offline Progressive Web App (PWA) caching.
