import React from 'react';

const ResourceCard = ({ resource, className = '' }) =>
{
    const { name, description, link, tags } = resource;

    const handleCardClick = () =>
    {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className={`
        group relative p-6 
        bg-[var(--background)] 
        border border-[var(--border-color)] 
        rounded-2xl 
        hover:border-[var(--main-color)]/30 
        hover:shadow-lg hover:shadow-[var(--main-color)]/10
        transition-all duration-300 ease-in-out
        cursor-pointer
        transform hover:-translate-y-1
        ${className}
      `}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
            {
                if (e.key === 'Enter' || e.key === ' ')
                {
                    e.preventDefault();
                    handleCardClick();
                }
            }}
        >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--main-color)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

            {/* Content */}
            <div className="relative z-10">
                {/* Header with external link icon */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg md:text-2xl font-semibold text-[var(--text-color)] group-hover:text-[var(--main-color)] transition-colors duration-200">
                        {name}
                    </h3>
                    <div className="text-[var(--text-color)] opacity-50 group-hover:opacity-80 group-hover:text-[var(--main-color)] transition-all duration-200 ml-2 flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <polyline
                                points="15,3 21,3 21,9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <line
                                x1="10"
                                y1="14"
                                x2="21"
                                y2="3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* Description */}
                <p className="text-[var(--text-color)] opacity-70 mb-4 leading-relaxed text-md md:text-lg">
                    {description}
                </p>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="
                  px-2 py-1 
                  text-xs font-medium 
                  bg-[var(--main-color)]/10 
                  text-[var(--main-color)] 
                  rounded-full 
                  border border-[var(--main-color)]/20
                  group-hover:bg-[var(--main-color)]/20
                  transition-colors duration-200
                "
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Subtle animated border effect on hover */}
            <div className="absolute inset-0 border border-[var(--main-color)]/0 group-hover:border-[var(--main-color)]/20 rounded-2xl transition-all duration-300" />
        </div>
    );
};

export default ResourceCard;
