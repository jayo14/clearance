import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const initializeAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const userData = await authService.getProfile(token);
                setCurrentUser(authService.transformUser(userData));
            } catch (err) {
                localStorage.removeItem('auth_token');
                setCurrentUser(null);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setError(null);
        try {
            const data = await authService.login(username, password);
            localStorage.setItem('auth_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            setCurrentUser(authService.transformUser(data.user));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        setCurrentUser(null);
    };

    const updateProfile = async (data: any) => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        try {
            const updatedData = await authService.updateProfile(token, data);
            setCurrentUser(authService.transformUser(updatedData));
        } catch (err: any) {
            console.error('Failed to update profile:', err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoading, error, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};