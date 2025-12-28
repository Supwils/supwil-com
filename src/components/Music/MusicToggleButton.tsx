import React from 'react';

type MusicToggleButtonProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function MusicToggleButton({
  onMouseEnter,
  onMouseLeave,
}: MusicToggleButtonProps) {
  return (
    <button
      className="fixed bottom-5 right-5 w-15 h-15 rounded-full bg-[var(--main-color)] text-white text-2xl flex items-center justify-center cursor-pointer border-none z-[101] shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label="Show music player"
    >
      ♫
    </button>
  );
}

