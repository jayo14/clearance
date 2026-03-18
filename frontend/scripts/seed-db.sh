#!/bin/bash

# Database seeding script for LASUSTECH Clearance System
# Populates the database with sample data for development

set -e

echo "========================================"
echo "Seeding Database"
echo "========================================"
echo ""

cd backend

# Activate virtual environment
source venv/bin/activate

echo "Creating sample data..."

# Create seed data using Django management command
python manage.py shell << EOF
from django.contrib.auth.models import User
from apps.students.models import Student
from apps.officers.models import Officer
from apps.clearances.models import ClearanceRecord
import random

print("Creating sample students...")
for i in range(10):
    matric = f"20/{2020+i:04d}"
    jamb = f"{1234567890 + i}"
    
    user, created = User.objects.get_or_create(
        username=f"student{i+1}",
        defaults={
            'email': f"student{i+1}@lasustech.edu.ng",
            'first_name': f"Student{i+1}",
            'last_name': "Test"
        }
    )
    
    if created:
        user.set_password("password123")
        user.save()
        print(f"Created student: {user.username}")

print("Creating sample officers...")
offices = ['department', 'faculty', 'library', 'hostel', 'bursary']
for i, office in enumerate(offices):
    user, created = User.objects.get_or_create(
        username=f"officer_{office}",
        defaults={
            'email': f"officer_{office}@lasustech.edu.ng",
            'first_name': office.capitalize(),
            'last_name': "Officer"
        }
    )
    
    if created:
        user.set_password("password123")
        user.save()
        print(f"Created officer: {user.username}")

print("")
print("Database seeding complete!")
print("")
print("Sample credentials:")
print("  Students: student1-10 / password123")
print("  Officers: officer_department, officer_faculty, etc. / password123")
EOF

deactivate
cd ..

echo ""
echo "========================================"
echo "Seeding Complete!"
echo "========================================"
echo ""
