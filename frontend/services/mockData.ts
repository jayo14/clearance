
import { Officer, Student, OfficeType, DocumentRequirement, UserRole, Institution, College, Department, AppNotification } from '../types';
import { BookOpen, Library, HeartPulse, GraduationCap, Wallet, Building } from 'lucide-react';

export const MOCK_INSTITUTIONS: Institution[] = [
  { id: 'inst_1', name: 'Lagos State University of Science and Technology', short_name: 'LASUSTECH', type: 'UNIVERSITY', location: 'Ikorodu, Lagos', created_at: new Date().toISOString(), primary_color: '#2563eb' },
  { id: 'inst_2', name: 'University of Lagos', short_name: 'UNILAG', type: 'UNIVERSITY', location: 'Akoka, Lagos', created_at: new Date().toISOString(), primary_color: '#7c3aed' }
];

export const MOCK_COLLEGES: College[] = [
  { id: 'col_1', institution_id: 'inst_1', name: 'College of Physical Sciences', dean_name: 'Prof. A. Bakare' },
  { id: 'col_2', institution_id: 'inst_1', name: 'College of Engineering', dean_name: 'Dr. O. Williams' },
  { id: 'col_3', institution_id: 'inst_2', name: 'Faculty of Science', dean_name: 'Prof. J. Doe' }
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept_1', college_id: 'col_1', name: 'Computer Science', hod_name: 'Dr. S. Okoro' },
  { id: 'dept_2', college_id: 'col_1', name: 'Mathematics', hod_name: 'Dr. M. Levi' },
  { id: 'dept_3', college_id: 'col_2', name: 'Mechanical Engineering', hod_name: 'Engr. T. Balogun' }
];

// Super Admin
export const MOCK_SUPER_ADMIN: Officer = {
  id: 'sup_1',
  name: 'Global Administrator',
  role: UserRole.SUPER_ADMIN,
  email: 'super@clearance.gov',
  office_type: 'ADMISSIONS',
  is_active: true,
  last_login: new Date().toISOString()
};

// Institution Admins
export const MOCK_INST_ADMIN_LASUSTECH: Officer = {
  id: 'ia_1',
  name: 'Prof. Olumide K.',
  role: UserRole.INSTITUTION_ADMIN,
  email: 'admin@lasustech.edu.ng',
  institution_id: 'inst_1',
  office_type: 'ADMISSIONS',
  is_active: true,
  last_login: new Date().toISOString()
};

// College Officers (Reviewers)
export const MOCK_OFFICERS: Officer[] = [
  { 
    id: 'off_1', 
    name: 'Dr. Sarah Johnson', 
    role: UserRole.OFFICER, 
    email: 'sarah.j@lasustech.edu.ng', 
    institution_id: 'inst_1', 
    college_id: 'col_1', 
    office_type: 'ADMISSIONS', 
    is_active: true, 
    last_login: new Date().toISOString() 
  },
  { 
    id: 'off_2', 
    name: 'Mr. Emmanuel Ade', 
    role: UserRole.OFFICER, 
    email: 'e.ade@lasustech.edu.ng', 
    institution_id: 'inst_1', 
    college_id: 'col_2', 
    office_type: 'DEPARTMENT', 
    is_active: true, 
    last_login: new Date().toISOString() 
  }
];

export const MOCK_ADMIN = MOCK_OFFICERS[0];

export const OFFICE_CONFIG = [
  { id: 'ADMISSIONS', label: 'Admissions Office', icon: BookOpen, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { id: 'MEDICAL', label: 'Medical Centre', icon: HeartPulse, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
  { id: 'DEPARTMENT', label: 'Department', icon: Library, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
] as const;

export const REQUIREMENTS: DocumentRequirement[] = [
  { id: 'req_1', office_type: 'ADMISSIONS', document_type: 'JAMB_ADM_LETTER', label: 'JAMB Admission Letter', is_required: true, description: 'Official JAMB Admission Letter.', accepted_formats: ['.pdf'], max_file_size: 5000000 },
  { id: 'req_2', office_type: 'ADMISSIONS', document_type: 'JAMB_RESULT', label: 'JAMB Result Slip', is_required: true, description: 'Original JAMB Result Slip.', accepted_formats: ['.pdf'], max_file_size: 5000000 },
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'std_001',
    name: 'Emmanuel Adebayo',
    role: UserRole.STUDENT,
    jamb_number: '2024987654AB',
    email: 'emmanuel.a@gmail.com',
    phone: '08012345678',
    institution_id: 'inst_1',
    college_id: 'col_1',
    department_id: 'dept_1',
    college: 'College of Physical Sciences',
    department: 'Computer Science',
    course: 'B.Sc. Computer Science',
    admission_year: '2024',
    passport_photo_url: 'https://i.pravatar.cc/150?img=11',
    clearance_record: {
      id: 'cr_001',
      jamb_number: '2024987654AB',
      college_id: 'col_1',
      department_id: 'dept_1',
      overall_status: 'in_progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: []
    }
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'success',
    category: 'approval',
    title: 'Admission Letter Verified',
    message: 'Your JAMB Admission Letter has been successfully verified by the Admissions Office.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    actionLabel: 'View Status'
  }
];
