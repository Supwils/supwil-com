'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/Auth/LoginForm';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

export default function EditBlogPage()
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

    if (!isAuthenticated)
    {
        return (
            <div className="min-h-screen bg-[var(--background)] py-20">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <LoginForm />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-6">
                    <h1 className="text-2xl font-semibold text-[var(--text-color)]">
                        Edit Blog
                    </h1>
                    <p className="mt-3 text-[var(--text-color)] opacity-80">
                        This page is not implemented yet.
                    </p>
                </div>
            </div>
        </div>
    );
}
