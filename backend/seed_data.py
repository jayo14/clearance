import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clearance.settings')
django.setup()

from institutions.models import Institution, College, Department
from accounts.models import User, OfficerProfile, StudentProfile
from records.models import ClearanceRecord, ClearanceItem, OfficeType, ClearanceStatus

def seed():
    # 1. Create Institutions
    inst1 = Institution.objects.create(
        name='Lagos State University of Science and Technology',
        short_name='LASUSTECH',
        type='UNIVERSITY',
        location='Ikorodu, Lagos',
        primary_color='#2563eb'
    )

    inst2 = Institution.objects.create(
        name='University of Lagos',
        short_name='UNILAG',
        type='UNIVERSITY',
        location='Akoka, Lagos',
        primary_color='#7c3aed'
    )

    # 2. Create Colleges
    col1 = College.objects.create(institution=inst1, name='College of Physical Sciences', dean_name='Prof. A. Bakare')
    col2 = College.objects.create(institution=inst1, name='College of Engineering', dean_name='Dr. O. Williams')

    # 3. Create Departments
    dept1 = Department.objects.create(college=col1, name='Computer Science', hod_name='Dr. S. Okoro')

    # 4. Create Users
    # Admin for LASUSTECH
    admin1 = User.objects.create_user(
        username='admin@lasustech.edu.ng',
        email='admin@lasustech.edu.ng',
        password='password123',
        role='INSTITUTION_ADMIN',
        first_name='Olumide',
        last_name='K.'
    )
    OfficerProfile.objects.create(user=admin1, institution=inst1, office_type='REGISTRY', is_active=True)

    # Officer for LASUSTECH
    off1 = User.objects.create_user(
        username='sarah.j@lasustech.edu.ng',
        email='sarah.j@lasustech.edu.ng',
        password='password123',
        role='OFFICER',
        first_name='Sarah',
        last_name='Johnson'
    )
    OfficerProfile.objects.create(user=off1, institution=inst1, college=col1, office_type='ADMISSIONS', is_active=True)

    # Student
    std1 = User.objects.create_user(
        username='2024987654AB',
        email='emmanuel.a@gmail.com',
        password='password123',
        role='STUDENT',
        first_name='Emmanuel',
        last_name='Adebayo'
    )
    StudentProfile.objects.create(
        user=std1,
        full_name='Emmanuel Adebayo',
        jamb_number='2024987654AB',
        institution=inst1,
        college_entity=col1,
        department_entity=dept1,
        admission_year='2024'
    )

    # Clearance Record
    rec1 = ClearanceRecord.objects.create(student=std1)
    ClearanceItem.objects.create(record=rec1, office_type='ADMISSIONS', status='pending')

    print("Seed data created successfully")

if __name__ == "__main__":
    seed()
