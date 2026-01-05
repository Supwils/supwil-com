import { Icon } from "@iconify/react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuButton = ({ isOpen, onToggle }: MobileMenuButtonProps) => {
  return (
    <button
      data-mobile-toggle
      className="md:hidden p-2 cursor-pointer text-[var(--text-color)] hover:text-[var(--main-color)] transition-colors duration-300 rounded-lg hover:bg-[var(--main-color)]/10"
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      <Icon 
        icon={isOpen ? "mdi:close" : "mdi:menu"} 
        className="w-6 h-6" 
      />
    </button>
  );
};

export default MobileMenuButton;

