'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/Auth/LoginForm';
import AdminDashboard from '@/components/Auth/AdminDashboard';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

export default function AdminPage()
{
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading)
    {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-20">
            <div className="container mx-auto px-6">
                {!isAuthenticated ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <LoginForm />
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <AdminDashboard />
                    </div>
                )}
            </div>
        </div>
    );
}
