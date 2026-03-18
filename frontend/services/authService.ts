import { User, UserRole, OfficeType } from '../types';

const API_URL = 'http://localhost:8000/api/accounts';

export const authService = {
    async login(username: string, password: string): Promise<{ access: string; refresh: string; user: any }> {
        const response = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        return await response.json();
    },

    async getProfile(token: string): Promise<any> {
        const response = await fetch(`${API_URL}/profile/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        return await response.json();
    },

    async updateProfile(token: string, data: any): Promise<any> {
        const response = await fetch(`${API_URL}/profile/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update profile');
        }

        return await response.json();
    },

    transformUser(backendUser: any): User {
        const { role, student_profile, officer_profile, first_name, last_name, ...rest } = backendUser;
        const name = role === UserRole.STUDENT && student_profile?.full_name 
            ? student_profile.full_name 
            : `${first_name} ${last_name}`.trim() || backendUser.username;
        
        if (role === UserRole.STUDENT && student_profile) {
            return {
                ...rest,
                first_name,
                last_name,
                name,
                role: UserRole.STUDENT,
                full_name: student_profile.full_name,
                jamb_number: student_profile.jamb_number,
                institution_id: student_profile.institution_id,
                college_id: student_profile.college_id,
                department_id: student_profile.department_id,
                course: student_profile.course,
                admission_year: student_profile.admission_year,
                passport_photo_url: student_profile.passport_photo_url,
                clearance_record: { items: [] } as any
            };
        } else {
            return {
                ...rest,
                first_name,
                last_name,
                name,
                role: role as UserRole,
                office_type: (officer_profile?.office_type as OfficeType) || 'ADMISSIONS',
                is_active: officer_profile?.is_active ?? true,
                institution_id: officer_profile?.institution_id,
                college_id: officer_profile?.college_id,
                department_id: officer_profile?.department_id,
            };
        }
    }
};