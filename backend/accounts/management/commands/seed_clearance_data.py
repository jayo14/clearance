from django.core.management.base import BaseCommand
from institutions.models import Institution, College, Department
from accounts.models import User, StudentProfile, OfficerProfile
from records.models import DocumentRequirement, OfficeType

class Command(BaseCommand):
    help = 'Seed the database with initial system data'

    def handle(self, *args, **options):
        # 1. Create Institution
        inst, _ = Institution.objects.get_or_create(
            short_name='LASUSTECH',
            defaults={
                'name': 'Lagos State University of Science and Technology',
                'type': 'UNIVERSITY',
                'location': 'Ikorodu, Lagos',
                'primary_color': '#C1B66D'
            }
        )
        self.stdout.write(f"Institution: {inst}")

        # 2. Create Colleges
        cps, _ = College.objects.get_or_create(institution=inst, name='College of Physical Sciences', defaults={'dean_name': 'Prof. A. Bakare'})
        coe, _ = College.objects.get_or_create(institution=inst, name='College of Engineering', defaults={'dean_name': 'Dr. O. Williams'})
        self.stdout.write("Created Colleges")

        # 3. Create Departments
        cs, _ = Department.objects.get_or_create(college=cps, name='Computer Science', defaults={'hod_name': 'Dr. S. Okoro'})
        math, _ = Department.objects.get_or_create(college=cps, name='Mathematics', defaults={'hod_name': 'Dr. M. Levi'})
        mech, _ = Department.objects.get_or_create(college=coe, name='Mechanical Engineering', defaults={'hod_name': 'Engr. T. Balogun'})
        self.stdout.write("Created Departments")

        # 4. Create Requirements
        # Based on the manual clearance process:
        # Forms 001-006: Student Data, Registration Clearance, Matriculation Oath, 
        # Undertaking, e-Certificate Processing, Student ID Card
        requirements_data = [
            # ADMISSIONS Office - All forms except 002
            (OfficeType.ADMISSIONS, 'JAMB_ADM_LETTER', 'JAMB Admission Letter', 'Official JAMB Admission Letter (digital copy).'),
            (OfficeType.ADMISSIONS, 'ACCEPTANCE_FEE', 'Acceptance Fee Receipt', 'Proof of payment for acceptance fee.'),
            (OfficeType.ADMISSIONS, 'FORM_001', 'Student Data Form (Form 001)', 'Complete student information and bio-data (digital submission).'),
            (OfficeType.ADMISSIONS, 'JAMB_RESULT', 'JAMB Result Slip', 'Original JAMB Result Slip (digital copy).'),
            (OfficeType.ADMISSIONS, 'FORM_003', 'Matriculation Oath/Parent\'s Indemnity (Form 003)', 'Matriculation oath and parent\'s indemnity form (digital submission).'),
            (OfficeType.ADMISSIONS, 'FORM_004', 'Undertaking Form (Form 004)', 'Student undertaking form (digital submission).'),
            (OfficeType.ADMISSIONS, 'FORM_005', 'e-Certificate Processing Form (Form 005)', 'Certificate processing form (digital submission).'),
            (OfficeType.ADMISSIONS, 'FORM_006', 'Student Identity Card Form (Form 006)', 'Student ID card application form (digital submission).'),
            (OfficeType.ADMISSIONS, 'OLEVEL_VERIFICATION', 'O-Level Verification Form', 'Verified O-Level results (WAEC/NECO/NABTEB).'),
            (OfficeType.ADMISSIONS, 'SOVE_FORM', 'State of Origin Verification (SOVE) Form', 'Required for Lagos State indigenes only - Local Government verification.'),
            
            # MEDICAL Office
            (OfficeType.MEDICAL, 'HEALTH_CERT', 'Health Certificate', 'Certificate of fitness from a recognized government hospital.'),
            
            # DEPARTMENT Office - Only Form 002 and Academic Advisor Clearance
            (OfficeType.DEPARTMENT, 'FORM_002', 'Registration Clearance Certificate (Form 002)', 'Registration clearance certificate (digital submission).'),
            (OfficeType.DEPARTMENT, 'ACADEMIC_ADVISOR_CLEARANCE', 'Academic Advisor Clearance', 'Confirmation of clearance with academic advisor.'),
        ]

        for office, doc_type, label, desc in requirements_data:
            DocumentRequirement.objects.get_or_create(
                office_type=office,
                document_type=doc_type,
                defaults={
                    'label': label,
                    'description': desc,
                    'is_required': True
                }
            )
        self.stdout.write("Created Document Requirements")

        # 5. Create Users
        if not User.objects.filter(username='superadmin').exists():
            User.objects.create_superuser(username='superadmin', email='super@clearance.gov', password='password123', role=User.Role.SUPER_ADMIN)
            self.stdout.write("Created Super Admin")

        if not User.objects.filter(username='std_001').exists():
            student_user = User.objects.create_user(username='std_001', email='emmanuel.a@gmail.com', password='password123', role=User.Role.STUDENT)
            StudentProfile.objects.create(
                user=student_user,
                full_name='Emmanuel Adebayo',
                jamb_number='2024987654AB',
                institution=inst,
                college_entity=cps,
                department_entity=cs,
                admission_year='2024'
            )
            self.stdout.write("Created Student")

        if not User.objects.filter(username='officer_sarah').exists():
            officer = User.objects.create_user(username='officer_sarah', email='sarah.j@lasustech.edu.ng', password='password123', role=User.Role.OFFICER)
            OfficerProfile.objects.create(
                user=officer,
                office_type='ADMISSIONS',
                institution=inst,
                college=cps
            )
            self.stdout.write("Created Officer")