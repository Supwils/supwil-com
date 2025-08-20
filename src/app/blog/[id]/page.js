"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import parse from 'html-react-parser';

export default function BlogPostPage()
{
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    useEffect(() =>
    {
        if (id)
        {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () =>
    {
        try
        {
            setLoading(true);
            const response = await fetch(`/api/blog/get-blog/${id}`);

            if (!response.ok)
            {
                throw new Error('Failed to fetch post');
            }

            const data = await response.json();
            setPost(data);
            // console.log(post.content)
        } catch (err)
        {
            setError(err.message);
            console.error('Error fetching post:', err);
        } finally
        {
            setLoading(false);
        }
    };

    const formatDate = (dateString) =>
    {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading)
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
                        {error || "The blog post you're looking for doesn't exist."}
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
    console.log(post.content)
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

                        {/* Content with TipTap Styling */}
                        <div className="tiptap-content  prose-lg max-w-none">
                            <div className="text-[var(--text-color)] leading-relaxed">
                                {parse(post.content)}
                            </div>
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

            {/* TipTap Content Styles */}
            <style jsx>{`
                .tiptap-content {
                    color: var(--text-color);
                }
                
                 .tiptap-content h1,
    .tiptap-content h2,
    .tiptap-content h3,
    .tiptap-content h4,
    .tiptap-content h5,
    .tiptap-content h6 {
        font-size: unset !important;
        font-weight: unset !important;
        color: var(--text-color) !important;
    }
    
    .tiptap-content h1 {
        font-size: 2.25rem !important;
        font-weight: 700 !important;
        margin: 1.5rem 0 1rem 0 !important;
        line-height: 1.2 !important;
        display: block !important;
    }
    
    .tiptap-content h2 {
        font-size: 1.875rem !important;
        font-weight: 600 !important;
        margin: 1.25rem 0 0.75rem 0 !important;
        line-height: 1.3 !important;
        display: block !important;
    }
    
    .tiptap-content h3 {
        font-size: 1.5rem !important;
        font-weight: 600 !important;
        margin: 1rem 0 0.5rem 0 !important;
        line-height: 1.4 !important;
        display: block !important;
    }
    
    .tiptap-content h4 {
        font-size: 1.25rem !important;
        font-weight: 600 !important;
        margin: 0.75rem 0 0.5rem 0 !important;
        line-height: 1.4 !important;
        display: block !important;
    }
    
    .tiptap-content h5 {
        font-size: 1.125rem !important;
        font-weight: 600 !important;
        margin: 0.75rem 0 0.5rem 0 !important;
        line-height: 1.4 !important;
        display: block !important;
    }
    
    .tiptap-content h6 {
        font-size: 1rem !important;
        font-weight: 600 !important;
        margin: 0.75rem 0 0.5rem 0 !important;
        line-height: 1.4 !important;
        display: block !important;
    }
    
    .tiptap-content p {
        font-size: 1rem !important;
        font-weight: 400 !important;
        margin: 1rem 0 !important;
        line-height: 1.7 !important;
        display: block !important;
    }
                
                .tiptap-content strong {
                    font-weight: 700;
                    color: var(--text-color);
                }
                
                .tiptap-content em {
                    font-style: italic;
                }
                
                .tiptap-content u {
                    text-decoration: underline;
                }
                
                .tiptap-content a {
                    color: var(--main-color);
                    text-decoration: underline;
                    transition: opacity 0.2s;
                }
                
                .tiptap-content a:hover {
                    opacity: 0.8;
                }
                
                .tiptap-content ul, .tiptap-content ol {
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                }
                
                .tiptap-content li {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                    color: var(--text-color);
                }
                
                .tiptap-content blockquote {
                    border-left: 4px solid var(--main-color);
                    padding-left: 1rem;
                    margin: 1.5rem 0;
                    font-style: italic;
                    color: var(--text-color);
                    opacity: 0.9;
                }
                
                .tiptap-content code {
                    background-color: var(--border-color);
                    padding: 0.2rem 0.4rem;
                    border-radius: 0.25rem;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9rem;
                    color: var(--text-color);
                }
                
                .tiptap-content pre {
                    background-color: var(--border-color);
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin: 1rem 0;
                }
                
                .tiptap-content pre code {
                    background: none;
                    padding: 0;
                    font-family: 'Courier New', monospace;
                    color: var(--text-color);
                }
                
                .tiptap-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                }
                
                .tiptap-content hr {
                    border: none;
                    border-top: 1px solid var(--border-color);
                    margin: 2rem 0;
                }
                
                .tiptap-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                }
                
                .tiptap-content th, .tiptap-content td {
                    border: 1px solid var(--border-color);
                    padding: 0.5rem;
                    text-align: left;
                    color: var(--text-color);
                }
                
                .tiptap-content th {
                    background-color: var(--border-color);
                    font-weight: 600;
                }
                
                /* Text alignment classes */
                .tiptap-content .has-text-align-left {
                    text-align: left;
                }
                
                .tiptap-content .has-text-align-center {
                    text-align: center;
                }
                
                .tiptap-content .has-text-align-right {
                    text-align: right;
                }
                
                .tiptap-content .has-text-align-justify {
                    text-align: justify;
                }
            `}</style>
        </div>
    );
}