"use client";

import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import parse from 'html-react-parser';
import { useQuery } from '@tanstack/react-query';

export default function BlogPostPage()
{
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const { data: post, isLoading, error } = useQuery({
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

    const formatDate = (dateString) =>
    {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading)
    {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !post)
    {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--text-color)] mb-4">
                        Post Not Found
                    </h2>
                    <p className="text-[var(--text-color)] opacity-70 mb-6">
                        {error?.message || "The blog post you're looking for doesn't exist."}
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
    // console.log(post.content)
    return (
        <div className="min-h-screen bg-[var(--background)] py-12">
            <div className="max-w-[70%] mx-auto px-6">
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
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-color)] mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-[var(--border-color)]">
                            <div className="flex items-center text-[var(--text-color)] opacity-70">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                                </svg>
                                {formatDate(post.createdAt)}
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-[var(--main-color)] bg-opacity-20 text-[var(--main-color)] rounded-full text-sm font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {post.description && (
                            <div className="mb-8">
                                <p className="text-lg text-[var(--text-color)] opacity-80 leading-relaxed">
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
