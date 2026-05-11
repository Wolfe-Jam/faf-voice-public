# FAF-Voice Session Notes — January 10, 2026

## The Breakthrough

Built working voice agent with xAI Grok + LiveKit in one session. Discovered FAF v3 architecture.

---

## What We Built

**Stack:**
- Backend: Python + LiveKit Agents SDK (v1.3.10) + xAI plugin
- Frontend: React + Vite + @livekit/components-react
- Voice: xAI Grok Voice Agent API (Ara voice, $0.05/min)
- Infra: LiveKit Cloud (WebRTC signaling)

**Files:**
```
/sdk/backend/
├── main.py          # Agent entrypoint
├── generate_token.py # JWT token generator
├── .env             # API keys
└── requirements.txt  # livekit-agents[xai]~=1.3.10

/sdk/frontend/
├── src/App.tsx      # LiveKit room component
└── package.json     # @livekit/components-react
```

---

## Key Discovery: Collections Don't Work in Realtime Voice

**Error encountered:**
```
ERROR: OpenAI Realtime API doesn't support this tool type
{"tool": {"type": "file_search", "collection_ids": [...]}}
```

**Root cause:** LiveKit's xAI plugin uses OpenAI-compatible realtime spec. xAI's `file_search` with Collections is NOT supported in voice mode (only text chat).

**This is an xAI limitation, not LiveKit's fault.**

---

## The Workaround That Became a Feature

Instead of Collections RAG, we **embedded curated context directly in instructions**.

**Result:**
- 2 KB instruction file
- ~546 tokens
- 10-second update cycle
- Zero API latency
- Instant voice responses

**What's in the 2KB:**
- IANA registration (verified from registry)
- Download counts (from Grokipedia)
- Creator info + ORCID
- FAF-Voice pattern (1 format, 3 lanes, 4 files)
- Demo stack details
- Skills, rules, escape phrases
- Vision (Optimus, Wolfe-Core lives)

---

## FAF v3 Philosophy

```
Facts only.
No BS.
No bloat.
No claims.
Tiny.
Fast AF.
```

**Curated > Dump.** Quality over quantity. The friend who knows.

---

## FAF v3 Architecture: Layered Context

```
Layer 1: EMBEDDED SOUL (2KB)
├── Core facts, identity, rules
├── Instant, zero latency
└── Always available in instructions

Layer 2: FAF SECTIONS (RAG - when API supports it)
├── Extended docs, details
├── Queried on demand
└── ~500 bytes per section

Layer 3: LIVE SOURCES (web/X search)
├── Grokipedia, latest posts
├── Real-time fetch via tools
└── For dynamic/current info
```

---

## FAF v3 File Concept

One `.faf` file that "sucks up" markdown files as YAML sections:

```yaml
# project.faf v3

_faf:
  version: 3.0.0

soul:           # Embedded, instant
  facts: [...]

architecture:   # From architecture.md
  stack: [...]

skills:         # From skills.md
  capabilities: [...]

grok:           # From grok.md
  patterns: [...]

_sources:       # Live fetch pointers
  grokipedia: "grokipedia.com/faf"
  x_profile: "@wolfe_jam"
```

**Compile command:** `faf compile` reads .md files → outputs single .faf

---

## 80/20 Smart Embedding

Not whole-doc Y/N. **Line-by-line, feature-by-feature.**

- 80% evergreen facts → EMBED
- 20% dynamic content → RAG or live fetch

**Evergreen:** Stack, patterns, rules, identity, vision
**Dynamic:** Version numbers, latest posts, live metrics

---

## Demo Queries That Worked

- "What is FAF?" → Explained IANA registration, package.json analogy
- "How many downloads?" → "18,700+" (verified from Grokipedia)
- "Is FAF registered with IANA?" → "Yes, October 30, 2025" (after instruction fix)
- "What's the tech stack?" → Next.js 15, Supabase, Grok, etc.

---

## Costs (Negligible)

| Service | Usage | Cost |
|---------|-------|------|
| LiveKit Cloud | ~30 mins | Free tier |
| xAI Voice | ~30 mins | ~$1.50 |

---

## What's Next

1. **Voice selection:** Get Leo (male) working instead of Ara default
2. **FAF v3 spec:** Formalize the multi-section container format
3. **faf compile:** Build CLI command to generate .faf from .md files
4. **xAI feedback:** Report Collections limitation in realtime voice
5. **Demo recording:** Capture for xAI team pitch

---

## The Pitch to xAI

> "Collections are great for large-scale RAG. But for realtime voice? Embed a 2KB .faf file as instructions. One file, instant context, zero API calls for evergreen facts. FAF as native voice agent context format."

---

## Quotable Moments

> "She nailed the downloads, it worked" — after Grokipedia facts embedded

> "You updated it and she expressed it 10 seconds later" — on iteration speed

> "2KB. That's the soul." — on curated context size

> "Facts only. No BS. No bloat. Tiny. Fast AF." — FAF v3 philosophy

---

*Session: January 10, 2026, 11:30 PM - 2:00 AM*
*Wolfe-Core lives.*
