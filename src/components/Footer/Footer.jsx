import ViewCounter from "@/components/UI/ViewCounter";

export default function Footer() {
  return (
    <footer
      className="w-full flex flex-col md:flex-row items-center justify-center gap-4 px-4 py-6 text-xs md:text-sm mt-8 border-t"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-color)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center justify-center">
        <span 
          className="font-medium tracking-wide"
          style={{ color: "var(--text-color)" }}
        >
          Supwil © {new Date().getFullYear()} All Rights Reserved
        </span>
      </div>
      <div className="flex items-center justify-center">
        <ViewCounter className="!text-xs md:!text-sm" />
      </div>
    </footer>
  );
}
