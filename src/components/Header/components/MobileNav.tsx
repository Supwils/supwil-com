import Link from "next/link";
import { Icon } from "@iconify/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MouseEvent } from "react";

interface MobileNavProps {
  isOpen: boolean;
  closeMenu: () => void;
  isAdmin: boolean;
  handleClick: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

const MobileNav = ({ isOpen, closeMenu, isAdmin, handleClick }: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div 
      data-mobile-menu
      className="fixed top-[80px] left-1/2 transform -translate-x-1/2 w-[95%] max-w-6xl bg-[var(--background)] border border-[var(--border-color)] rounded-2xl backdrop-blur-md bg-opacity-90 shadow-lg z-[99] md:hidden animate-in fade-in slide-in-from-top-2"
    >
      <nav className="flex flex-col py-4">
        <Link
          href="/#home"
          onClick={closeMenu}
          className="flex items-center gap-3 text-base font-bold text-[var(--main-color)] py-3 px-6 hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200"
        >
          <Icon icon="mdi:home" className="w-5 h-5" />
          <span>Home</span>
        </Link>

        {/* Mobile Me Section */}
        <div className="border-t border-[var(--border-color)] mt-2 pt-2">
          <div className="flex items-center gap-3 text-lg font-bold text-[var(--text-color)] py-2 px-6">
            <Icon icon="mdi:account" className="w-5 h-5" />
            <span>Me</span>
          </div>
          <Link 
            href="/#about" 
            onClick={closeMenu} 
            className="flex items-center gap-3 text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200"
          >
            <Icon icon="mdi:account-circle" className="w-4 h-4" />
            <span>About</span>
          </Link>
          <Link 
            href="/#experience" 
            onClick={closeMenu} 
            className="flex items-center gap-3 text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200"
          >
            <Icon icon="mdi:briefcase" className="w-4 h-4" />
            <span>Experience</span>
          </Link>
          <Link 
            href="/#contact" 
            onClick={closeMenu} 
            className="flex items-center gap-3 text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200"
          >
            <Icon icon="mdi:email" className="w-4 h-4" />
            <span>Contact</span>
          </Link>
          <Link 
            href="/Personal/Lifestyle" 
            onClick={closeMenu} 
            className="flex items-center gap-3 text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200"
          >
            <Icon icon="mdi:heart" className="w-4 h-4" />
            <span>Lifestyle</span>
          </Link>
          <button
            onClick={handleClick}
            className="flex items-center gap-3 w-full text-left text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200 border-none bg-none cursor-pointer"
          >
            <Icon icon={isAdmin ? "mdi:logout" : "mdi:login"} className="w-4 h-4" />
            <span>{isAdmin ? 'Admin Logout' : 'Admin Login'}</span>
          </button>
        </div>

        {/* Mobile Explore Section */}
        <div className="border-t border-[var(--border-color)] mt-2 pt-2">
          <div className="flex items-center gap-3 text-lg font-bold text-[var(--text-color)] py-2 px-6">
            <Icon icon="mdi:compass" className="w-5 h-5" />
            <span>Explore</span>
          </div>
          <Link 
            href="/blog" 
            onClick={closeMenu}
            className="flex items-center gap-3 text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200"
          >
            <Icon icon="mdi:book-open-page-variant" className="w-4 h-4" />
            <span>Blogs</span>
          </Link>
          <Link 
            href="/project" 
            onClick={closeMenu} 
            className="flex items-center gap-3 text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200"
          >
            <Icon icon="mdi:folder-multiple" className="w-4 h-4" />
            <span>Projects</span>
          </Link>
          <Link 
            href="/resource" 
            onClick={closeMenu} 
            className="flex items-center gap-3 text-[var(--text-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200"
          >
            <Icon icon="mdi:bookmark-multiple" className="w-4 h-4" />
            <span>Resources</span>
          </Link>
          {isAdmin && (
            <Link
              href="/BlogAdmin"
              onClick={closeMenu}
              className="flex items-center gap-3 text-[var(--main-color)] py-2 px-8 text-base hover:bg-[var(--main-color)] hover:text-white transition-colors duration-200 font-medium"
            >
              <Icon icon="mdi:lock" className="w-4 h-4" />
              <span>Blog Admin</span>
            </Link>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="border-t border-[var(--border-color)] mt-2 pt-4 px-6 flex justify-between items-center">
          <ThemeToggle />
          <button
            onClick={handleClick}
            className="px-3 py-1 bg-[var(--background)] bg-opacity-30 text-[var(--text-color)] rounded-lg text-base font-medium hover:bg-[var(--main-color)] hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            <Icon icon="mdi:translate" className="w-4 h-4" />
            <span>EN</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MobileNav;

