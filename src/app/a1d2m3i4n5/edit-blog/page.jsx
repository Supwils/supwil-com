'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/Auth/LoginForm';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import BlogDeleteAlert from '@/components/Blog/BlogDeleteAlert';
import Link from 'next/link';

export default function EditBlogPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            if (!isAuthenticated) return;
            
            try {
                // Use all=true to get all posts including drafts for admin
                const response = await fetch('/api/blog/get-blogs?all=true&limit=100');
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                const data = await response.json();
                // Handle new paginated response format
                setBlogs(data.items || data);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading && isAuthenticated) {
            fetchBlogs();
        } else if (!authLoading && !isAuthenticated) {
            setIsLoading(false);
        }
    }, [isAuthenticated, authLoading]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
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

    const handleDeleteClick = (blog) => {
        setDeleteError(null);
        setBlogToDelete(blog);
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        if (isDeleting) return;
        setShowDeleteModal(false);
        setBlogToDelete(null);
        setDeleteError(null);
    };

    const handleConfirmDelete = async () => {
        if (!blogToDelete || isDeleting) return;

        try {
            setIsDeleting(true);
            setDeleteError(null);

            const response = await fetch(`/api/blog/delete-blog?id=${encodeURIComponent(blogToDelete._id)}`, {
                method: 'DELETE'
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.message || 'Failed to delete blog');
            }

            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogToDelete._id));
            setShowDeleteModal(false);
            setBlogToDelete(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete blog';
            setDeleteError(message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-[var(--text-color)]">
                            Edit Blog Posts
                        </h1>
                    </div>

                    <BlogDeleteAlert
                        open={showDeleteModal}
                        blogTitle={blogToDelete?.title}
                        isLoading={isDeleting}
                        error={deleteError}
                        onCancel={handleCancelDelete}
                        onConfirm={handleConfirmDelete}
                    />

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
                            {error}
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-12 bg-[var(--background)] border border-[var(--border-color)] rounded-xl">
                            <p className="text-[var(--text-color)] opacity-60 mb-4">No blog posts found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                                            {blogs.map((blog) => (
                                <div 
                                    key={blog._id} 
                                    className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[var(--main-color)] transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-xl font-semibold text-[var(--text-color)]">
                                                {blog.title}
                                            </h2>
                                            {/* Category badge */}
                                            {blog.category && (
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
                                                    blog.category === 'tech' 
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                    {blog.category}
                                                </span>
                                            )}
                                            {/* Status badge */}
                                            {blog.status === 'draft' && (
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-color)] opacity-60">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                                            </span>
                                            {/* Display badges (fallback to tags) */}
                                            {((blog.badges && blog.badges.length > 0) || (blog.tags && blog.tags.length > 0)) && (
                                                <div className="flex gap-2">
                                                    {(blog.badges || blog.tags).slice(0, 3).map((badge, idx) => (
                                                        <span key={idx} className="bg-[var(--main-color)] bg-opacity-10 px-2 py-0.5 rounded-full text-xs text-[var(--main-color)]">
                                                            {badge}
                                                        </span>
                                                    ))}
                                                    {(blog.badges || blog.tags).length > 3 && (
                                                        <span className="text-xs opacity-60">+{(blog.badges || blog.tags).length - 3}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Link 
                                            href={`/a1d2m3i4n5/edit-blog/${blog._id}`}
                                            className="px-6 py-2 bg-[var(--main-color)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition-opacity text-center whitespace-nowrap flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClick(blog)}
                                            className="px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-colors text-center whitespace-nowrap flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
