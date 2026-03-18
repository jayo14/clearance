#!/bin/bash

# Test script for LASUSTECH Clearance System
# Runs tests for both frontend and backend

set -e

echo "========================================"
echo "Running Tests"
echo "========================================"
echo ""

# Test Frontend
echo "Running Frontend Tests..."
cd frontend
npm test

if [ $? -eq 0 ]; then
    echo "✓ Frontend tests passed"
else
    echo "✗ Frontend tests failed"
    exit 1
fi

cd ..
echo ""

# Test Backend
echo "Running Backend Tests..."
cd backend

# Activate virtual environment
source venv/bin/activate

# Run pytest
pytest --cov=apps --cov-report=term-missing

if [ $? -eq 0 ]; then
    echo "✓ Backend tests passed"
else
    echo "✗ Backend tests failed"
    exit 1
fi

deactivate
cd ..

echo ""
echo "========================================"
echo "All Tests Passed!"
echo "========================================"
echo ""
