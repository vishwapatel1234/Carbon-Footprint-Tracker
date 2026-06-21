# EcoPulse — Carbon Footprint Tracker

EcoPulse is a personalized carbon tracker designed to help individuals understand, monitor, and reduce their greenhouse gas emissions.

## Technology Stack
- **Frontend**: React + Vite, Recharts, LocalStorage
- **Backend**: Node.js + Express, Rate-limiter, Helmet, Cors, `@anthropic-ai/sdk` (Claude API)

## Project Structure
```
carbon-tracker/
├── frontend/                        ← React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                  ← Routing orchestrator
│   │   ├── components/
│   │   │   ├── Onboarding.jsx       ← Questionnaire
│   │   │   ├── FootprintForm.jsx    ← Calculations form
│   │   │   ├── FootprintChart.jsx   ← Recharts pie & benchmark bar visualizer
│   │   │   ├── AIInsight.jsx        ← Claude-insight + typewriter effect component
│   │   │   ├── ActionCard.jsx       ← Next action card with commitments
│   │   │   ├── ProgressTracker.jsx  ← History records, streaks, and pledges checklist
│   │   │   └── ErrorBoundary.jsx    ← React Error boundary
│   │   ├── hooks/
│   │   │   ├── useFootprint.js      ← API client caller hook
│   │   │   └── useHistory.js        ← LocalStorage logger history manager hook
│   │   ├── utils/
│   │   │   ├── constants.js         ← All emission factor constants
│   │   │   ├── carbon.js            ← Pure footprint math
│   │   │   ├── validation.js        ← Inputs validator rules
│   │   │   └── storage.js           ← Storage getters/seters
│   │   └── styles/
│   │       └── main.css             ← Glassmorphism dark mode style sheet
│   └── package.json
│
└── backend/                         ← Node.js Express server
    ├── server.js                    ← Secure routing and Claude gateway
    ├── .env                         ← Environment variables template
    └── package.json
```

## Setup Instructions

### 1. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder and supply your Anthropic API Key:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```
*Note: If no API key is specified, the application will automatically fall back to local heuristic calculations gracefully to ensure the app continues to function.*

### 2. Setup Frontend
```bash
cd ../frontend
npm install
```

## Running the Project

### Start Backend
From the `backend/` folder:
```bash
npm run dev
```

### Start Frontend
From the `frontend/` folder:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.
