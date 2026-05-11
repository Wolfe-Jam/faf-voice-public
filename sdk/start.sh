#!/bin/bash
# FAF-Voice Startup Script
# Runs all three services: Token Server, Voice Agent, Frontend

echo "🍊 FAF-Voice Starting..."
echo "========================"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Cleanup function
cleanup() {
    echo ""
    echo "Shutting down FAF-Voice..."
    kill $TOKEN_PID $AGENT_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Token Server
echo -e "${CYAN}[1/3] Starting Token Server (port 8080)...${NC}"
cd "$BACKEND_DIR"
source venv/bin/activate
python token_server.py &
TOKEN_PID=$!
sleep 2

# Start Voice Agent
echo -e "${CYAN}[2/3] Starting Voice Agent...${NC}"
python main.py dev &
AGENT_PID=$!
sleep 3

# Start Frontend
echo -e "${CYAN}[3/3] Starting Frontend...${NC}"
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!
sleep 2

echo ""
echo -e "${GREEN}========================${NC}"
echo -e "${GREEN}FAF-Voice is running!${NC}"
echo -e "${GREEN}========================${NC}"
echo ""
echo "  Token Server: http://localhost:8080/token"
echo "  Frontend:     http://localhost:5173 (or 5174)"
echo "  Voice Agent:  Running in dev mode"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

# Wait for any process to exit
wait
