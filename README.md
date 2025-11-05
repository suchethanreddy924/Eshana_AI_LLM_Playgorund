# Eshana.AI — LLM Playground

A secure, local playground for experimenting with multiple LLM providers via a React (Vite) frontend and a Node/Express backend. Designed to be safe for open-source: environment files are ignored, and example/config guidance is provided so secrets are never committed.

## Overview
- React UI built with Vite for fast dev experience.
- Express server proxies requests to LLM providers (OpenAI, Anthropic, Google, Cohere).
- Clean separation of client and server with CORS enabled.
- Project defaults keep secrets out of Git via `.gitignore`.

## Tech Stack
- Frontend: `React`, `Vite`, `TailwindCSS`
- Backend: `Node.js`, `Express`, `dotenv`
- Tooling: `ESLint`, `Nodemon`, `Concurrently`

## Quick Start
1) Install dependencies:
   - `npm install`
2) Start both client and server in one shot:
   - `npm run dev:full`
   - Frontend runs on `http://localhost:5173` (default); server on `http://localhost:3000` (see server code).
3) Or run separately:
   - Client: `npm run dev`
   - Server (dev): `npm run server:dev`
   - Server (prod): `npm run server:start`

## Required Configuration (.env)
Create an `.env` file at the project root with the provider keys you plan to use. Example keys:

```
# Choose the providers you need and add valid keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key
COHERE_API_KEY=your_cohere_key

# Server
PORT=3000
```

Notes:
- `.env` and `.env.*` are excluded by `.gitignore` to prevent leaking credentials.
- Do not commit real API keys. Share a redacted `.env.example` if you want to document variables publicly.

## Scripts
- `npm run dev` — start Vite dev server.
- `npm run build` — build production assets.
- `npm run preview` — preview built assets locally.
- `npm run server:dev` — start Express with nodemon.
- `npm run server:start` — start Express without nodemon.
- `npm run dev:full` — run client and server together (concurrently).

## Folder Structure
```
e:\my-test-llmplayground
├── public/               # Static assets
├── src/                  # React app
│   ├── components/       # UI components
│   ├── context/          # React context
│   ├── index.css         # Styles
│   └── main.jsx          # Entry
├── server/               # Express server
│   ├── index.js          # Server setup
│   └── routes/           # Route handlers (auth, chat)
├── .gitignore            # Keeps secrets and artifacts out of Git
├── package.json          # Scripts and dependencies
├── tailwind.config.js    # Tailwind setup
└── vite.config.js        # Vite config
```

## Security & Privacy
- Secrets are never committed; `.env` files are ignored by Git.
- Prefer environment variables over hardcoding keys anywhere in the repo.
- If you previously committed secrets, rotate those tokens and purge the history.
- For production, restrict CORS and lock down server routes.

## Deployment Tips
- Use provider-specific keys per environment (dev/staging/prod).
- Keep `.env` out of your container images; inject values via your platform’s secret manager.
- Validate incoming requests server-side before proxying to LLM providers.

## Troubleshooting
- If the frontend can’t reach the backend, verify the server port and CORS.
- If provider calls fail, check that the relevant API key is set in `.env` and loaded by `dotenv`.
- On Windows, CRLF line ending warnings are harmless; Git normalizes line endings.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

## Contributing
Issues and PRs are welcome. Please avoid committing any secrets, refresh tokens, or private user data. Use `.env.example` patterns for configuration.

A simple, local-first LLM playground with multiple AI providers, chat history, and system instructions. Backend is Express; frontend is React + Vite. Designed for safe local development without publishing secrets.

## Features
- Chat with multiple providers: OpenAI, Anthropic, Google, Cohere, DeepSeek, Mistral, Perplexity
- System instructions editor and quick inline prompts
- Local chat history (per user) with pruning
- Streaming responses over SSE

## Getting Started

### Prerequisites
- Node.js 18+
- Git

### Install
```
npm install
```

### Environment Variables
- Copy `.env.example` to `.env` and fill in the keys you plan to use.
- `.env` is gitignored; never commit real secrets.

```
PORT=3001
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
COHERE_API_KEY=
XAI_API_KEY=
DEEPSEEK_API_KEY=
MISTRAL_API_KEY=
PERPLEXITY_API_KEY=
```

### Run locally
- Start backend:
```
npm run server:start
```
- Start frontend:
```
npm run dev
```
- App: `http://localhost:5173/`
- Backend health: `http://localhost:3001/api/health`

## Security Notes
- `.gitignore` excludes `.env` and `server/data/` to avoid leaking secrets or PII.
- Current auth implementation is dev-only (plaintext). For public release: hash passwords, use JWT, enable `helmet`, tighten `cors`, and add rate limiting.

## License
- Add a license file before publishing if you intend to open source.