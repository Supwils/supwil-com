import React from 'react';

export type RecentTrack = {
  id: string;
  url: string;
  title?: string;
};

type RecentTracksListProps = {
  tracks: RecentTrack[];
  onSelectTrack: (track: RecentTrack) => void;
};

export default function RecentTracksList({
  tracks,
  onSelectTrack,
}: RecentTracksListProps) {
  if (tracks.length === 0) return null;

  return (
    <div className="border-t border-[var(--border-color)] pt-2 mt-1 relative overflow-hidden">
      <h4 className="text-sm m-0 mb-2">Recent Tracks</h4>
      <ul className="list-none m-0 p-0 flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-1">
        {tracks.map((track) => (
          <li
            key={track.id}
            onClick={() => onSelectTrack(track)}
            className="text-xs bg-[var(--background)] border border-[var(--border-color)] px-2 py-1 rounded-xl cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] transition-all duration-200 flex-shrink-0 hover:bg-[var(--main-color)] hover:text-white hover:scale-105"
          >
            <div className="inline-block w-full overflow-hidden">
              <span className="inline-block whitespace-nowrap">
                {track.title || track.id.substring(0, 6) + '...'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

