#!/bin/bash

# Development script for LASUSTECH Clearance System
# Starts both frontend and backend development servers concurrently

set -e

echo "========================================"
echo "Starting Development Servers"
echo "========================================"
echo ""

# Check if concurrently is installed
if ! command -v npx &> /dev/null; then
    echo "Error: npx not found. Please install Node.js"
    exit 1
fi

# Check if frontend node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "Frontend dependencies not installed. Running npm install..."
    cd frontend && npm install && cd ..
fi

# Check if backend venv exists
if [ ! -d "backend/venv" ]; then
    echo "Backend virtual environment not found. Please run ./scripts/setup.sh first"
    exit 1
fi

echo "Starting frontend (Next.js) on http://localhost:3000"
echo "Starting backend (Django) on http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Use npx to run concurrently
npx concurrently \
  --names "frontend,backend" \
  --prefix-colors "blue,green" \
  "cd frontend && npm run dev" \
  "cd backend && source venv/bin/activate && python manage.py runserver"
