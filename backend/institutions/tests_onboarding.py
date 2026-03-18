from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from accounts.models import User, OfficerProfile
from institutions.models import Institution, College, Department

class InstitutionOnboardingTests(APITestCase):
    def test_institution_registration_and_setup(self):
        # 1. Register Institution
        url = '/api/institutions/institutions/'
        data = {
            'name': 'Test University',
            'short_name': 'TU',
            'type': 'UNIVERSITY',
            'location': 'Test City',
            'admin_email': 'admin@test.edu',
            'admin_username': 'tu_admin',
            'admin_password': 'securepassword123',
            'admin_first_name': 'Admin',
            'admin_last_name': 'User'
        }
        response = self.client.post(url, data, format='json')
        if response.status_code != 201:
            import sys
            sys.stderr.write(f"Response Content: {response.content}\n")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Institution.objects.count(), 1)
        self.assertEqual(User.objects.count(), 1)
        
        institution = Institution.objects.get()
        user = User.objects.get(username='tu_admin')
        self.assertEqual(user.role, 'INSTITUTION_ADMIN')
        self.assertEqual(user.officer_profile.institution, institution)
        
        # 2. Login
        self.client.force_authenticate(user=user)
        
        # 3. Create College
        url = '/api/institutions/colleges/'
        college_data = {
            'name': 'College of Science',
            'dean_name': 'Dr. Dean'
        }
        response = self.client.post(url, college_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(College.objects.count(), 1)
        college = College.objects.get()
        self.assertEqual(college.institution, institution)
        
        # 4. Create Department
        url = '/api/institutions/departments/'
        dept_data = {
            'college': college.id,
            'name': 'Computer Science',
            'hod_name': 'Dr. HOD'
        }
        response = self.client.post(url, dept_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Department.objects.count(), 1)
        dept = Department.objects.get()
        self.assertEqual(dept.college, college)

    def test_permissions(self):
        # Create user without institution admin role
        user = User.objects.create_user(username='student', password='password', role='STUDENT')
        self.client.force_authenticate(user=user)
        
        url = '/api/institutions/institutions/'
        data = {
            'name': 'Hacker U',
            # ... incomplete data but permission check happens first
        }
        # Actually creation is public
        
        # Try to create college
        url = '/api/institutions/colleges/'
        response = self.client.post(url, {'name': 'Hacked College'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
