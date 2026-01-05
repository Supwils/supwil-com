import { Icon } from "@iconify/react";
import Link from "next/link";
import { MouseEvent } from "react";

export interface DropdownItem {
  type: 'link' | 'button';
  href?: string;
  label: string;
  icon: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  adminOnly?: boolean;
  highlight?: boolean;
}

interface DropdownProps {
  name: string;
  label: string;
  icon: string;
  iconOpen?: string;
  isOpen: boolean;
  onShow: (name: string) => void;
  onHide: (name: string) => void;
  items: DropdownItem[];
  isAdmin: boolean;
  setRef: (dropdown: string, el: HTMLDivElement | null) => void;
}

const Dropdown = ({ 
  name, 
  label, 
  icon, 
  iconOpen, 
  isOpen, 
  onShow, 
  onHide, 
  items, 
  isAdmin,
  setRef 
}: DropdownProps) => {
  return (
    <div
      ref={(el) => setRef(name, el)}
      className="relative group"
      onMouseEnter={() => onShow(name)}
      onMouseLeave={() => onHide(name)}
    >
      <button
        onClick={(e) => e.preventDefault()}
        className="text-base md:text-lg font-semibold text-[var(--text-color)] px-3 md:px-4 py-2 rounded-xl hover:bg-[var(--main-color)] hover:text-white transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        <Icon 
          icon={isOpen ? (iconOpen || icon) : icon} 
          className="w-4 h-4" 
        />
        <span>{label}</span>
        <Icon 
          icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} 
          className="w-4 h-4 transition-transform duration-200" 
        />
      </button>

      {/* Invisible hover bridge */}
      <div
        className={`absolute top-full left-0 w-full h-2 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onMouseEnter={() => onShow(name)}
        onMouseLeave={() => onHide(name)}
      />

      <div
        className={`absolute top-full left-0 mt-2 bg-[var(--background)] min-w-[200px] shadow-xl z-10 rounded-xl overflow-hidden border border-[var(--border-color)] backdrop-blur-md bg-opacity-95 transition-all duration-200 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        onMouseEnter={() => onShow(name)}
        onMouseLeave={() => onHide(name)}
      >
        {items.map((item, index) => {
          if (item.adminOnly && !isAdmin) return null;
          
          if (item.type === 'button') {
            return (
              <button
                key={index}
                onClick={item.onClick || ((e) => e.preventDefault())}
                className="flex items-center gap-3 w-full text-left text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 border-none bg-none cursor-pointer hover:pl-6"
              >
                <Icon icon={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={index}
              href={item.href || '#'}
              onClick={item.onClick || ((e) => e.preventDefault())}
              className={`flex items-center gap-3 text-[var(--text-color)] px-5 py-3 text-sm md:text-base hover:bg-[var(--main-color)] hover:text-white transition-all duration-200 hover:pl-6 ${
                item.highlight ? 'text-[var(--main-color)] font-medium' : ''
              }`}
            >
              <Icon icon={item.icon} className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;

