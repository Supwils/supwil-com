"use client";

import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import parse from 'html-react-parser';
import { useQuery } from '@tanstack/react-query';
import React from "react";
import { getBadgeDisplayName, getCategoryDisplayName } from "@/data/badge-data";

interface BlogPost {
  _id: string;
  slug?: string;
  title: string;
  description?: string;
  content: string;
  tags?: string[];
  badges?: string[];
  category?: string;
  publishedAt?: string;
  createdAt: string;
  readingTimeMinutes?: number;
  author?: string;
}

export default function BlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params as { id: string };

    const { data: post, isLoading, error } = useQuery<BlogPost>({
        queryKey: ['blog', id],
        queryFn: async () => {
            const response = await fetch(`/api/blog/get-blog/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch post');
            }
            return response.json();
        },
        enabled: !!id,
    });

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Navigate to blog list with badge filter
    const handleBadgeClick = (badge: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/blog?badge=${encodeURIComponent(badge)}`);
    };

    // Navigate to blog list with category filter
    const handleCategoryClick = (category: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/blog?category=${encodeURIComponent(category)}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--text-color)] mb-4">
                        Post Not Found
                    </h2>
                    <p className="text-[var(--text-color)] opacity-70 mb-6">
                        {error instanceof Error ? error.message : "The blog post you're looking for doesn't exist."}
                    </p>
                    <button
                        onClick={() => router.push('/blog')}
                        className="px-6 py-3 bg-[var(--main-color)] text-white rounded-lg hover:opacity-90 transition-opacity duration-300"
                    >
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }

    // Get display badges (prefer badges, fallback to tags for legacy)
    const displayBadges = post.badges && post.badges.length > 0 
        ? post.badges 
        : post.tags || [];

    // Get display date (prefer publishedAt, fallback to createdAt)
    const displayDate = post.publishedAt || post.createdAt;

    return (
        <div className="min-h-screen bg-[var(--background)] py-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/blog')}
                    className="flex items-center text-[var(--main-color)] hover:opacity-70 transition-opacity duration-300 mb-8"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Blog
                </button>

                {/* Article Header */}
                <article className="bg-[var(--background)] rounded-2xl shadow-lg border border-[var(--border-color)] overflow-hidden">
                    <div className="p-8 md:p-12">
                        {/* Category Badge */}
                        {post.category && (
                            <button
                                onClick={(e) => handleCategoryClick(post.category!, e)}
                                className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide mb-4 transition-opacity hover:opacity-80 ${
                                    post.category === 'tech' 
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}
                            >
                                {getCategoryDisplayName(post.category)}
                            </button>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-color)] mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Badges */}
                        {displayBadges.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {displayBadges.map((badge, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => handleBadgeClick(badge, e)}
                                        className="px-3 py-1 bg-[var(--main-color)]/15 text-[var(--main-color)] rounded-full text-sm font-medium hover:bg-[var(--main-color)]/25 transition-colors"
                                    >
                                        {getBadgeDisplayName(badge)}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-[var(--border-color)] text-sm text-[var(--text-color)] opacity-70">
                            {/* Date */}
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(displayDate)}
                            </div>

                            {/* Reading Time */}
                            {post.readingTimeMinutes && (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {post.readingTimeMinutes} min read
                                </div>
                            )}

                            {/* Author */}
                            {post.author && (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {post.author}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {post.description && (
                            <div className="mb-8 p-4 bg-[var(--main-color)]/5 rounded-lg border-l-4 border-[var(--main-color)]">
                                <p className="text-lg text-[var(--text-color)] opacity-80 leading-relaxed italic">
                                    {post.description}
                                </p>
                            </div>
                        )}

                        {/* Content with Tailwind Typography Styling */}
                        <div className="prose prose-lg max-w-none">
                            {parse(post.content)}
                        </div>
                    </div>
                </article>

                {/* Navigation */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => router.push('/blog')}
                        className="px-8 py-3 bg-[var(--main-color)] text-white rounded-lg hover:opacity-90 transition-opacity duration-300 font-medium"
                    >
                        View More Posts
                    </button>
                </div>
            </div>
        </div>
    );
}
