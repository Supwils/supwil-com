import { useState, useEffect } from "react";

export const useHeaderScroll = (): boolean => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollThreshold = 100;
          const scrollDelta = 10;

          if (currentScrollY < scrollThreshold) {
            setIsVisible(true);
          } else if (Math.abs(currentScrollY - lastScrollY) > scrollDelta) {
            setIsVisible(currentScrollY < lastScrollY);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return isVisible;
};

