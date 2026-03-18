
export type OfficeType = 'ADMISSIONS' | 'MEDICAL' | 'DEPARTMENT';

export const ClearanceStatus = {
  EMPTY: 'empty',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export type ClearanceStatus = typeof ClearanceStatus[keyof typeof ClearanceStatus];

export const OverallStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export type OverallStatus = typeof OverallStatus[keyof typeof OverallStatus];

export enum UserRole {
  STUDENT = 'STUDENT',
  OFFICER = 'OFFICER', // Previously ADMIN (Reviewer)
  INSTITUTION_ADMIN = 'INSTITUTION_ADMIN', // Manage specific school
  SUPER_ADMIN = 'SUPER_ADMIN' // Global
}

// --- Multi-Institution Hierarchy ---

export interface Institution {
  id: string;
  name: string;
  short_name: string;
  type: 'UNIVERSITY' | 'POLYTECHNIC' | 'COLLEGE_OF_ED';
  location: string;
  logo_url?: string;
  primary_color?: string; // For white labeling
  created_at: string;
}

export interface College {
  id: string;
  institution_id: string;
  name: string;
  dean_name?: string;
}

export interface Department {
  id: string;
  college_id: string;
  name: string;
  hod_name?: string;
}

// --- Users ---

export interface Student {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole.STUDENT;
  jamb_number: string;
  email: string;
  phone: string;
  institution_id: string;
  college_id: string;
  department_id: string;
  course: string;
  admission_year: string;
  passport_photo_url: string;
  clearance_record: ClearanceRecord;
}

export interface Officer {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  role: UserRole.OFFICER | UserRole.INSTITUTION_ADMIN | UserRole.SUPER_ADMIN;
  email: string;
  institution_id?: string; 
  college_id?: string;
  department_id?: string;
  office_type: OfficeType;
  is_active: boolean;
  last_login: string;
}

export type User = Student | Officer;

// Backward compatibility aliases
export type AdminUser = Officer;

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  category: 'submission' | 'approval' | 'rejection' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  actionLabel?: string;
}

export interface ClearanceItem {
  id: string;
  clearance_record_id: string;
  office_type: OfficeType;
  status: ClearanceStatus;
  assigned_officer?: string;
  reviewed_at?: string;
  officer_comments?: string;
  created_at: string;
  updated_at?: string;
  documents: Document[];
}

export interface ClearanceRecord {
  id: string;
  jamb_number: string;
  college_id: string;
  department_id: string;
  overall_status: OverallStatus;
  created_at: string;
  updated_at: string;
  items: ClearanceItem[];
}

export interface Document {
  id: string;
  clearance_item_id: string;
  document_type: string;
  file_url: string;
  file_name: string;
  file_size: number;
  upload_date: string;
  is_verified: boolean;
}

export interface DocumentRequirement {
  id: string;
  office_type: OfficeType;
  document_type: string;
  label: string;
  is_required: boolean;
  description: string;
  accepted_formats: string[];
  max_file_size: number;
}
