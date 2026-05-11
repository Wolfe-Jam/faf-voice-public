"""
Token Server for FAF-Voice
Serves fresh LiveKit tokens on demand.
Run: python token_server.py
Endpoint: http://localhost:8080/token
"""

import os
import time
from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from livekit import api

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend to call

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "wss://faf-voice-hbdjdwmn.livekit.cloud")
PORT = int(os.getenv("PORT", 8080))

@app.route('/token', methods=['GET'])
def get_token():
    """Generate a fresh token with unique room name."""
    # Check env vars first
    if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
        return jsonify({
            "error": "Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET",
            "has_key": bool(LIVEKIT_API_KEY),
            "has_secret": bool(LIVEKIT_API_SECRET)
        }), 500

    try:
        room_name = f"faf-voice-{int(time.time())}"

        token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET) \
            .with_identity("faf-voice-user") \
            .with_name("FAF Voice User") \
            .with_ttl(timedelta(days=7)) \
            .with_grants(api.VideoGrants(
                room_join=True,
                room=room_name,
                can_publish=True,
                can_subscribe=True,
            )).to_jwt()

        return jsonify({
            "token": token,
            "room": room_name,
            "url": LIVEKIT_URL
        })
    except Exception as e:
        return jsonify({"error": str(e), "type": type(e).__name__}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "faf-voice-token-server"})

if __name__ == '__main__':
    print("FAF-Voice Token Server")
    print("======================")
    print(f"Endpoint: http://localhost:{PORT}/token")
    print(f"Health:   http://localhost:{PORT}/health")
    print()
    app.run(host='0.0.0.0', port=PORT, debug=os.getenv("DEBUG", "false").lower() == "true")
