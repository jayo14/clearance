#!/bin/bash

# Setup script for LASUSTECH Clearance System
# This script initializes both frontend and backend projects

set -e  # Exit on error

echo "========================================"
echo "LASUSTECH Clearance System - Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check for required tools
echo "${BLUE}Checking for required tools...${NC}"

if ! command -v node &> /dev/null; then
    echo "${RED}Error: Node.js is not installed. Please install Node.js >= 18.0.0${NC}"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "${RED}Error: Python is not installed. Please install Python >= 3.10${NC}"
    exit 1
fi

echo "${GREEN}✓ Node.js and Python are installed${NC}"
echo ""

# Setup Frontend
echo "${BLUE}Setting up Frontend (Next.js)...${NC}"
cd frontend

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "${GREEN}✓ Created .env.local${NC}"
    echo "⚠️  Please edit frontend/.env.local and add your API keys"
fi

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "${GREEN}✓ Frontend setup complete${NC}"
else
    echo "${RED}✗ Frontend setup failed${NC}"
    exit 1
fi

cd ..
echo ""

# Setup Backend
echo "${BLUE}Setting up Backend (Django)...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo "${GREEN}✓ Created virtual environment${NC}"
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements/development.txt

if [ $? -eq 0 ]; then
    echo "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo "${RED}✗ Backend setup failed${NC}"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "${GREEN}✓ Created .env${NC}"
    echo "⚠️  Please edit backend/.env and configure your settings"
fi

echo "Running database migrations..."
python manage.py migrate

if [ $? -eq 0 ]; then
    echo "${GREEN}✓ Database migrations complete${NC}"
else
    echo "${RED}✗ Database migrations failed${NC}"
    exit 1
fi

echo ""
echo "${BLUE}Would you like to create a superuser for Django admin? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
fi

deactivate
cd ..

echo ""
echo "========================================"
echo "${GREEN}Setup Complete!${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Edit frontend/.env.local with your configuration"
echo "2. Edit backend/.env with your configuration"
echo "3. Run 'npm run dev' to start both servers"
echo ""
echo "Or run them separately:"
echo "  - Frontend: npm run dev:frontend"
echo "  - Backend: npm run dev:backend"
echo ""
echo "Access the applications:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:8000"
echo "  - Django Admin: http://localhost:8000/admin"
echo "  - API Docs: http://localhost:8000/api/docs"
echo ""
