'use client';

import { useState, useEffect } from 'react';

export default function ViewCounter({ page = 'home', className = '' }) {
    const [viewCount, setViewCount] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchViewCount = async () => {
            try {
                const response = await fetch(`/api/views?page=${page}`);
                const data = await response.json();
                
                if (data.success) {
                    setViewCount(data.count);
                }
            } catch (error) {
                console.warn('Error fetching view count:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchViewCount();
    }, [page]);
    
    if (loading) {
        return (
            <div className={`text-sm text-gray-500 ${className}`}>
                Loading views...
            </div>
        );
    }
    
    if (viewCount === null) {
        return null;
    }
    
    return (
        <div className={`text-sm text-gray-500 ${className}`}>
            👁️ {viewCount.toLocaleString()} views
        </div>
    );
}