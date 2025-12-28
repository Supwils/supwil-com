import React from 'react';

type ProgressBarProps = {
  progress: number;
  duration: number;
  progressBarRef: React.RefObject<HTMLDivElement | null>;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (seconds: number) => string;
};

export default function ProgressBar({
  progress,
  duration,
  progressBarRef,
  onClick,
  onMouseDown,
  formatTime,
}: ProgressBarProps) {
  return (
    <div className="w-full flex flex-col gap-1">
      <div
        className="w-full h-1.5 bg-[var(--border-color)] rounded-full relative cursor-pointer overflow-hidden hover:h-2 transition-all duration-200"
        ref={progressBarRef}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        <div
          className="h-full bg-[var(--main-color)] rounded-full absolute top-0 left-0 pointer-events-none transition-all duration-100"
          style={{ width: `${(progress / duration) * 100 || 0}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-[var(--text-color)] opacity-70">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

