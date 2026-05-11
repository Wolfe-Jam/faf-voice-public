#!/usr/bin/env python3
"""dG fix #6: Test MCP tools in text mode (isolate from voice)"""
import asyncio
import os
from dotenv import load_dotenv
from livekit.agents.llm import mcp

load_dotenv()

MCPAAS_TOKEN = os.getenv("MCPAAS_TOKEN", "wolfe-68-orange")

async def test_mcp_tools():
    print("🧪 dG Step #6: Text mode MCP test")
    print("=" * 50)

    # Create MCP server connection
    mcp_server = mcp.MCPServerHTTP(
        url="https://mcpaas.live/mcp",
        headers={
            "Authorization": f"Bearer {MCPAAS_TOKEN}",
        },
        timeout=10.0,
    )
    print("🔗 Connecting to MCPaaS...")

    # Initialize
    try:
        init_response = await mcp_server.initialize()
        print(f"✅ MCP Init successful")
    except Exception as e:
        print(f"❌ MCP Init failed: {e}")
        return

    # List tools
    try:
        tools = await mcp_server.list_tools()
        print(f"✅ Discovered {len(tools)} tools:")
        for t in tools:
            # Handle both object and dict forms
            name = t.name if hasattr(t, 'name') else t.get('name', str(t))
            print(f"   - {name}")
    except Exception as e:
        print(f"❌ list_tools failed: {e}")

    # Test get_soul
    print("\n📖 Testing get_soul...")
    try:
        result = await mcp_server.call_tool("get_soul", {"soul": "faf"})
        print(f"✅ get_soul result: {str(result)[:200]}...")
    except Exception as e:
        print(f"❌ get_soul failed: {e}")

    # Test write_soul
    print("\n✍️ Testing write_soul...")
    try:
        result = await mcp_server.call_tool("write_soul", {
            "soul": "faf",
            "entry": "10:05pm EST - text mode test via dG step 6",
            "type": "fact",
            "token": MCPAAS_TOKEN
        })
        print(f"✅ write_soul result: {result}")
    except Exception as e:
        print(f"❌ write_soul failed: {e}")

    # Verify write
    print("\n🔍 Verifying write...")
    try:
        result = await mcp_server.call_tool("get_soul", {"soul": "faf"})
        if "text mode test" in str(result):
            print("✅ Write verified - fact persisted!")
        else:
            print("⚠️ Write may have failed - fact not found")
    except Exception as e:
        print(f"❌ Verify failed: {e}")

    print("\n" + "=" * 50)
    print("🏁 Test complete")

if __name__ == "__main__":
    asyncio.run(test_mcp_tools())
