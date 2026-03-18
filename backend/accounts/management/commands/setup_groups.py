from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from accounts.models import User, StudentProfile, OfficerProfile
from institutions.models import Institution, College, Department

class Command(BaseCommand):
    help = 'Setup default user groups and permissions'

    def handle(self, *args, **options):
        self.stdout.write('Setting up groups and permissions...')

        # Define Groups
        groups = {
            'Institution Admin': [
                # Can view/change institution (own)
                # Can add/change/delete colleges (own)
                # Can add/change/delete departments (own)
                # Can add/change/delete officers (own)
                'view_institution',
                'change_institution',
                'add_college', 'change_college', 'delete_college', 'view_college',
                'add_department', 'change_department', 'delete_department', 'view_department',
                'add_officerprofile', 'change_officerprofile', 'delete_officerprofile', 'view_officerprofile',
            ],
            'Officer': [
                # Can view/change clearance records
                # Can view students
                'view_studentprofile',
                # Permissions for clearance records are usually custom logic, but basic model perms:
            ],
            'Student': [
                # Can view own profile
                # Can view own clearance
            ]
        }

        for group_name, perms in groups.items():
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                self.stdout.write(f'Created group: {group_name}')
            
            for codename in perms:
                try:
                    # We might need to find the content type. This is a simplification.
                    # In a real scenario, we'd map models to permissions more robustly.
                    permission = Permission.objects.filter(codename=codename).first()
                    if permission:
                        group.permissions.add(permission)
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Could not add permission {codename}: {e}'))

        self.stdout.write(self.style.SUCCESS('Groups and permissions setup complete.'))
