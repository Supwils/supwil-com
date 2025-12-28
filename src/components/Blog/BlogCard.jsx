"use client";

import { useRouter } from "next/navigation";

const BlogCard = ({ post }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/blog/${post.slug || post._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[var(--background)] rounded-2xl shadow-lg border border-[var(--border-color)] overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group h-full flex flex-col"
    >
      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-color)] mb-3 group-hover:text-[var(--main-color)] transition-colors duration-300 leading-tight">
          {post.title}
        </h2>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[var(--main-color)] bg-opacity-20 text-[var(--background)] rounded-full text-lg font-bold"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-[var(--text-color)] rounded-full text-xs font-medium">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-[var(--text-color)] text-xl opacity-70 mb-4 leading-relaxed font-medium">
          {truncateText(post.description)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] mt-auto">
          {/* Date */}
          <div className="flex items-center text-[var(--text-color)] opacity-60 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.createdAt)}
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