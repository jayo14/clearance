import os
import django
from rest_framework import status
from django.test import Client

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clearance.settings')
django.setup()

client = Client()
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
response = client.post(url, data, content_type='application/json')
print(f"Status: {response.status_code}")
print(f"Content: {response.content}")
