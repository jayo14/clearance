import { Institution, College, Department, Officer } from '../types';

const API_URL = '/api/institutions';

export const institutionService = {
    getToken() {
        return localStorage.getItem('auth_token');
    },

    async getInstitution(id: string): Promise<Institution> {
        const response = await fetch(`${API_URL}/institutions/${id}/`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch institution');
        return await response.json();
    },

    async updateInstitution(id: string, data: Partial<Institution>): Promise<Institution> {
        const response = await fetch(`${API_URL}/institutions/${id}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update institution');
        return await response.json();
    },

    async getColleges(institutionId: string): Promise<College[]> {
        const response = await fetch(`${API_URL}/colleges/?institution_id=${institutionId}`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch colleges');
        return await response.json();
    },

    async createCollege(data: Partial<College>): Promise<College> {
        const response = await fetch(`${API_URL}/colleges/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create college');
        return await response.json();
    },

    async getDepartments(collegeId: string): Promise<Department[]> {
        const response = await fetch(`${API_URL}/departments/?college_id=${collegeId}`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch departments');
        return await response.json();
    },

    async createDepartment(data: Partial<Department>): Promise<Department> {
        const response = await fetch(`${API_URL}/departments/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create department');
        return await response.json();
    },

    async getStaff(institutionId: string): Promise<Officer[]> {
        const response = await fetch(`/api/accounts/list-officers/?institution_id=${institutionId}`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch staff');
        return await response.json();
    }
};
