"use client";

import { useState, useEffect, useCallback } from "react";
import BlogCard from "@/components/Blog/BlogCard";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { getTechBadges, getLifeBadges, getBadgeDisplayName } from "@/data/badge-data";

interface BlogPost {
  _id: string;
  slug?: string;
  title: string;
  description: string;
  tags?: string[];
  badges?: string[];
  category?: string;
  publishedAt?: string;
  createdAt: string;
  readingTimeMinutes?: number;
}

interface PageInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface ApiResponse {
  items: BlogPost[];
  pageInfo: PageInfo;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
    
    // Filter states
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [activeBadge, setActiveBadge] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchPosts = useCallback(async (page: number = 1, append: boolean = false) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            // Build query params
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('limit', '12');
            
            if (activeCategory !== 'all') {
                params.set('category', activeCategory);
            }
            if (activeBadge) {
                params.set('badge', activeBadge);
            }
            if (debouncedSearch) {
                params.set('q', debouncedSearch);
            }

            const response = await fetch(`/api/blog/get-blogs?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data: ApiResponse = await response.json();
            
            if (append) {
                setPosts(prev => [...prev, ...data.items]);
            } else {
                setPosts(data.items);
            }
            setPageInfo(data.pageInfo);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeCategory, activeBadge, debouncedSearch]);

    // Initial fetch and refetch on filter changes
    useEffect(() => {
        fetchPosts(1, false);
    }, [fetchPosts]);

    const loadMore = () => {
        if (pageInfo && pageInfo.hasMore && !loadingMore) {
            fetchPosts(pageInfo.page + 1, true);
        }
    };

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setActiveBadge(''); // Reset badge when category changes
    };

    const handleBadgeClick = (badge: string) => {
        setActiveBadge(activeBadge === badge ? '' : badge);
    };

    // Get quick filter badges based on category
    const getQuickFilterBadges = () => {
        if (activeCategory === 'tech') {
            return getTechBadges().slice(0, 8);
        } else if (activeCategory === 'life') {
            return getLifeBadges().slice(0, 8);
        }
        // Mix of popular badges when showing all
        return [...getTechBadges().slice(0, 4), ...getLifeBadges().slice(0, 4)];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--text-color)] mb-4">
                        Error Loading Posts
                    </h2>
                    <p className="text-[var(--text-color)] opacity-70 mb-6">{error}</p>
                    <button
                        onClick={() => fetchPosts(1, false)}
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
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-color)] mb-4">
                        Blog Posts
                    </h1>
                    <p className="text-lg text-[var(--text-color)] opacity-70 max-w-2xl mx-auto">
                        Explore my thoughts, experiences, and insights on technology, development, and life.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="mb-8 space-y-4">
                    {/* Category Tabs & Search */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* Category Tabs */}
                        <div className="flex bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-1">
                            {['all', 'tech', 'life'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        activeCategory === cat
                                            ? 'bg-[var(--main-color)] text-white shadow-md'
                                            : 'text-[var(--text-color)] hover:bg-[var(--main-color)]/10'
                                    }`}
                                >
                                    {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Search Box */}
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] placeholder-[var(--text-color)]/50 focus:outline-none focus:border-[var(--main-color)] focus:ring-2 focus:ring-[var(--main-color)]/20 transition-all duration-200"
                            />
                            <svg 
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-color)] opacity-50" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Quick Badge Filters */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-[var(--text-color)] opacity-60 mr-2">Quick filters:</span>
                        {getQuickFilterBadges().map((badge) => (
                            <button
                                key={badge.key}
                                onClick={() => handleBadgeClick(badge.key)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                    activeBadge === badge.key
                                        ? 'bg-[var(--main-color)] text-white'
                                        : 'bg-[var(--main-color)]/10 text-[var(--main-color)] hover:bg-[var(--main-color)]/20'
                                }`}
                            >
                                {badge.displayName}
                            </button>
                        ))}
                        {activeBadge && (
                            <button
                                onClick={() => setActiveBadge('')}
                                className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all duration-200"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Info */}
                {pageInfo && (
                    <div className="mb-6 text-sm text-[var(--text-color)] opacity-60">
                        Showing {posts.length} of {pageInfo.total} posts
                        {activeCategory !== 'all' && ` in ${activeCategory}`}
                        {activeBadge && ` tagged with "${getBadgeDisplayName(activeBadge)}"`}
                        {debouncedSearch && ` matching "${debouncedSearch}"`}
                    </div>
                )}

                {/* Blog Posts Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-2xl font-semibold text-[var(--text-color)] mb-4">
                            No Posts Found
                        </h3>
                        <p className="text-[var(--text-color)] opacity-70 mb-6">
                            {debouncedSearch || activeBadge || activeCategory !== 'all'
                                ? 'Try adjusting your filters or search terms.'
                                : 'Check back soon for new content!'}
                        </p>
                        {(debouncedSearch || activeBadge || activeCategory !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveBadge('');
                                    setActiveCategory('all');
                                }}
                                className="px-6 py-3 bg-[var(--main-color)] text-white rounded-lg hover:opacity-90 transition-opacity duration-300"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                            {posts.map((post) => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {pageInfo && pageInfo.hasMore && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="px-8 py-3 bg-[var(--main-color)] text-white rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto gap-2"
                                >
                                    {loadingMore ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Loading...
                                        </>
                                    ) : (
                                        `Load More (${pageInfo.total - posts.length} remaining)`
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
