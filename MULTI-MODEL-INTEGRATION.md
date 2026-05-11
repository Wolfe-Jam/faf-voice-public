# FAF-Voice Multi-Model Integration

**LLM-agnostic text chat with unified MCPaaS memory.**

---

## Overview

FAF-Voice supports multiple LLM backends. Users can select their preferred model, or the system can auto-route based on task complexity.

```
User Message
     ↓
┌─────────────────────────────────────────┐
│         Model Router                     │
│  [Auto] or [User Selection]             │
└─────────────────────────────────────────┘
     ↓                ↓                ↓
┌─────────┐    ┌─────────┐    ┌─────────┐
│  Grok   │    │ Claude  │    │ Gemini  │
│  (xAI)  │    │(Anthro) │    │(Google) │
└─────────┘    └─────────┘    └─────────┘
     ↓                ↓                ↓
     └────────────────┼────────────────┘
                      ↓
              ┌─────────────┐
              │   MCPaaS    │
              │ (Souls/KV)  │
              └─────────────┘
```

---

## Supported Models

### xAI (Grok)

| Property | Value |
|----------|-------|
| **Provider** | xAI |
| **Model ID** | `grok-3` |
| **Version** | Latest (auto-updated) |
| **Voice** | ✅ Native (Leo, Sage, etc.) |
| **Text** | ✅ |
| **Tool Use** | ✅ |
| **Streaming** | ✅ |
| **Input Cost** | ~$3/M tokens |
| **Output Cost** | ~$15/M tokens |
| **Context Window** | 131K tokens |
| **Best For** | Voice chat, realtime, personality |

**Environment:**
```bash
XAI_API_KEY=xai-...
```

**SDK:**
```bash
npm install xai-sdk
# or use OpenAI-compatible endpoint
```

---

### Anthropic (Claude)

| Property | Value |
|----------|-------|
| **Provider** | Anthropic |
| **Model ID** | `claude-haiku-4-5-20250514` (default) |
| **Alt Model** | `claude-sonnet-4-20250514` (complex) |
| **Alt Model** | `claude-opus-4-5-20251101` (max quality) |
| **Version** | 4.5 (January 2025) |
| **Voice** | ❌ |
| **Text** | ✅ |
| **Tool Use** | ✅ |
| **Streaming** | ✅ |
| **Prompt Caching** | ✅ (90% cost reduction) |

**Pricing:**

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| Haiku 4.5 | $1/M | $5/M | Default, fast, cheap |
| Sonnet 4.5 | $3/M | $15/M | Complex reasoning |
| Opus 4.5 | $15/M | $75/M | Maximum quality |

**Environment:**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**SDK:**
```bash
npm install @anthropic-ai/sdk
```

---

### Google (Gemini)

| Property | Value |
|----------|-------|
| **Provider** | Google |
| **Model ID** | `gemini-2.0-flash` (default) |
| **Alt Model** | `gemini-2.0-pro` (complex) |
| **Alt Model** | `gemini-1.5-pro` (legacy, 2M context) |
| **Version** | 2.0 (December 2024) |
| **Voice** | ❌ (Gemini Live separate) |
| **Text** | ✅ |
| **Tool Use** | ✅ |
| **Streaming** | ✅ |
| **Context Window** | 1M tokens (Flash), 2M (Pro) |

**Pricing:**

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| Flash 2.0 | $0.10/M | $0.40/M | Fast, cheapest |
| Pro 2.0 | $1.25/M | $5/M | Complex reasoning |

**Environment:**
```bash
GEMINI_API_KEY=AIza...
```

**SDK:**
```bash
npm install @google/generative-ai
```

---

### OpenAI (GPT) - Optional

| Property | Value |
|----------|-------|
| **Provider** | OpenAI |
| **Model ID** | `gpt-4o` (default) |
| **Alt Model** | `gpt-4o-mini` (cheap) |
| **Alt Model** | `o1` (reasoning) |
| **Version** | 4o (2024) |
| **Voice** | ✅ (Realtime API, separate) |
| **Text** | ✅ |
| **Tool Use** | ✅ |
| **Streaming** | ✅ |

**Pricing:**

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| GPT-4o mini | $0.15/M | $0.60/M | Fast, cheap |
| GPT-4o | $2.50/M | $10/M | Balanced |
| o1 | $15/M | $60/M | Deep reasoning |

**Environment:**
```bash
OPENAI_API_KEY=sk-...
```

**SDK:**
```bash
npm install openai
```

---

## Model Selection Modes

### Mode 1: User Selection (Default)

User picks model from dropdown. Persists in localStorage.

```typescript
// Frontend state
const [model, setModel] = useState<ModelId>(
  localStorage.getItem('preferred-model') || 'grok'
);

// On change
const handleModelChange = (newModel: ModelId) => {
  setModel(newModel);
  localStorage.setItem('preferred-model', newModel);
};
```

### Mode 2: Auto-Routing

System selects model based on:
1. Task complexity
2. Cost optimization
3. Feature requirements

```typescript
// lib/auto-router.ts

type ModelId = 'grok' | 'claude-haiku' | 'claude-sonnet' | 'gemini-flash' | 'gemini-pro';

interface RouterConfig {
  preferCheap: boolean;      // Optimize for cost
  preferFast: boolean;       // Optimize for speed
  preferQuality: boolean;    // Optimize for quality
  voiceEnabled: boolean;     // Voice required?
}

export function autoSelectModel(
  message: string,
  config: RouterConfig = { preferCheap: true, preferFast: true, preferQuality: false, voiceEnabled: false }
): ModelId {

  // Voice required? Only Grok
  if (config.voiceEnabled) {
    return 'grok';
  }

  // Analyze message complexity
  const wordCount = message.split(/\s+/).length;
  const hasCodeRequest = /code|function|implement|debug|fix/i.test(message);
  const hasAnalysis = /analyze|compare|explain|why|how/i.test(message);
  const isSimple = wordCount < 20 && !hasCodeRequest && !hasAnalysis;

  // Simple queries → Cheapest (Gemini Flash)
  if (isSimple && config.preferCheap) {
    return 'gemini-flash';
  }

  // Code/reasoning → Claude (best at code)
  if (hasCodeRequest) {
    return config.preferQuality ? 'claude-sonnet' : 'claude-haiku';
  }

  // Analysis → Claude Sonnet or Gemini Pro
  if (hasAnalysis) {
    return config.preferCheap ? 'gemini-pro' : 'claude-sonnet';
  }

  // Default → Balanced (Claude Haiku)
  return 'claude-haiku';
}
```

### Mode 3: Fixed Model

Hardcoded for specific deployments (e.g., xAI demo = Grok only).

```typescript
// For xAI demo
const FIXED_MODEL = 'grok';

// All requests use this model
const response = await handleChat(messages, soul, FIXED_MODEL);
```

---

## Implementation

### 1. Types

```typescript
// types/models.ts

export type Provider = 'xai' | 'anthropic' | 'google' | 'openai';

export type ModelId =
  // xAI
  | 'grok'
  // Anthropic
  | 'claude-haiku'
  | 'claude-sonnet'
  | 'claude-opus'
  // Google
  | 'gemini-flash'
  | 'gemini-pro'
  // OpenAI (optional)
  | 'gpt-4o-mini'
  | 'gpt-4o';

export interface ModelConfig {
  id: ModelId;
  provider: Provider;
  apiModel: string;           // Actual API model string
  name: string;               // Display name
  description: string;
  voice: boolean;
  inputCost: number;          // Per million tokens
  outputCost: number;
  contextWindow: number;
  tier: 'fast' | 'balanced' | 'quality';
}

export const MODELS: Record<ModelId, ModelConfig> = {
  // xAI
  'grok': {
    id: 'grok',
    provider: 'xai',
    apiModel: 'grok-3',
    name: 'Grok',
    description: 'xAI - Voice + Text, personality-rich',
    voice: true,
    inputCost: 3,
    outputCost: 15,
    contextWindow: 131072,
    tier: 'balanced'
  },

  // Anthropic
  'claude-haiku': {
    id: 'claude-haiku',
    provider: 'anthropic',
    apiModel: 'claude-haiku-4-5-20250514',
    name: 'Claude Haiku',
    description: 'Anthropic - Fast, efficient, 90% quality',
    voice: false,
    inputCost: 1,
    outputCost: 5,
    contextWindow: 200000,
    tier: 'fast'
  },
  'claude-sonnet': {
    id: 'claude-sonnet',
    provider: 'anthropic',
    apiModel: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet',
    description: 'Anthropic - Best for code and reasoning',
    voice: false,
    inputCost: 3,
    outputCost: 15,
    contextWindow: 200000,
    tier: 'balanced'
  },
  'claude-opus': {
    id: 'claude-opus',
    provider: 'anthropic',
    apiModel: 'claude-opus-4-5-20251101',
    name: 'Claude Opus',
    description: 'Anthropic - Maximum quality',
    voice: false,
    inputCost: 15,
    outputCost: 75,
    contextWindow: 200000,
    tier: 'quality'
  },

  // Google
  'gemini-flash': {
    id: 'gemini-flash',
    provider: 'google',
    apiModel: 'gemini-2.0-flash',
    name: 'Gemini Flash',
    description: 'Google - Fastest, cheapest',
    voice: false,
    inputCost: 0.1,
    outputCost: 0.4,
    contextWindow: 1000000,
    tier: 'fast'
  },
  'gemini-pro': {
    id: 'gemini-pro',
    provider: 'google',
    apiModel: 'gemini-2.0-pro',
    name: 'Gemini Pro',
    description: 'Google - Balanced quality',
    voice: false,
    inputCost: 1.25,
    outputCost: 5,
    contextWindow: 2000000,
    tier: 'balanced'
  },

  // OpenAI (optional)
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    provider: 'openai',
    apiModel: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'OpenAI - Fast, affordable',
    voice: false,
    inputCost: 0.15,
    outputCost: 0.6,
    contextWindow: 128000,
    tier: 'fast'
  },
  'gpt-4o': {
    id: 'gpt-4o',
    provider: 'openai',
    apiModel: 'gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI - Flagship multimodal',
    voice: false,
    inputCost: 2.5,
    outputCost: 10,
    contextWindow: 128000,
    tier: 'balanced'
  }
};
```

### 2. Provider Handlers

```typescript
// lib/providers/index.ts

import { handleGrok } from './grok';
import { handleClaude } from './claude';
import { handleGemini } from './gemini';
import { handleOpenAI } from './openai';
import { ModelId, MODELS } from '@/types/models';

export async function handleChat(
  messages: Message[],
  soulContext: string | null,
  modelId: ModelId
): Promise<ChatResponse> {
  const config = MODELS[modelId];

  switch (config.provider) {
    case 'xai':
      return handleGrok(messages, soulContext, config);
    case 'anthropic':
      return handleClaude(messages, soulContext, config);
    case 'google':
      return handleGemini(messages, soulContext, config);
    case 'openai':
      return handleOpenAI(messages, soulContext, config);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}
```

```typescript
// lib/providers/claude.ts

import Anthropic from '@anthropic-ai/sdk';
import { ModelConfig, Message, ChatResponse } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function handleClaude(
  messages: Message[],
  soulContext: string | null,
  config: ModelConfig
): Promise<ChatResponse> {

  // Build system with optional caching
  const system: Anthropic.MessageCreateParams['system'] = [];

  if (soulContext) {
    system.push({
      type: 'text',
      text: `Project context:\n\n${soulContext}`,
      cache_control: { type: 'ephemeral' }  // 90% cost savings
    });
  }

  system.push({
    type: 'text',
    text: 'You are a helpful assistant with access to eternal memory via MCPaaS.'
  });

  const response = await anthropic.messages.create({
    model: config.apiModel,
    max_tokens: 1024,
    system,
    messages: messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))
  }, {
    headers: {
      'anthropic-beta': 'token-efficient-tools-2025-02-19'
    }
  });

  // Extract text
  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n');

  return {
    role: 'assistant',
    content: text,
    model: config.id,
    provider: 'anthropic',
    usage: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
      cached: response.usage.cache_read_input_tokens || 0
    }
  };
}
```

```typescript
// lib/providers/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ModelConfig, Message, ChatResponse } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function handleGemini(
  messages: Message[],
  soulContext: string | null,
  config: ModelConfig
): Promise<ChatResponse> {

  const model = genAI.getGenerativeModel({
    model: config.apiModel,
    systemInstruction: soulContext
      ? `Project context:\n\n${soulContext}\n\nYou are a helpful assistant.`
      : 'You are a helpful assistant.'
  });

  // Convert message history
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const chat = model.startChat({ history });
  const lastMessage = messages[messages.length - 1].content;

  const result = await chat.sendMessage(lastMessage);
  const response = result.response;

  return {
    role: 'assistant',
    content: response.text(),
    model: config.id,
    provider: 'google',
    usage: {
      input: response.usageMetadata?.promptTokenCount || 0,
      output: response.usageMetadata?.candidatesTokenCount || 0
    }
  };
}
```

```typescript
// lib/providers/grok.ts (wrapper for existing)

import { ModelConfig, Message, ChatResponse } from '@/types';

export async function handleGrok(
  messages: Message[],
  soulContext: string | null,
  config: ModelConfig
): Promise<ChatResponse> {

  // xAI uses OpenAI-compatible API
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model: config.apiModel,
      messages: [
        ...(soulContext ? [{
          role: 'system',
          content: `Project context:\n\n${soulContext}`
        }] : []),
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages
      ]
    })
  });

  const data = await response.json();

  return {
    role: 'assistant',
    content: data.choices[0].message.content,
    model: config.id,
    provider: 'xai',
    usage: {
      input: data.usage?.prompt_tokens || 0,
      output: data.usage?.completion_tokens || 0
    }
  };
}
```

### 3. API Route

```typescript
// api/chat.ts (Vercel Edge Function)

import { handleChat } from '@/lib/providers';
import { autoSelectModel } from '@/lib/auto-router';
import { ModelId, MODELS } from '@/types/models';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { messages, soul, model, autoSelect } = await req.json();

  // Load soul context from MCPaaS
  let soulContext: string | null = null;
  if (soul) {
    try {
      const res = await fetch(`https://mcpaas.live/raw/${soul}`);
      if (res.ok) {
        soulContext = await res.text();
      }
    } catch (e) {
      console.error('Failed to load soul:', e);
    }
  }

  // Determine model
  let selectedModel: ModelId;

  if (autoSelect) {
    const lastMessage = messages[messages.length - 1].content;
    selectedModel = autoSelectModel(lastMessage, {
      preferCheap: true,
      preferFast: true,
      preferQuality: false,
      voiceEnabled: false
    });
  } else {
    selectedModel = model || 'grok';
  }

  // Validate model exists
  if (!MODELS[selectedModel]) {
    return new Response(JSON.stringify({ error: 'Unknown model' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await handleChat(messages, soulContext, selectedModel);

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate response',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### 4. Frontend Components

```tsx
// components/ModelSelector.tsx

import { ModelId, MODELS, ModelConfig } from '@/types/models';

interface Props {
  selected: ModelId;
  onChange: (model: ModelId) => void;
  autoSelect: boolean;
  onAutoSelectChange: (auto: boolean) => void;
  voiceMode: boolean;  // If true, only show voice-capable models
}

export function ModelSelector({
  selected,
  onChange,
  autoSelect,
  onAutoSelectChange,
  voiceMode
}: Props) {

  const availableModels = Object.values(MODELS).filter(
    m => !voiceMode || m.voice
  );

  // Group by provider
  const byProvider = availableModels.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = [];
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, ModelConfig[]>);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      {/* Auto toggle */}
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={autoSelect}
          onChange={(e) => onAutoSelectChange(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm">Auto-select model</span>
        <span className="text-xs text-gray-500">(optimizes for cost/speed)</span>
      </label>

      {/* Manual selection */}
      {!autoSelect && (
        <div className="space-y-3">
          {Object.entries(byProvider).map(([provider, models]) => (
            <div key={provider}>
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                {provider}
              </div>
              <div className="flex flex-wrap gap-2">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => onChange(model.id)}
                    className={`px-3 py-2 rounded-md text-sm transition ${
                      selected === model.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">
                      {model.name}
                      {model.voice && ' 🎤'}
                    </div>
                    <div className="text-xs opacity-70">
                      ${model.inputCost}/${model.outputCost} per M
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show selected model info */}
      {autoSelect && (
        <div className="text-sm text-gray-600">
          Model will be auto-selected based on your message.
          Currently using: <strong>{MODELS[selected].name}</strong>
        </div>
      )}
    </div>
  );
}
```

```tsx
// components/ModelBadge.tsx

import { ModelId, MODELS } from '@/types/models';

interface Props {
  model: ModelId;
  usage?: { input: number; output: number; cached?: number };
}

export function ModelBadge({ model, usage }: Props) {
  const config = MODELS[model];

  // Calculate cost
  const cost = usage
    ? ((usage.input * config.inputCost) + (usage.output * config.outputCost)) / 1000000
    : null;

  return (
    <div className="inline-flex items-center gap-1 text-xs text-gray-500">
      <span className="font-medium">{config.name}</span>
      {config.voice && <span>🎤</span>}
      {usage && (
        <span className="text-gray-400">
          ({usage.input + usage.output} tokens
          {usage.cached ? `, ${usage.cached} cached` : ''}
          {cost && ` · $${cost.toFixed(4)}`})
        </span>
      )}
    </div>
  );
}
```

---

## Environment Variables

```bash
# .env.local (Vercel)

# Required - at least one
XAI_API_KEY=xai-...                    # Grok
ANTHROPIC_API_KEY=sk-ant-api03-...     # Claude
GEMINI_API_KEY=AIza...                 # Gemini

# Optional
OPENAI_API_KEY=sk-...                  # GPT (if needed)

# MCPaaS (shared storage)
MCPAAS_TOKEN=wolfe-68-orange
```

---

## Cost Comparison Matrix

| Query Type | Grok | Claude Haiku | Claude Sonnet | Gemini Flash | Gemini Pro |
|------------|------|--------------|---------------|--------------|------------|
| Simple (100 tokens) | $0.0018 | $0.0006 | $0.0018 | $0.00005 | $0.0006 |
| Medium (500 tokens) | $0.009 | $0.003 | $0.009 | $0.00025 | $0.003 |
| Complex (2000 tokens) | $0.036 | $0.012 | $0.036 | $0.001 | $0.012 |
| **1000 queries/day** | **$36** | **$12** | **$36** | **$1** | **$12** |

**Winner by use case:**
- **Cheapest**: Gemini Flash ($0.10/M in, $0.40/M out)
- **Best code**: Claude Sonnet
- **Best voice**: Grok (only option)
- **Fastest**: Gemini Flash
- **Best value**: Claude Haiku (90% quality at 1/3 cost)

---

## Auto-Routing Logic

```
User Message
     ↓
┌─────────────────────────────────────────┐
│  Is voice mode enabled?                  │
│  YES → Grok                             │
└─────────────────────────────────────────┘
     ↓ NO
┌─────────────────────────────────────────┐
│  Message < 20 words, no keywords?        │
│  YES → Gemini Flash (cheapest)          │
└─────────────────────────────────────────┘
     ↓ NO
┌─────────────────────────────────────────┐
│  Contains code/debug/implement?          │
│  YES → Claude (Haiku or Sonnet)         │
└─────────────────────────────────────────┘
     ↓ NO
┌─────────────────────────────────────────┐
│  Contains analyze/compare/explain?       │
│  YES → Claude Sonnet or Gemini Pro      │
└─────────────────────────────────────────┘
     ↓ NO
┌─────────────────────────────────────────┐
│  Default → Claude Haiku                  │
│  (best balance of cost/quality)          │
└─────────────────────────────────────────┘
```

---

## Feature Matrix

| Feature | Grok | Claude | Gemini | GPT |
|---------|------|--------|--------|-----|
| Voice (native) | ✅ | ❌ | ❌ | ⚠️ |
| Text chat | ✅ | ✅ | ✅ | ✅ |
| Tool use | ✅ | ✅ | ✅ | ✅ |
| Streaming | ✅ | ✅ | ✅ | ✅ |
| Prompt caching | ❌ | ✅ | ❌ | ❌ |
| Image input | ✅ | ✅ | ✅ | ✅ |
| PDF input | ❌ | ✅ | ✅ | ❌ |
| Code execution | ❌ | ❌ | ✅ | ✅ |
| Web search | ❌ | ❌ | ✅ | ✅ |

---

## Migration Path

### Phase 1: Claude Backend (Now)
- Add Claude Haiku as text alternative to Grok
- Implement prompt caching for soul context
- ~200 lines, half day

### Phase 2: Gemini Backend (Optional)
- Add Gemini Flash for cost optimization
- Good for high-volume, simple queries
- ~150 lines, few hours

### Phase 3: Auto-Routing (Optional)
- Implement smart model selection
- Route based on query complexity
- ~100 lines, few hours

### Phase 4: OpenAI Backend (Optional)
- Add GPT-4o for completeness
- Some users prefer OpenAI
- ~150 lines, few hours

---

## Files to Create

```
FAF-Voice/
├── lib/
│   ├── providers/
│   │   ├── index.ts          # Router
│   │   ├── grok.ts           # xAI handler
│   │   ├── claude.ts         # Anthropic handler
│   │   ├── gemini.ts         # Google handler
│   │   └── openai.ts         # OpenAI handler (optional)
│   ├── auto-router.ts        # Smart model selection
│   └── types/
│       └── models.ts         # Model definitions
├── components/
│   ├── ModelSelector.tsx     # Model picker UI
│   └── ModelBadge.tsx        # Show model + usage
├── api/
│   └── chat.ts              # Unified endpoint
└── MULTI-MODEL-INTEGRATION.md  # This file
```

---

## Testing

```bash
# Test each provider
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "model": "claude-haiku",
    "soul": "faf"
  }'

# Test auto-select
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Write a React component"}],
    "autoSelect": true,
    "soul": "faf"
  }'
```

---

*Multi-Model Integration for FAF-Voice*
*LLM-agnostic, user-selectable, auto-routing ready*
*Same MCPaaS eternal memory across all models*
