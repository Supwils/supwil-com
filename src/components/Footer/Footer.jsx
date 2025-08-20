import ViewCounter from "@/components/UI/ViewCounter";

export default function Footer() {
  return (
    <footer
      className="w-full flex flex-col md:flex-row items-center justify-between gap-2 px-4 py-6 border-t border-[var(--border)] bg-[var(--footer-bg)] text-[var(--footer-text)] text-xs md:text-sm mt-8"
      style={{
        background: "var(--footer-bg, #fff)",
        color: "var(--footer-text, #222)",
        borderColor: "var(--border, #e5e7eb)",
      }}
    >
      <div className="flex-1 flex items-center justify-center md:justify-start">
        <span className="font-medium tracking-wide">Supwil © {new Date().getFullYear()} All Rights Reserved</span>
      </div>
      <div className="flex-1 flex items-center justify-center md:justify-end">
        <ViewCounter className="!text-xs md:!text-sm" />
      </div>
    </footer>
  );
}
