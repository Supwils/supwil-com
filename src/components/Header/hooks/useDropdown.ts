import { useState, useRef, useCallback, useEffect } from "react";

type DropdownName = string | null;

interface DropdownRefs {
    [key: string]: HTMLDivElement | null;
}

interface DropdownTimers {
    [key: string]: NodeJS.Timeout | null;
}

export const useDropdown = () => {
    const [activeDropdown, setActiveDropdown] = useState<DropdownName>(null);
    const dropdownTimers = useRef<DropdownTimers>({});
    const dropdownRefs = useRef<DropdownRefs>({});

    const showDropdown = useCallback((dropdown: string) => {
        // Clear any existing hide timer
        if (dropdownTimers.current[dropdown]) {
            clearTimeout(dropdownTimers.current[dropdown]!);
            dropdownTimers.current[dropdown] = null;
        }
        setActiveDropdown(dropdown);
    }, []);

    const hideDropdown = useCallback((dropdown: string) => {
        // Clear any existing timer
        if (dropdownTimers.current[dropdown]) {
            clearTimeout(dropdownTimers.current[dropdown]!);
        }
        // Set delay before hiding to allow mouse movement
        dropdownTimers.current[dropdown] = setTimeout(() => {
            setActiveDropdown((prev) => prev === dropdown ? null : prev);
            dropdownTimers.current[dropdown] = null;
        }, 150);
    }, []);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            Object.values(dropdownTimers.current).forEach(timer => {
                if (timer) clearTimeout(timer);
            });
        };
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (activeDropdown) {
                const target = e.target as HTMLElement;
                const dropdownElement = dropdownRefs.current[activeDropdown];
                if (dropdownElement && !dropdownElement.contains(target)) {
                    setActiveDropdown(null);
                }
            }
        };
        if (activeDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [activeDropdown]);

    const isDropdownOpen = useCallback((dropdown: string): boolean => {
        return activeDropdown === dropdown;
    }, [activeDropdown]);

    const setDropdownRef = useCallback((dropdown: string, el: HTMLDivElement | null) => {
        dropdownRefs.current[dropdown] = el;
    }, []);

    return {
        activeDropdown,
        isDropdownOpen,
        showDropdown,
        hideDropdown,
        setDropdownRef
    };
};

