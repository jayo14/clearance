import { ClearanceRecord, OfficeType, DocumentRequirement, ClearanceItem } from '../types';

const API_URL = '/api/records';

export const recordService = {
    getToken() {
        return localStorage.getItem('auth_token');
    },

    async getRequirements(): Promise<DocumentRequirement[]> {
        const response = await fetch(`${API_URL}/requirements/`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch requirements');
        }

        return await response.json();
    },

    async getMyRecord(): Promise<ClearanceRecord> {
        const response = await fetch(`${API_URL}/my-record/`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch clearance record');
        }

        return await response.json();
    },

    async uploadDocument(officeType: OfficeType, documentType: string, file: File): Promise<any> {
        const formData = new FormData();
        formData.append('office_type', officeType);
        formData.append('document_type', documentType);
        formData.append('file', file);

        const response = await fetch(`${API_URL}/upload-document/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        return await response.json();
    },

    async submitClearance(officeType: OfficeType): Promise<any> {
        const response = await fetch(`${API_URL}/submit-clearance/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ office_type: officeType }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Submission failed');
        }

        return await response.json();
    },

    // Officer methods
    async getOfficerClearanceList(status?: string): Promise<ClearanceItem[]> {
        let url = `${API_URL}/officer/list/`;
        if (status) {
            url += `?status=${status}`;
        }
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch clearance list');
        return await response.json();
    },

    async getOfficerClearanceDetail(pk: number | string): Promise<ClearanceItem> {
        const response = await fetch(`${API_URL}/officer/detail/${pk}/`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch clearance detail');
        return await response.json();
    },

    async updateClearanceStatus(pk: number | string, data: { status: string, officer_comments?: string }): Promise<ClearanceItem> {
        const response = await fetch(`${API_URL}/officer/detail/${pk}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update clearance status');
        return await response.json();
    }
};
