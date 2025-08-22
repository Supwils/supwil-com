"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownStates, setDropdownStates] = useState({
    me: false,
    explore: false
  });
  const dropdownTimers = useRef({ me: null, explore: null });
  const { theme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    console.log("Menu toggled:", !isOpen); // Debug log
  };

  const handleClick = (e) => {
    e.preventDefault();
    // Null implementation as requested
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Dropdown animation functions with improved timing
  const showDropdown = (dropdown) => {
    if (dropdownTimers.current[dropdown]) {
      clearTimeout(dropdownTimers.current[dropdown]);
      dropdownTimers.current[dropdown] = null;
    }
    setDropdownStates(prev => ({ ...prev, [dropdown]: true }));
  };

  const hideDropdown = (dropdown) => {
    if (dropdownTimers.current[dropdown]) {
      clearTimeout(dropdownTimers.current[dropdown]);
    }
    dropdownTimers.current[dropdown] = setTimeout(() => {
      setDropdownStates(prev => ({ ...prev, [dropdown]: false }));
    }, 80);
  };

  // Listen for theme changes and show notification
  useEffect(() => {
    if (theme) {
      const themeName = theme === 'dark' ? 'Dark' : 'Light';
      showNotification(`Switched to ${themeName} mode`, 'success');
    }
  }, [theme]);

  // Handle scroll for show/hide functionality
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(dropdownTimers.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  return (
    <>
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[1000] min-w-[250px] text-center font-medium text-sm md:text-base transition-all duration-300 ${notification.type === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
          }`}>
          {notification.message}
        </div>
      )}

      <header className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-[70%] px-8 py-4 bg-[var(--background)] flex justify-between items-center z-[100] border border-[var(--border-color)] rounded-3xl backdrop-blur-md bg-opacity-80 shadow-lg transition-all duration-300 max-md:w-[95%] max-md:px-4 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <Link href="/" className="text-xl md:text-2xl lg:text-3xl text-[var(--text-color)] font-bold hover:text-[var(--main-color)] transition-all duration-300 hover:scale-105">
          Swil.
        </Link>

        {/* Hamburger Menu Icon */}
        <div
          className="hidden max-md:block text-xl cursor-pointer text-[var(--text-color)] hover:text-[var(--main-color)] transition-colors duration-300"
          onClick={toggleMenu}
        >
          ☰
        </div>

        {/* Desktop Navbar Links */}
        <nav className="flex items-center gap-6 max-md:hidden">

          <Lik
            href="/"
            className="text-lg md:text-xl font-semibold text-[var(--main-color)] px-4 py-2 rounded-xl hover:bg-[var(--main-color)] hover:text-white transition-all duration-300 hover:scale-105"
          >
            Home
          </Link>

          {/* Me Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => showDropdown('me')}
            onMouseLeave={() => hideDropdown('me')}
          >
            <button
              onClick={handleClick}
              className="text-base md:text-xl font-semibold text-[var(--text-color)] px-4 py-2 rounded-xl hover:bg-[var(--main-color)] hover:text-white transition-all duration-300 hover:scale-105"
            >
              Me <span className={dropdownStates.me ? "hidden" : ""}>🙈</span><span className={dropdownStates.me ? "" : "hidden"}>🙉</span>
            </button>

            {/* Invisible hover bridge - increased height for better tolerance */}
            <div
              className={`absolute top-full left-0 w-full h-4 ${dropdownStates.me ? 'pointer-events-auto' : 'pointer-events-none'}`}
              onMouseEnter={() => showDropdown('me')}
              onMouseLeave={() => hideDropdown('me')}
            />

            <div
              className={`absolute top-full left-0 mt-1 bg-[var(--background)] min-w-[180px] shadow-xl z-10 rounded-xl overflow-hidden border border-[var(--border-color)] backdrop-blur-md bg-opacity-95 transition-all duration-300 ${dropdownStates.me
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'}`}
              onMouseEnter={() => showDropdown('me')}
              onMouseLeave={() => hideDropdown('me')}
            >
              <Link href="/#about" onClick={handleClick} className="block text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 hover:pl-6">About</Link>
              <Link href="/#experience" onClick={handleClick} className="block text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 hover:pl-6">Experience</Link>
              <Link href="/#contact" onClick={handleClick} className="block text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 hover:pl-6">Contact</Link>
              <Link href="/Personal/Lifestyle" onClick={handleClick} className="block text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 hover:pl-6">Lifestyle</Link>
              <button
                onClick={handleClick}
                className="block w-full text-left text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 border-none bg-none cursor-pointer hover:pl-6"
              >
                {isAdmin ? 'Admin Logout' : 'Admin Login'}
              </button>
            </div>
          </div>

          {/* Explore Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => showDropdown('explore')}
            onMouseLeave={() => hideDropdown('explore')}
          >
            <button
              onClick={handleClick}
              className="text-base md:text-xl font-semibold text-[var(--text-color)] px-4 py-2 rounded-xl hover:bg-[var(--main-color)] hover:text-white transition-all duration-300 hover:scale-105"
            >
              Explore <span className={dropdownStates.explore ? "hidden" : ""}>🤐</span><span className={dropdownStates.explore ? "" : "hidden"}>😆</span>
            </button>

            {/* Invisible hover bridge - increased height for better tolerance */}
            <div
              className={`absolute top-full left-0 w-full h-4 ${dropdownStates.explore ? 'pointer-events-auto' : 'pointer-events-none'}`}
              onMouseEnter={() => showDropdown('explore')}
              onMouseLeave={() => hideDropdown('explore')}
            />

            <div
              className={`absolute top-full left-0 mt-1 bg-[var(--background)] min-w-[180px] shadow-xl z-10 rounded-xl overflow-hidden border border-[var(--border-color)] backdrop-blur-md bg-opacity-95 transition-all duration-300 ${dropdownStates.explore
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'}`}
              onMouseEnter={() => showDropdown('explore')}
              onMouseLeave={() => hideDropdown('explore')}
            >
              <Link href="/blog" className="block text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 hover:pl-6">Blogs</Link>
              <Link href="/project" className="block text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 hover:pl-6">Projects</Link>
              <Link href="/resource" className="block text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 hover:pl-6">Resources</Link>
              <Link href="/demo/solarsystem3js" className="block text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 hover:pl-6">3D Solar System</Link>
              {isAdmin && (
                <Link
                  href="/BlogAdmin"
                  onClick={handleClick}
                  className="block text-[var(--main-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 font-medium relative before:content-['🔐'] before:mr-2 hover:pl-6"
                >
                  Blog Admin
                </Link>
              )}
            </div>
          </div>

          {/* Theme Toggle Switch */}
          <div className="ml-2">
            <ThemeToggle />
          </div>

          {/* Translate Placeholder */}
          <div className="ml-2">
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-[var(--background)] bg-opacity-50 text-[var(--text-color)] rounded-xl text-sm md:text-base font-semibold hover:bg-[var(--main-color)] hover:text-white transition-all duration-300 hover:scale-105 border border-[var(--border-color)]"
            >
              EN
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="fixed top-[100px] left-1/2 transform -translate-x-1/2 w-[95%] max-w-6xl bg-[var(--background)] border border-[var(--border-color)] rounded-2xl backdrop-blur-md bg-opacity-90 shadow-lg z-[99] md:hidden">
          <nav className="flex flex-col py-4">

            <Link
              href="/#home"
              onClick={handleClick}
              className="text-base font-bold text-[var(--main-color)] py-3 px-6 hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200"
            >
              Home
            </Link>

            {/* Mobile Me Section */}
            <div className="border-t border-[var(--border-color)] mt-2 pt-2">
              <div className="text-lg font-bold text-[var(--text-color)] py-2 px-6">
                Me 🙈
              </div>
              <Link href="/#about" onClick={handleClick} className="block text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200">About</Link>
              <Link href="/#experience" onClick={handleClick} className="block text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200">Experience</Link>
              <Link href="/#contact" onClick={handleClick} className="block text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200">Contact</Link>
              <Link href="/Personal/Lifestyle" onClick={handleClick} className="block text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200">Lifestyle</Link>
              <button
                onClick={handleClick}
                className="block w-full text-left text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200 border-none bg-none cursor-pointer"
              >
                {isAdmin ? 'Admin Logout' : 'Admin Login'}
              </button>
            </div>

            {/* Mobile Explore Section */}
            <div className="border-t border-[var(--border-color)] mt-2 pt-2">
              <div className="text-lg font-bold text-[var(--text-color)] py-2 px-6">
                Explore 🤐
              </div>
              <Link href="/blog" className="block text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200">Blogs</Link>
              <Link href="/project" onClick={handleClick} className="block text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200">Projects</Link>
              <Link href="/resource" onClick={handleClick} className="block text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200">Resources</Link>
              {isAdmin && (
                <Link
                  href="/BlogAdmin"
                  onClick={handleClick}
                  className="block text-[var(--main-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200 font-medium relative before:content-['🔐'] before:mr-2"
                >
                  Blog Admin
                </Link>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="border-t border-[var(--border-color)] mt-2 pt-4 px-6 flex justify-between items-center">
              {/* Theme Toggle Switch */}
              <ThemeToggle />

              {/* Translate */}
              <button
                onClick={handleClick}
                className="px-3 py-1 bg-[var(--background)] bg-opacity-30 text-[var(--text-color)] rounded-lg text-base font-medium hover:bg-[var(--main-color)] hover:text-white transition-colors duration-300"
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default HeaderNav;
