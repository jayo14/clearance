#!/bin/bash

# Deployment script for LASUSTECH Clearance System
# Prepares and deploys both frontend and backend

set -e

echo "========================================"
echo "Deployment Script"
echo "========================================"
echo ""

# Check environment
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh [staging|production]"
    exit 1
fi

ENVIRONMENT=$1

echo "Deploying to: $ENVIRONMENT"
echo ""

# Build both projects
echo "Building projects..."
./scripts/build.sh

echo ""
echo "Deployment prepared for $ENVIRONMENT"
echo ""
echo "Manual deployment steps:"
echo ""

if [ "$ENVIRONMENT" == "production" ]; then
    echo "Frontend (Vercel):"
    echo "  1. Commit and push to main branch"
    echo "  2. Vercel will auto-deploy from GitHub"
    echo "  3. Or run: cd frontend && vercel --prod"
    echo ""
    echo "Backend (Server/Docker):"
    echo "  1. SSH into production server"
    echo "  2. Pull latest code from main"
    echo "  3. Activate venv and run migrations"
    echo "  4. Collect static files"
    echo "  5. Restart gunicorn/uwsgi service"
    echo ""
    echo "Or use Docker:"
    echo "  docker-compose -f docker-compose.prod.yml up -d --build"
else
    echo "Frontend (Vercel Staging):"
    echo "  1. Commit and push to develop branch"
    echo "  2. Or run: cd frontend && vercel"
    echo ""
    echo "Backend (Staging Server):"
    echo "  1. Deploy to staging environment"
    echo "  2. Run migrations"
    echo "  3. Restart services"
fi

echo ""
echo "Post-deployment checklist:"
echo "  □ Verify frontend is accessible"
echo "  □ Verify API is responding"
echo "  □ Check database connectivity"
echo "  □ Test critical user flows"
echo "  □ Monitor error logs"
echo "  □ Update documentation if needed"
echo ""
