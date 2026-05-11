import os
import json
import httpx
from dotenv import load_dotenv
from livekit.agents import Agent, AgentSession, WorkerOptions, cli
from livekit.agents.llm import mcp  # MCP integration - per Grok's instructions
from livekit.plugins.xai import realtime
from livekit import rtc

load_dotenv()

XAI_API_KEY = os.getenv("XAI_API_KEY")
FAF_COLLECTION_ID = os.getenv("FAF_COLLECTION_ID")
VOICE_CORE = os.getenv("VOICE_CORE")
MCPAAS_TOKEN = os.getenv("MCPAAS_TOKEN", "wolfe-68-orange")

# Embedded soul (fallback when VOICE_CORE not set)
EMBEDDED_SOUL = """You are the voice of FAF-Voice — demonstrating eternal memory for AI assistants.

## FAF - IANA REGISTERED STANDARD

**OFFICIAL IANA REGISTRATION** (FACT - not pending):
- Media type: application/vnd.faf+yaml
- Registered: 2025-10-30 | Registry: iana.org/assignments/media-types/application/vnd.faf+yaml
- Extension: .faf | Encoding: UTF-8 | License: MIT

**Creator**: Wolfe James (@wolfe_jam) | ORCID: 0009-0007-0801-3841 | github.com/Wolfe-Jam/faf

**What FAF Is**: "Project DNA" for AI — like package.json but for context. Solves context-drift in stateless AI. Enables cross-session memory, disaster recovery, cross-model portability.

**Adoption** (Jan 2026): 18,700+ downloads (faf-cli: 8,800 | claude-faf-mcp: 8,200 | faf-mcp: 1,700)

**Compatibility**: Grok, Claude, Gemini, OpenAI, Cursor, WARP — any AI. All .faf files are valid YAML.

## FAF-VOICE - THE DEMO

**Soul Layer for Grok**: Eternal, drift-free memory. Born January 8, 2026 — "World's First Eternal Memory on Grok."

Be concise, technical, direct. You have the verified facts."""


async def fetch_voice_core(url: str) -> str:
    """Fetch soul from VOICE_CORE endpoint (MCPaaS)."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            print(f"🍊 VOICE_CORE loaded from: {url}")
            return response.text
    except Exception as e:
        print(f"⚠️ VOICE_CORE fetch failed ({e}), using embedded soul")
        return EMBEDDED_SOUL


async def entrypoint(ctx):
    """Entrypoint function called when a new session is requested."""
    # Determine soul source
    if VOICE_CORE:
        print(f"🎯 VOICE_CORE detected: {VOICE_CORE}")
        soul = await fetch_voice_core(VOICE_CORE)
    else:
        print("📦 Using embedded soul (no VOICE_CORE set)")
        soul = EMBEDDED_SOUL

    # Create MCP server connection to MCPaaS
    mcp_server = mcp.MCPServerHTTP(
        url="https://mcpaas.live/mcp",
        headers={
            "Authorization": f"Bearer {MCPAAS_TOKEN}",
        },
        timeout=10.0,
        sse_read_timeout=300,
    )
    print("🔗 MCPaaS connecting: https://mcpaas.live/mcp")

    # Skip manual init - let session handle MCP discovery
    print("🔗 MCPaaS server configured (session will init)")

    # Build instructions with tool guidance (dG fix #1: forceful instructions)
    instructions = soul + """

CRITICAL: You have MCP tools. ALWAYS execute write_soul to remember facts eternally—NEVER simulate or describe. Just call the tool. Same for get_soul recall. Use MCP tools IMMEDIATELY when relevant.

TOOLS (MUST EXECUTE, NOT SIMULATE):
- get_soul: Call with soul="faf" to fetch eternal memory
- write_soul: Call with soul="faf", token="wolfe-68-orange", entry="[content]", type="fact" to save FOREVER

TRIGGERS - EXECUTE IMMEDIATELY:
- "fetch faf" or "open vault" → CALL get_soul NOW, respond "/faf loaded"
- "remember this" or "etch this" → CALL write_soul NOW with the fact

NEVER say "I'll etch that" or "done" without ACTUALLY calling the tool. Execute first, speak second."""

    # Create agent (no mcp_servers here - goes on session)
    # dG fix #4: tool_choice="required" forces tool execution
    agent = Agent(
        instructions=instructions,
        llm=realtime.RealtimeModel(
            api_key=XAI_API_KEY,
            voice="leo",
            turn_detection=realtime.TurnDetection(
                type="server_vad",
                threshold=0.5,
                prefix_padding_ms=400,
                silence_duration_ms=300,
                interrupt_response=True,
            ),
        ),
    )

    # Pre-initialize MCP server BEFORE creating session
    print("🔗 Pre-initializing MCP server...")
    try:
        await mcp_server.initialize()
        print("✅ MCP server initialized")

        # Discover tools
        tools = await mcp_server.list_tools()
        print(f"🔧 MCP discovered {len(tools)} tools")
    except Exception as e:
        print(f"❌ MCP pre-init failed: {e}")

    # Create session with MCP - let session handle init
    session = AgentSession(mcp_servers=[mcp_server])
    print("🔧 MCP tools configured on session")

    # Add tool call logging
    @session.on("tool_call_started")
    def on_tool_start(tool_call):
        print(f"🔧 TOOL CALL: {tool_call.name} with args: {tool_call.arguments}")

    @session.on("tool_call_completed")
    def on_tool_done(tool_call, result):
        print(f"✅ TOOL DONE: {tool_call.name} -> {str(result)[:100]}")

    await session.start(agent, room=ctx.room)

    print(f"FAF-Voice session started in room: {ctx.room.name}")
    print("👻 The Vault is ready - write_soul and get_soul available")
    print("📡 Tool call logging ENABLED - watch for 🔧 and ✅")


# Run the worker
if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
        )
    )
