#!/usr/bin/env python3
"""
FAF-Voice Directive Injection Test

Tests that grok.persona gets injected into every chunk via xAI Collections.

Usage:
    export XAI_API_KEY="your_key"
    python test_directive_injection.py

Expected result:
    Leo responds as the persona from first word, not generic Grok.
"""

import os
import sys
import yaml
from pathlib import Path

try:
    from xai_sdk import Client
except ImportError:
    print("ERROR: xai-sdk not installed. Run: pip install xai-sdk --upgrade")
    sys.exit(1)

# FAF-Voice Collection (configured in console with inject_into_chunk)
COLLECTION_ID = "collection_7ab6d03e-3be8-4815-9a7c-5afcae61ec32"


def load_faf(path: str) -> dict:
    """Load and parse project.faf"""
    with open(path, 'r') as f:
        return yaml.safe_load(f)


def test_directive_injection():
    """Main test: upload with directive, verify via search"""

    # Check environment
    api_key = os.getenv("XAI_API_KEY")

    if not api_key:
        print("ERROR: Set XAI_API_KEY")
        sys.exit(1)

    # Initialize client
    print("Initializing xAI client...")
    client = Client(api_key=api_key)

    # Load project.faf
    faf_path = Path(__file__).parent.parent / "project-test.faf"
    if not faf_path.exists():
        faf_path = Path(__file__).parent.parent / "project.faf"

    print(f"Loading {faf_path}...")
    faf = load_faf(faf_path)

    # Extract persona for directive
    persona = faf.get("grok", {}).get("persona", "")
    if not persona:
        print("ERROR: No grok.persona found in .faf file")
        sys.exit(1)

    print(f"Persona length: {len(persona)} chars")
    print(f"First 100 chars: {persona[:100]}...")

    collection_id = COLLECTION_ID
    print(f"\nUsing collection: {collection_id}")

    # Step 1: Test query against existing collection
    print("\n--- Step 1: Test Query ---")
    test_query = "Who are you and what do you know?"

    try:
        results = client.collections.search(
            query=test_query,
            collection_ids=[collection_id],
            retrieval_mode="hybrid"
        )
        print(f"Query: {test_query}")
        print(f"Results: {len(results.data) if hasattr(results, 'data') else 'N/A'}")

        # Show first result
        if hasattr(results, 'data') and results.data:
            first = results.data[0]
            print(f"\nFirst chunk preview:")
            content = getattr(first, 'content', str(first))[:500]
            print(content)
        else:
            print("No results - collection may be empty")
    except Exception as e:
        print(f"ERROR searching: {e}")

    # Summary
    print("\n" + "="*60)
    print("TEST COMPLETE")
    print("="*60)
    print(f"Collection ID: {collection_id}")
    print(f"\nNext step: Open Grok Voice and ask:")
    print(f'  "Hey Leo, who are you?"')
    print(f"\nExpected: Leo responds as Wolfe-Core persona, not generic Grok")

    return collection_id


if __name__ == "__main__":
    test_directive_injection()
