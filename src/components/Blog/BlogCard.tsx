"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { getBadgeDisplayName, getCategoryDisplayName } from "@/data/badge-data";

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
  status?: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/blog/${post.slug || post._id}`);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Get display badges (prefer badges, fallback to tags for legacy)
  const displayBadges = post.badges && post.badges.length > 0 
    ? post.badges 
    : post.tags || [];

  // Get display date (prefer publishedAt, fallback to createdAt)
  const displayDate = post.publishedAt || post.createdAt;

  return (
    <div
      onClick={handleCardClick}
      className="bg-[var(--background)] rounded-2xl shadow-lg border border-[var(--border-color)] overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group h-full flex flex-col"
    >
      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category & Reading Time */}
        <div className="flex items-center justify-between mb-3">
          {post.category && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              post.category === 'tech' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {getCategoryDisplayName(post.category)}
            </span>
          )}
          {post.readingTimeMinutes && (
            <span className="text-xs text-[var(--text-color)] opacity-50 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readingTimeMinutes} min read
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-color)] mb-3 group-hover:text-[var(--main-color)] transition-colors duration-300 leading-tight">
          {post.title}
        </h2>

        {/* Badges */}
        {displayBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {displayBadges.slice(0, 4).map((badge, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[var(--main-color)]/15 text-[var(--main-color)] rounded-full text-sm font-medium"
              >
                {getBadgeDisplayName(badge)}
              </span>
            ))}
            {displayBadges.length > 4 && (
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-[var(--text-color)] rounded-full text-xs font-medium">
                +{displayBadges.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-[var(--text-color)] text-lg opacity-70 mb-4 leading-relaxed flex-grow">
          {truncateText(post.description)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] mt-auto">
          {/* Date */}
          <div className="flex items-center text-[var(--text-color)] opacity-60 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(displayDate)}
          </div>

          {/* Read More Arrow */}
          <div className="flex items-center text-[var(--main-color)] group-hover:translate-x-1 transition-transform duration-300">
            <span className="text-sm font-medium mr-1">Read More</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
