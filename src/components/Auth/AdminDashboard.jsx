'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const AdminDashboard = () =>
{
    const { user, logout } = useAuth();
    const router = useRouter();
    const handleCreateBlog = () =>
    {
        // TODO: Navigate to create blog page
        console.log('Navigate to create blog');
        // You can use Next.js router here
        // router.push('/admin/blog/create');
        router.push('/a1d2m3i4n5/create-blog');
    };

    const handleEditBlog = () =>
    {
        // TODO: Navigate to edit blog page
        console.log('Navigate to edit blog');
        // You can use Next.js router here
        router.push('/a1d2m3i4n5/edit-blog');
    };

    const handleUploadMedia = () =>
    {
        // Navigate to S3 upload page
        console.log('Navigate to S3 upload');
        router.push('/a1d2m3i4n5/upload-media');
    };

    const handleLogout = async () =>
    {
        await logout();
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-2xl p-8 shadow-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">⚡</div>
                    <h1 className="text-3xl font-bold text-[var(--text-color)] mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-[var(--text-color)] opacity-70">
                        Welcome back, <span className="text-[var(--main-color)]">{user?.username}</span>!
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-gradient-to-br from-[var(--main-color)]/10 to-transparent rounded-xl border border-[var(--border-color)]">
                        <div className="text-2xl mb-2">📝</div>
                        <h3 className="text-lg font-semibold text-[var(--text-color)] mb-1">Blog Posts</h3>
                        <p className="text-[var(--text-color)] opacity-70 text-sm">Manage your content</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[var(--main-color)]/10 to-transparent rounded-xl border border-[var(--border-color)]">
                        <div className="text-2xl mb-2">☁️</div>
                        <h3 className="text-lg font-semibold text-[var(--text-color)] mb-1">Media Storage</h3>
                        <p className="text-[var(--text-color)] opacity-70 text-sm">Upload to S3</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[var(--main-color)]/10 to-transparent rounded-xl border border-[var(--border-color)]">
                        <div className="text-2xl mb-2">🔐</div>
                        <h3 className="text-lg font-semibold text-[var(--text-color)] mb-1">Admin Access</h3>
                        <p className="text-[var(--text-color)] opacity-70 text-sm">Full control</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4">
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Create Blog Button */}
                        <button
                            onClick={handleCreateBlog}
                            className="
                                group p-6 
                                bg-[var(--background)] 
                                border border-[var(--border-color)] 
                                rounded-xl 
                                hover:border-[var(--main-color)]/30 
                                hover:shadow-lg hover:shadow-[var(--main-color)]/10
                                transition-all duration-300
                                text-left
                                transform hover:-translate-y-1
                            "
                        >
                            <div className="text-3xl mb-3">✍️</div>
                            <h3 className="text-lg font-semibold text-[var(--text-color)] group-hover:text-[var(--main-color)] transition-colors duration-200 mb-2">
                                Create Blog Post
                            </h3>
                            <p className="text-[var(--text-color)] opacity-70 text-sm">
                                Write and publish new blog content
                            </p>
                        </button>

                        {/* Edit Blog Button */}
                        <button
                            onClick={handleEditBlog}
                            className="
                                group p-6 
                                bg-[var(--background)] 
                                border border-[var(--border-color)] 
                                rounded-xl 
                                hover:border-[var(--main-color)]/30 
                                hover:shadow-lg hover:shadow-[var(--main-color)]/10
                                transition-all duration-300
                                text-left
                                transform hover:-translate-y-1
                            "
                        >
                            <div className="text-3xl mb-3">✏️</div>
                            <h3 className="text-lg font-semibold text-[var(--text-color)] group-hover:text-[var(--main-color)] transition-colors duration-200 mb-2">
                                Edit Blog Posts
                            </h3>
                            <p className="text-[var(--text-color)] opacity-70 text-sm">
                                Modify existing blog content
                            </p>
                        </button>

                        {/* Upload Media Button */}
                        <button
                            onClick={handleUploadMedia}
                            className="
                                group p-6 
                                bg-[var(--background)] 
                                border border-[var(--border-color)] 
                                rounded-xl 
                                hover:border-[var(--main-color)]/30 
                                hover:shadow-lg hover:shadow-[var(--main-color)]/10
                                transition-all duration-300
                                text-left
                                transform hover:-translate-y-1
                            "
                        >
                            <div className="text-3xl mb-3">📤</div>
                            <h3 className="text-lg font-semibold text-[var(--text-color)] group-hover:text-[var(--main-color)] transition-colors duration-200 mb-2">
                                Upload to S3
                            </h3>
                            <p className="text-[var(--text-color)] opacity-70 text-sm">
                                Upload media files to cloud storage
                            </p>
                        </button>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                    <button
                        onClick={handleLogout}
                        className="
                            w-full md:w-auto
                            px-6 py-3
                            bg-red-500/10
                            text-red-500
                            border border-red-500/20
                            rounded-xl
                            hover:bg-red-500/20
                            hover:border-red-500/30
                            transition-all duration-200
                            font-medium
                            flex items-center justify-center gap-2
                        "
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 