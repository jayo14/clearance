#!/bin/bash

# Build script for LASUSTECH Clearance System
# Builds both frontend and backend for production

set -e

echo "========================================"
echo "Building for Production"
echo "========================================"
echo ""

# Build Frontend
echo "Building Frontend (Next.js)..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✓ Frontend build complete"
else
    echo "✗ Frontend build failed"
    exit 1
fi

cd ..
echo ""

# Build Backend
echo "Building Backend (Django)..."
cd backend

# Activate virtual environment
source venv/bin/activate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

if [ $? -eq 0 ]; then
    echo "✓ Backend build complete"
else
    echo "✗ Backend build failed"
    exit 1
fi

deactivate
cd ..

echo ""
echo "========================================"
echo "Build Complete!"
echo "========================================"
echo ""
echo "Frontend build output: frontend/.next"
echo "Backend static files: backend/staticfiles"
echo ""
