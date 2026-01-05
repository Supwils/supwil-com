import Link from "next/link";
import { Icon } from "@iconify/react";

const BrandLogo = () => {
  return (
    <Link 
      href="/" 
      className="text-xl md:text-2xl lg:text-3xl text-[var(--text-color)] font-bold hover:text-[var(--main-color)] transition-all duration-300 hover:scale-105 flex items-center gap-2"
    >
      <Icon icon="mdi:code-braces" className="text-[var(--main-color)]" />
      <span>Swil.</span>
    </Link>
  );
};

export default BrandLogo;

