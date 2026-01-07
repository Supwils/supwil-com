'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const FloatingAdminButton: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const [isHovered, setIsHovered] = useState<boolean>(false);

    if (!isAuthenticated) {
        return null; // Don't show if not authenticated
    }

    const handleLogout = async (): Promise<void> => {
        await logout();
        setIsHovered(false);
    };

    const handleAdminPage = (): void => {
        window.location.href = '/a1d2m3i4n5';
        setIsHovered(false);
    };

    return (
        <div
            className="fixed bottom-20 left-6 z-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Hover Menu - Positioned to the right of button */}
            {isHovered && (
                <div className="absolute bottom-0 left-16 bg-[var(--background)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden min-w-48 animate-in slide-in-from-left-2 duration-200">
                    <div className="p-2 space-y-1">
                        <button
                            onClick={handleAdminPage}
                            className="
                                w-full px-4 py-2 text-left
                                text-[var(--text-color)] 
                                hover:bg-[var(--main-color)]/10 
                                hover:text-[var(--main-color)]
                                rounded-lg
                                transition-all duration-200
                                flex items-center gap-3
                            "
                        >
                            <span className="text-lg">⚡</span>
                            <span className="text-sm font-medium">Admin Panel</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="
                                w-full px-4 py-2 text-left
                                text-red-500 
                                hover:bg-red-500/10
                                rounded-lg
                                transition-all duration-200
                                flex items-center gap-3
                            "
                        >
                            <span className="text-lg">🚪</span>
                            <span className="text-sm font-medium">Sign Out</span>
                        </button>
                    </div>

                    {/* Arrow pointing to button */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
                        <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-[var(--border-color)]"></div>
                        <div className="absolute w-0 h-0 border-t-7 border-b-7 border-r-7 border-t-transparent border-b-transparent border-r-[var(--background)] left-0.5 -top-1.5"></div>
                    </div>
                </div>
            )}

            {/* Main Button */}
            <button
                className="
                    w-14 h-14
                    bg-[var(--main-color)]
                    text-white
                    rounded-full
                    shadow-lg shadow-[var(--main-color)]/20
                    hover:shadow-xl hover:shadow-[var(--main-color)]/30
                    hover:scale-110
                    transition-all duration-300
                    flex items-center justify-center
                    group
                    border-2 border-[var(--main-color)]
                    hover:border-[var(--main-color)]/80
                "
                title="Admin Menu"
            >
                <div className="text-xl group-hover:rotate-12 transition-transform duration-300">
                    👑
                </div>
            </button>

            {/* Floating Indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </div>
    );
};

export default FloatingAdminButton;
