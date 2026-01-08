import Link from "next/link";
import { Icon } from "@iconify/react";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";
import Dropdown, { DropdownItem } from "./Dropdown";
import { MouseEvent } from "react";

interface DesktopNavProps {
  isDropdownOpen: (dropdown: string) => boolean;
  showDropdown: (dropdown: string) => void;
  hideDropdown: (dropdown: string) => void;
  setDropdownRef: (dropdown: string, el: HTMLDivElement | null) => void;
  isAdmin: boolean;
  handleClick: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

const DesktopNav = ({ 
  isDropdownOpen, 
  showDropdown, 
  hideDropdown, 
  setDropdownRef,
  isAdmin,
  handleClick 
}: DesktopNavProps) => {
  const meItems: DropdownItem[] = [
    { type: 'link', href: '/#about', label: 'About', icon: 'mdi:account-circle' },
    { type: 'link', href: '/#experience', label: 'Experience', icon: 'mdi:briefcase' },
    { type: 'link', href: '/#contact', label: 'Contact', icon: 'mdi:email' },
    { type: 'link', href: '/Personal/Lifestyle', label: 'Lifestyle', icon: 'mdi:heart' },
    { type: 'button', label: isAdmin ? 'Admin Logout' : 'Admin Login', icon: isAdmin ? 'mdi:logout' : 'mdi:login', onClick: handleClick }
  ];

  const exploreItems: DropdownItem[] = [
    { type: 'link', href: '/blog', label: 'Blogs', icon: 'mdi:book-open-page-variant' },
    { type: 'link', href: '/project', label: 'Projects', icon: 'mdi:folder-multiple' },
    { type: 'link', href: '/resource', label: 'Resources', icon: 'mdi:bookmark-multiple' },
    { type: 'link', href: '/demo/solarsystem3js', label: '3D Solar System', icon: 'mdi:orbit' },
    { type: 'link', href: '/BlogAdmin', label: 'Blog Admin', icon: 'mdi:lock', adminOnly: true, highlight: true }
  ];

  return (
    <nav className="hidden md:flex items-center gap-4 lg:gap-6">
      <Link
        href="/"
        className="text-base md:text-lg font-semibold text-[var(--main-color)] px-3 md:px-4 py-2 rounded-xl hover:bg-[var(--main-color)] hover:text-white transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        <Icon icon="mdi:home" className="w-4 h-4" />
        <span>Home</span>
      </Link>

      <Dropdown
        name="me"
        label="Me"
        icon="mdi:account"
        iconOpen="mdi:account-eye"
        isOpen={isDropdownOpen('me')}
        onShow={showDropdown}
        onHide={hideDropdown}
        items={meItems}
        isAdmin={isAdmin}
        setRef={setDropdownRef}
      />

      <Dropdown
        name="explore"
        label="Explore"
        icon="mdi:compass"
        iconOpen="mdi:compass-outline"
        isOpen={isDropdownOpen('explore')}
        onShow={showDropdown}
        onHide={hideDropdown}
        items={exploreItems}
        isAdmin={isAdmin}
        setRef={setDropdownRef}
      />

      <div className="ml-2">
        <ThemeToggle />
      </div>

      <div className="ml-2">
        <button
          onClick={handleClick}
          className="px-3 md:px-4 py-2 bg-[var(--background)] bg-opacity-50 text-[var(--text-color)] rounded-xl text-sm md:text-base font-semibold hover:bg-[var(--main-color)] hover:text-white transition-all duration-300 hover:scale-105 border border-[var(--border-color)] flex items-center gap-2"
        >
          <Icon icon="mdi:translate" className="w-4 h-4" />
          <span>EN</span>
        </button>
      </div>
    </nav>
  );
};

export default DesktopNav;

