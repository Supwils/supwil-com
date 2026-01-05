"use client";

import { useState, useCallback } from "react";
import { useHeaderScroll } from "./hooks/useHeaderScroll";
import { useDropdown } from "./hooks/useDropdown";
import { useMobileMenu } from "./hooks/useMobileMenu";
import NotificationToast from "./components/NotificationToast";
import BrandLogo from "./components/BrandLogo";
import MobileMenuButton from "./components/MobileMenuButton";
import DesktopNav from "./components/DesktopNav";
import MobileNav from "./components/MobileNav";

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const HeaderNav = () => {
  const [isAdmin] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

  const isVisible = useHeaderScroll();
  const { isDropdownOpen, showDropdown, hideDropdown, setDropdownRef } = useDropdown();
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
  }, []);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  }, []);

  return (
    <>
      <NotificationToast notification={notification} />

      <header className={`fixed top-0 left-1/2 transform -translate-x-1/2 container px-4 md:px-8 py-3 md:py-4 bg-[var(--background)] flex justify-between items-center z-[100] border border-[var(--border-color)] rounded-2xl md:rounded-3xl backdrop-blur-md bg-opacity-80 shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <BrandLogo />

        <MobileMenuButton isOpen={isOpen} onToggle={toggleMenu} />

        <DesktopNav
          isDropdownOpen={isDropdownOpen}
          showDropdown={showDropdown}
          hideDropdown={hideDropdown}
          setDropdownRef={setDropdownRef}
          isAdmin={isAdmin}
          handleClick={handleClick}
        />
      </header>

      <MobileNav
        isOpen={isOpen}
        closeMenu={closeMenu}
        isAdmin={isAdmin}
        handleClick={handleClick}
      />
    </>
  );
};

export default HeaderNav;

