# FAF-Voice SDK

**Official xAI Voice Agent Integration**

Production setup for FAF-Voice with LiveKit + Grok Voice API.
Leo has eternal context from your FAF-Voice collection — no manual loading.

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React Client   │────▶│  Python Backend  │────▶│  xAI Grok API   │
│  (LiveKit SDK)  │◀────│  (LiveKit Agent) │◀────│  + Collections  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## Quick Start

### 1. Backend (Python)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your XAI_API_KEY to .env
python main.py
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

### 3. Talk to Leo

Click "Talk to Leo" → speak → Leo answers with full FAF-Voice context.

---

## Collection

```
ID: collection_cdde36ce-8baf-4080-92d1-342dd43827ce
```

Files in collection:
1. project.faf
2. architecture.md
3. skills.md
4. grok.md
5. ABOUT.md
6. grokipedia.md

---

## Test Queries

- "What is FAF-Voice?"
- "What's the tech stack?"
- "Explain the architecture"
- "What can you do?"

---

## Deployment

**Backend:** Render.com, Railway, or any Python host
**Frontend:** Vercel, Netlify, or static host

---

## Links

- FAF: https://faf.one
- Grokipedia: https://grokipedia.com/page/faf-file-format
- xAI Console: https://console.x.ai

---

*Wolfe-Core lives. Eternal context, forever.*
