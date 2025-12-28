import React from 'react';
import type { RecentTrack } from './RecentTracksList';
import ProgressBar from './ProgressBar';
import RecentTracksList from './RecentTracksList';

type MusicPlayerPanelProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  url: string;
  onUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  videoTitle: string;
  progress: number;
  duration: number;
  progressBarRef: React.RefObject<HTMLDivElement | null>;
  onProgressClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onProgressMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (seconds: number) => string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  recentTracks: RecentTrack[];
  onSelectTrack: (track: RecentTrack) => void;
  youtubeNode: React.ReactNode;
};

export default function MusicPlayerPanel({
  containerRef,
  isVisible,
  onMouseEnter,
  onMouseLeave,
  url,
  onUrlChange,
  onSubmit,
  videoTitle,
  progress,
  duration,
  progressBarRef,
  onProgressClick,
  onProgressMouseDown,
  formatTime,
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
  recentTracks,
  onSelectTrack,
  youtubeNode,
}: MusicPlayerPanelProps) {
  return (
    <div
      ref={containerRef}
      className={`fixed bottom-[70px] right-5 w-[350px] bg-[var(--background)] rounded-xl border border-[var(--border-color)] text-[var(--text-color)] z-[100] p-0 transition-all duration-300 shadow-lg ${
        !isVisible
          ? 'opacity-0 translate-y-5 pointer-events-none'
          : 'opacity-100 translate-y-0'
      } max-md:w-full max-md:right-0 max-md:bottom-0 max-md:rounded-none`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--border-color)] bg-[var(--background)] rounded-t-xl max-md:rounded-none">
        <div className="flex items-center gap-2">
          <span className="text-lg text-[var(--main-color)]">♫</span>
          <h3 className="m-0 text-xl font-semibold">Chilling...</h3>
        </div>
      </div>

      <div className="flex flex-col p-4 gap-4">
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={onUrlChange}
            placeholder="Paste YouTube URL here"
            className="flex-1 px-3 py-2 rounded-full border border-[var(--border-color)] bg-[var(--background)] text-[var(--text-color)] text-sm focus:outline-none focus:border-[var(--main-color)] focus:ring-1 focus:ring-[var(--main-color)]"
          />
          <button
            type="submit"
            className="w-8 h-8 rounded-full border-none bg-[var(--main-color)] text-white cursor-pointer text-sm flex items-center justify-center p-0 transition-transform duration-200 hover:scale-110"
          >
            ▶
          </button>
        </form>

        {videoTitle && (
          <div className="py-4 w-full overflow-hidden">
            <div className="flex items-center gap-1 w-full overflow-hidden">
              <div className="text-xl whitespace-nowrap overflow-hidden text-ellipsis w-full relative">
                <div className="inline-block w-full overflow-hidden">
                  <span
                    className={`inline-block whitespace-nowrap pr-12 ${
                      videoTitle.length > 30 ? 'animate-scroll' : ''
                    }`}
                  >
                    {videoTitle}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <ProgressBar
          progress={progress}
          duration={duration}
          progressBarRef={progressBarRef}
          onClick={onProgressClick}
          onMouseDown={onProgressMouseDown}
          formatTime={formatTime}
        />

        <div className="flex items-center gap-4">
          <button
            onClick={onTogglePlay}
            className="w-9 h-9 rounded-full border-none bg-[var(--main-color)] text-white cursor-pointer text-sm flex items-center justify-center transition-transform duration-200 hover:scale-110"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm w-4">
              {volume < 10 ? '🔈' : volume < 50 ? '🔉' : '🔊'}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={onVolumeChange}
              className="flex-1 h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        <RecentTracksList tracks={recentTracks} onSelectTrack={onSelectTrack} />
      </div>

      {youtubeNode}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--main-color);
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--main-color);
          cursor: pointer;
          border: none;
        }

        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          10% {
            transform: translateX(0);
          }
          60% {
            transform: translateX(calc(-100% + 200px));
          }
          90% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll {
          animation: scroll 15s linear infinite;
        }
      `}</style>
    </div>
  );
}

