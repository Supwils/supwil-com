"use client";

import { useState, useEffect } from "react";
import BlogCard from "@/components/Blog/BlogCard";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

export default function BlogPage()
{
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>
    {
        fetchPosts();
    }, []);

    const fetchPosts = async () =>
    {
        try
        {
            setLoading(true);
            const response = await fetch('/api/blog/get-blogs');

            if (!response.ok)
            {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            setPosts(data);
        } catch (err)
        {
            setError(err.message);
            console.error('Error fetching posts:', err);
        } finally
        {
            setLoading(false);
        }
    };

    if (loading)
    {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error)
    {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--text-color)] mb-4">
                        Error Loading Posts
                    </h2>
                    <p className="text-[var(--text-color)] opacity-70 mb-6">{error}</p>
                    <button
                        onClick={fetchPosts}
                        className="px-6 py-3 bg-[var(--main-color)] text-white rounded-lg hover:opacity-90 transition-opacity duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-12">
            <div className="max-w-[70%] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-color)] mb-4">
                        Blog Posts
                    </h1>
                    <p className="text-lg text-[var(--text-color)] opacity-70 max-w-2xl mx-auto">
                        Explore my thoughts, experiences, and insights on technology, development, and life.
                    </p>
                </div>

                {/* Blog Posts Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-semibold text-[var(--text-color)] mb-4">
                            No Posts Yet
                        </h3>
                        <p className="text-[var(--text-color)] opacity-70">
                            Check back soon for new content!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        {posts.map((post) => (
                            <BlogCard key={post._id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 