'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import BlogEditor from '@/components/Blog/BlogEditor';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import LoginForm from '@/components/Auth/LoginForm';

export default function EditBlogPost() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [editorMode, setEditorMode] = useState('rich');
    
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        content: '',
        tags: '',
        slug: ''
    });

    useEffect(() => {
        if (isAuthenticated && id) {
            fetchBlogData();
        }
    }, [isAuthenticated, id]);

    const fetchBlogData = async () => {
        try {
            setFetching(true);
            const response = await fetch(`/api/blog/get-blog/${id}`);
            if (!response.ok) throw new Error('Failed to fetch blog post');
            
            const data = await response.json();
            setBlogData({
                ...data,
                tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || ''
            });
        } catch (error) {
            console.error('Error fetching blog:', error);
            alert('Failed to load blog post');
            router.push('/a1d2m3i4n5/edit-blog');
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContentChange = (content) => {
        setBlogData(prev => ({
            ...prev,
            content: content
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!blogData.title || !blogData.content) {
            alert('Title and content are required');
            return;
        }

        try {
            setIsSubmitting(true);
            
            const response = await fetch('/api/blog/update-blog', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    ...blogData
                }),
            });

            if (!response.ok) throw new Error('Failed to update blog');

            alert('Blog updated successfully!');
            router.push('/a1d2m3i4n5/edit-blog');
        } catch (error) {
            console.error('Error updating blog:', error);
            alert('Failed to update blog: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || fetching) {
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

    return (
        <div className="min-h-screen bg-[var(--background)] py-20">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-[var(--main-color)] mb-2">
                            Edit Blog Post
                        </h1>
                        <p className="text-[var(--text-color)] opacity-70">
                            Update your blog content
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/a1d2m3i4n5/edit-blog')}
                        className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--border-color)]/10 text-[var(--text-color)] transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                {/* Editor Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-1 flex">
                        <button
                            onClick={() => setEditorMode('rich')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                editorMode === 'rich'
                                    ? 'bg-[var(--main-color)] text-white shadow-md'
                                    : 'text-[var(--text-color)] hover:bg-[var(--main-color)]/10'
                            }`}
                        >
                            Rich Text Editor
                        </button>
                        <button
                            onClick={() => setEditorMode('simple')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                editorMode === 'simple'
                                    ? 'bg-[var(--main-color)] text-white shadow-md'
                                    : 'text-[var(--text-color)] hover:bg-[var(--main-color)]/10'
                            }`}
                        >
                            Markdown / HTML
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--text-color)] mb-3">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={blogData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:border-[var(--main-color)] focus:ring-2 focus:ring-[var(--main-color)]/20 transition-all duration-200"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--text-color)] mb-3">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={blogData.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:border-[var(--main-color)] focus:ring-2 focus:ring-[var(--main-color)]/20 transition-all duration-200"
                        />
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--text-color)] mb-3">
                            Content
                        </label>
                        <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--background)] focus-within:ring-2 focus-within:ring-[var(--main-color)]/20 focus-within:border-[var(--main-color)] transition-all duration-200">
                            {editorMode === 'rich' ? (
                                <BlogEditor
                                    content={blogData.content}
                                    onChange={handleContentChange}
                                    placeholder="Write your blog post here..."
                                />
                            ) : (
                                <textarea
                                    name="content"
                                    value={blogData.content}
                                    onChange={handleInputChange}
                                    required
                                    rows={15}
                                    className="w-full px-4 py-3 bg-[var(--background)] text-[var(--text-color)] font-mono text-sm focus:outline-none"
                                />
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--text-color)] mb-3">
                            Tags <span className="text-sm font-normal opacity-70">(comma-separated)</span>
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={blogData.tags}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:border-[var(--main-color)] focus:ring-2 focus:ring-[var(--main-color)]/20 transition-all duration-200"
                            placeholder="tech, programming, web"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                                px-8 py-4 
                                bg-[var(--main-color)] 
                                text-white 
                                rounded-xl 
                                font-bold text-lg
                                shadow-lg shadow-[var(--main-color)]/30
                                hover:shadow-xl hover:shadow-[var(--main-color)]/40
                                transform hover:-translate-y-1
                                transition-all duration-300
                                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                                flex items-center
                            `}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    Update Blog Post
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
