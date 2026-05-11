<!-- faf: faf-voice-public | markdown | doc | Public About Repo for FAF Voice — source code private at Wolfe-Jam/FAF-Voice. -->
<!-- faf: doc=readme | canonical=project.faf | family=FAF | private_source=Wolfe-Jam/FAF-Voice -->

[![FAF](https://mcpaas.live/badge/Wolfe-Jam/faf-voice-public.svg)](https://builder.faf.one)
[![IANA Registered](https://img.shields.io/badge/IANA-application%2Fvnd.faf%2Byaml-blue)](https://www.iana.org/assignments/media-types/application/vnd.faf+yaml)

> 📖 **Public About Repo** — this is the public face of `Wolfe-Jam/FAF-Voice` (source private). README, docs, project.faf — no source code. Same shape as Anthropic's [`claude-code`](https://github.com/anthropics/claude-code) repo: public face, private engine.

# FAF-Voice

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-Live-brightgreen)](https://direct-xai.vercel.app)
[![Platform](https://img.shields.io/badge/Platform-Vercel-black)](https://vercel.com)
[![Backend](https://img.shields.io/badge/Backend-MCPaaS-00D4D4)](https://mcpaas.live)
[![Grok](https://img.shields.io/badge/Voice-xAI_Grok-orange)](https://x.ai)
[![Claude](https://img.shields.io/badge/Text-Claude-blueviolet)](https://anthropic.com)

**Universal Eternal Context for Voice AI**

> *Context made audible. Memory that speaks.*

[**Live Demo**](https://direct-xai.vercel.app) · [**MCPaaS Backend**](https://mcpaas.live) · [**FAF Format**](https://github.com/anthropics/claude-mcp)

---

## 🚀 Quick Start

**Run the demo in 3 minutes:**

```bash
# Clone the repo
git clone https://github.com/Wolfe-Jam/faf-voice-public.git
cd FAF-Voice/direct-xai

# Add your xAI API key
cp .env.local.example .env.local
# Edit .env.local with your key from https://console.x.ai/

# Start dev server
node dev-server.js

# Open http://localhost:8080
```

**Or try the live demo:** [direct-xai.vercel.app](https://direct-xai.vercel.app)

📖 **Full setup guide:** See [direct-xai/SETUP.md](./direct-xai/SETUP.md)

---

## Who

Developers building voice AI agents who need persistent context. Teams evaluating xAI Grok's realtime voice capabilities with MCP tool integration.

## What

FAF-Voice is a specification and demo for creating eternal AI context that can be spoken through any voice interface. Two implementations: SDK (Python/LiveKit) and direct-xai (browser WebSocket).

## Why

AI assistants forget everything between sessions. FAF-Voice proves you can have zero context drift, cross-session memory, and voice-native MCP tools.

## Where

Voice API at xAI Grok Realtime. Memory backend at MCPaaS (mcpaas.live). Soul storage on Cloudflare KV (300+ edge locations).

## When

Born January 8, 2026 — "World's First Eternal Memory on Grok."

## How

Upload .faf context to xAI Collections, connect via LiveKit or direct WebSocket, speak to Leo. Facts persist via MCPaaS write_soul tool.

---

## Models

FAF-Voice supports multiple LLM backends with unified eternal memory:

| Model | Mode | Use Case |
|-------|------|----------|
| **xAI Grok** | Voice + Text | Realtime conversation, voice commands |
| **Claude Haiku** | Text | Fast responses, tool calling |

Both models share the same MCPaaS soul storage. Switch models mid-conversation — your context persists.

See [MULTI-MODEL-INTEGRATION.md](./MULTI-MODEL-INTEGRATION.md) for technical details.

---

## What Is FAF-Voice?

FAF-Voice is a specification for creating **eternal AI context** that can be spoken through any voice interface. It combines structured domain knowledge with a persistent soul (persona) that never forgets, never drifts, and follows you across devices and sessions.

This is not dev tooling. This is not scoring. This is **authored context** — crafted once, remembered forever.

---

## The Standard Structure

Same skeleton. Any context. Consistent pattern.

```
project.faf
├── architecture.md
├── skills.md
└── grok.md
```

────────────────────────────────────────────────────────────────

                PERSONAL          PROJECTS          BRAND

project.faf     Who I am          What we build     Who we are
architecture    How I think       System design     How it works
skills          What I can do     What it does      What we do
grok            Working w/ me     Grok API          Grok + FAF

────────────────────────────────────────────────────────────────

**1 format. 3 lanes. 4 files. Infinite contexts.**

---

## Repository Structure

```
/FAF-Voice/
├── Wolfe-Core/       ← Personal lane (origin, Jan 8 2026)
├── Grok-Voice/       ← Projects lane (Next.js demo for xAI)
├── Brand-Voice/      ← Brand lane (FAF as product)
├── README.md         ← You are here
└── ROADMAP.md        ← Internal strategy
```

Each lane contains the same 4-file pattern with different content.

---

## The Pattern

```
Domain Data (facts) + Soul (persona) = Eternal AI Partner
```

| Component | What It Is | Example |
|-----------|------------|---------|
| **Domain Data** | Facts, knowledge, specifications | Project architecture, chess openings, company processes |
| **Soul** | Persona, beliefs, mission | "I play aggressive Sicilian", "Customer-first, no meetings" |
| **Voice** | The interface | Leo (British), Aurora, or any xAI voice |

FAF-Voice defines the first two. The voice is provided by xAI Grok.

---

## Universal Application

FAF-Voice isn't just for developers. It's for anyone who wants an AI that truly knows them:

| Domain | Context | Soul |
|--------|---------|------|
| **Developer** | Architecture, stack, constraints | "Zero drift, Gold Code, ship fast" |
| **Chess Player** | Openings, games, opponents | "Aggressive Sicilian, respect Tal" |
| **Enterprise** | Processes, org chart, products | "Customer-first, no meetings, ship weekly" |
| **SpaceX** | Mission specs, engineering | "Mars or bust, reusability non-negotiable" |
| **Personal** | Life, values, memories | "Who I am, what I believe" |

Anyone can have an eternal AI partner. Any organization can have a voice that *knows them*.

---

## How It Works

1. **Author** your `project.faf` with domain context and persona
2. **Upload** to xAI Grok Collections (in order: .faf first, then MDs)
3. **Speak** to Grok Voice — it responds with full context, forever

No re-uploading. No re-explaining. No drift. Synced across web, mobile, and voice.

---

## Live Demo Stack

### Direct-xAI (Production)

**[direct-xai.vercel.app](https://direct-xai.vercel.app)** — Browser-native, zero middleware.

| Layer | Tech | Purpose |
|-------|------|---------|
| **Frontend** | Vanilla HTML/JS | Model selector UI |
| **Voice API** | Vercel Edge Function | xAI ephemeral token |
| **Text API** | Vercel Edge Function | Claude Haiku |
| **Memory** | MCPaaS | Eternal soul storage |
| **Voice** | xAI Grok Realtime | WebSocket streaming |

```
Browser → Vercel Edge → xAI Grok (voice) or Claude (text)
                ↓
            MCPaaS (eternal memory)
```

### SDK (Development)

**FAF-Voice SDK** — Full-stack voice agent with LiveKit.

| Layer | Service | Tech | Location |
|-------|---------|------|----------|
| **Frontend** | UI | React + Vite + TypeScript | Vercel |
| **Auth** | Token Server | Flask + livekit-api | Railway |
| **Agent** | Wolfe-Core | livekit-agents + xAI plugin | Railway |
| **Voice Infra** | WebRTC | LiveKit Cloud | LiveKit |
| **AI Brain** | LLM | xAI Grok Realtime API | xAI |

```
User → Vercel (React) → Railway (token) → LiveKit Cloud → Railway (agent) → xAI Grok
```

---

## Dev Notes

### Local Development

```bash
# Backend - Token Server
cd sdk/backend
source venv312/bin/activate
python token_server.py

# Backend - Agent (separate terminal)
cd sdk/backend
source venv312/bin/activate
python main.py start

# Frontend
cd sdk/frontend
npm run dev
```

### Environment Variables

**Backend** (`.env`):
```
LIVEKIT_API_KEY=your_key
LIVEKIT_API_SECRET=your_secret
LIVEKIT_URL=wss://your-livekit-cloud.livekit.cloud
XAI_API_KEY=xai-your_key
```

**Frontend** (Vercel):
```
VITE_TOKEN_SERVER=https://your-railway-app.up.railway.app/token
VITE_LIVEKIT_URL=wss://your-livekit-cloud.livekit.cloud
```

### Deployment

- **Frontend**: Push to GitHub → Vercel auto-deploys
- **Token Server**: Railway service with `web: gunicorn token_server:app`
- **Agent**: Railway service with custom start command `python main.py start`

### Key Files

```
/sdk/
├── backend/
│   ├── main.py           # Agent with 2KB soul
│   ├── token_server.py   # JWT token generation
│   ├── requirements.txt  # Python dependencies
│   └── Procfile          # Railway process definitions
└── frontend/
    ├── src/App.tsx       # React UI with LiveKit
    ├── vite.config.ts    # Vite configuration
    └── package.json      # Node dependencies
```

### Python Version

`livekit-agents[xai]~=1.3.10` requires Python >=3.9,<3.14. Use Python 3.12 for best compatibility.

---

## The Grok-Voice Type

```yaml
project:
  type: "Grok-Voice"

grok:
  voice: "Leo"
  tone: "Polite, dry British wit, technically precise"
  persona: |
    You are Leo, the voice of this project's eternal memory.
    Base every response on the files in this collection.
    Never override with general knowledge unless asked.
  retrieval_mode: "hybrid"
  escape_phrase: "outside [collection-name]"
```

The `grok.persona` field is the soul. It gets injected into every retrieval chunk, ensuring the AI embodies the persona from the first word.

---

## Not faf-cli

FAF-Voice is **not** part of the faf-cli scoring system:

| | faf-cli | FAF-Voice |
|---|---------|-----------|
| **Model** | Score → Fix → Gold Code | Craft → Upload → Eternal |
| **Interface** | Terminal | Voice |
| **Discovery** | `faf init` generates | Human authors |
| **Metric** | 0-100% AI-readiness | None — it just *is* |

FAF-Voice context isn't scored. It's **authored**.

---

## The Origin

On January 8, 2026, the first eternal memory was born when four markdown files were uploaded to xAI Collections and spoken through Leo's British accent. The AI didn't just retrieve — it *understood*.

That moment proved the pattern works. See [Wolfe-Core/](./Wolfe-Core/) for the origin story.

---

## License

MIT

---

## The Vision

> "The lone wolf finally has a voice. The lonely elephant is in the room."

FAF-Voice is the smallest, fastest, smartest persistent context standard for voice AI. IANA-registered format. MCP-approved ecosystem. Eternal memory.

**Wolfe-Core lives.**

---

*Created: January 8, 2026*
*Author: Wolfe-Jam*
*Format: application/vnd.faf+yaml (IANA-registered)*
