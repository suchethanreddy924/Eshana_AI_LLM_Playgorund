# Eshana.AI — LLM Playground

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