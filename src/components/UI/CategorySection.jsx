'use client';

import React, { useState } from 'react';
import ResourceCard from './RecourceCard';

const CategorySection = ({ category }) =>
{
    const [isExpanded, setIsExpanded] = useState(true);

    if (!category.resources || category.resources.length === 0)
    {
        return null; // Don't render empty categories
    }

    return (
        <div className="mb-12">
            {/* Category Header */}
            <div
                className="flex items-center gap-4 mb-6 cursor-pointer group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="text-3xl">{category.icon}</div>
                <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-color)] group-hover:text-[var(--main-color)] transition-colors duration-200">
                        {category.name}
                    </h2>
                    <p className="text-[var(--text-color)] opacity-70 mt-1">
                        {category.description}
                    </p>
                </div>
                <div className="text-[var(--text-color)] opacity-50 group-hover:opacity-80 transition-opacity duration-200">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                        <polyline
                            points="6,9 12,15 18,9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* Resources Grid */}
            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-12">
                    {category.resources.map((resource, index) => (
                        <ResourceCard
                            key={`${category.id}-${index}`}
                            resource={resource}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategorySection; 