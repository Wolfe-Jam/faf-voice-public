import os
import time
from datetime import timedelta
from dotenv import load_dotenv
from livekit import api

load_dotenv()

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

# Use unique room name to ensure fresh room creation triggers auto-dispatch
room_name = f"faf-voice-{int(time.time())}"

# Token with 7-day expiry for demo/dev use
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

print("Token generated!")
print(f"\nROOM={room_name}")
print(f"LIVEKIT_URL=wss://faf-voice-hbdjdwmn.livekit.cloud")
print(f"TOKEN={token}")
