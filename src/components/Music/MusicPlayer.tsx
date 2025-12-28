'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import MusicPlayerPanel from './MusicPlayerPanel';
import MusicToggleButton from './MusicToggleButton';
import type { RecentTrack } from './RecentTracksList';

type StoredPlayerState = {
  videoId: string;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  timestamp: number;
};

const PLAYER_STATE_KEY = 'musicPlayerState';
const RECENT_TRACKS_KEY = 'recentTracks';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function extractVideoId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2]?.length === 11 ? match[2] : null;
}

function formatTime(seconds: number): string {
  if (Number.isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

export default function MusicPlayer() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isVisible, setIsVisible] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [recentTracks, setRecentTracks] = useState<RecentTrack[]>([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const playerInstanceRef = useRef<any>(null);
  const hideTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const savedSeekTimeRef = useRef(0);

  const videoIdRef = useRef(videoId);
  const isPlayingRef = useRef(isPlaying);
  const volumeRef = useRef(volume);
  const progressRef = useRef(progress);
  const durationRef = useRef(duration);

  useEffect(() => {
    videoIdRef.current = videoId;
  }, [videoId]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const opts = useMemo(
    () =>
      ({
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 0,
          controls: 0,
          start: 0,
        },
      }) as const,
    [],
  );

  const savePlayerState = useCallback(
    (nextVideoId: string, nextIsPlaying: boolean, currentTime = 0) => {
      const playerState: StoredPlayerState = {
        videoId: nextVideoId,
        isPlaying: nextIsPlaying,
        currentTime,
        volume: volumeRef.current,
        timestamp: Date.now(),
      };
      localStorage.setItem(PLAYER_STATE_KEY, JSON.stringify(playerState));
    },
    [],
  );

  const loadPlayerState = useCallback((): number => {
    try {
      const savedState = localStorage.getItem(PLAYER_STATE_KEY);
      if (!savedState) return 0;

      const state = JSON.parse(savedState) as StoredPlayerState;
      if (!state?.timestamp) return 0;
      if (Date.now() - state.timestamp >= ONE_DAY_MS) return 0;

      setVideoId(state.videoId);
      setIsPlaying(false);
      setVolume(state.volume);
      setUrl(`https://www.youtube.com/watch?v=${state.videoId}`);
      return state.currentTime || 0;
    } catch {
      return 0;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 300);
  }, []);

  const handleUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(event.target.value);
    },
    [],
  );

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    stopProgressTracking();

    progressIntervalRef.current = window.setInterval(() => {
      const player = playerInstanceRef.current;
      if (!player || !isPlayingRef.current) return;

      try {
        const currentTimeOrPromise = player.getCurrentTime();
        if (currentTimeOrPromise instanceof Promise) {
            currentTimeOrPromise.then((currentTime: number) => {
                setProgress(currentTime);
                if (Math.floor(currentTime) % 5 === 0) {
                    savePlayerState(videoIdRef.current, isPlayingRef.current, currentTime);
                }
            }).catch(() => {});
        } else {
            const currentTime = currentTimeOrPromise as number;
            setProgress(currentTime);
            if (Math.floor(currentTime) % 5 === 0) {
                savePlayerState(videoIdRef.current, isPlayingRef.current, currentTime);
            }
        }
      } catch {
        return;
      }
    }, 250);
  }, [savePlayerState, stopProgressTracking]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const id = extractVideoId(url);
      if (!id) {
        alert('Please enter a valid YouTube URL');
        return;
      }

      setVideoId(id);
      setIsPlaying(true);
      savePlayerState(id, true);
    },
    [savePlayerState, url],
  );

  const togglePlay = useCallback(() => {
    const player = playerInstanceRef.current;
    if (!player) return;

    if (isPlayingRef.current) {
      if (typeof player.pauseVideo === 'function') player.pauseVideo();
      savePlayerState(videoIdRef.current, false, progressRef.current);
      setIsPlaying(false);
    } else {
      if (typeof player.playVideo === 'function') player.playVideo();
      savePlayerState(videoIdRef.current, true, progressRef.current);
      setIsPlaying(true);
    }
  }, [savePlayerState]);

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = Number.parseInt(event.target.value, 10);
      setVolume(newVolume);
      volumeRef.current = newVolume;

      const player = playerInstanceRef.current;
      if (player && typeof player.setVolume === 'function') {
        player.setVolume(newVolume);
      }

      savePlayerState(videoIdRef.current, isPlayingRef.current, progressRef.current);
    },
    [savePlayerState],
  );

  const seekToClientX = useCallback(
    (clientX: number) => {
      const player = playerInstanceRef.current;
      const bar = progressBarRef.current;
      const currentDuration = durationRef.current;
      if (!player || !bar || !currentDuration) return;

      const rect = bar.getBoundingClientRect();
      const clickPosition = (clientX - rect.left) / rect.width;
      const newTime = clickPosition * currentDuration;

      if (typeof player.seekTo === 'function') {
        player.seekTo(newTime, true);
      }
      setProgress(newTime);
      progressRef.current = newTime;
      savePlayerState(videoIdRef.current, isPlayingRef.current, newTime);
    },
    [savePlayerState],
  );

  const handleProgressBarClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      seekToClientX(event.clientX);
    },
    [seekToClientX],
  );

  const handleDocumentMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDraggingRef.current) return;
      seekToClientX(event.clientX);
    },
    [seekToClientX],
  );

  const handleDocumentMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleDocumentMouseMove);
    document.removeEventListener('mouseup', handleDocumentMouseUp);
  }, [handleDocumentMouseMove]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      isDraggingRef.current = true;
      seekToClientX(event.clientX);
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
    },
    [handleDocumentMouseMove, handleDocumentMouseUp, seekToClientX],
  );

  const fetchVideoTitle = useCallback(async (id: string) => {
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      );
      const data = (await response.json()) as { title?: string };
      const title = data.title || `YouTube Video (${id})`;
      setVideoTitle(title);

      setRecentTracks((prev) => {
        const filteredTracks = prev.filter((track) => track.id !== id);
        const trackToAdd: RecentTrack = {
          id,
          url: `https://www.youtube.com/watch?v=${id}`,
          title,
        };
        const newTracks = [trackToAdd, ...filteredTracks].slice(0, 3);
        localStorage.setItem(RECENT_TRACKS_KEY, JSON.stringify(newTracks));
        return newTracks;
      });
    } catch {
      setVideoTitle(`YouTube Video (${id})`);
    }
  }, []);

  const onReady = useCallback(
    (event: any) => {
      playerInstanceRef.current = event.target;
      event.target.setVolume(volumeRef.current);

      const savedTime = savedSeekTimeRef.current;
      if (savedTime > 0) {
        event.target.seekTo(savedTime, true);
      }

      const getDuration = async () => {
        try {
          const d = await event.target.getDuration();
          setDuration(typeof d === 'number' ? d : 0);
        } catch {
          return;
        }
      };

      void getDuration();
      startProgressTracking();
    },
    [startProgressTracking],
  );

  const onStateChange = useCallback(
    (event: any) => {
      if (event?.data === 0) {
        setIsPlaying(false);
        setProgress(0);
        stopProgressTracking();
        savePlayerState(videoIdRef.current, false, 0);
      }

      if (event?.data === 1) {
        setIsPlaying(true);
        startProgressTracking();
      }

      if (event?.data === 2) {
        setIsPlaying(false);
        savePlayerState(videoIdRef.current, false, progressRef.current);
      }
    },
    [savePlayerState, startProgressTracking, stopProgressTracking],
  );

  const handleSelectTrack = useCallback(
    (track: RecentTrack) => {
      setVideoId(track.id);
      setUrl(track.url);
      setIsPlaying(true);
      savePlayerState(track.id, true);
    },
    [savePlayerState],
  );

  useEffect(() => {
    const savedTracks = localStorage.getItem(RECENT_TRACKS_KEY);
    if (savedTracks) {
      try {
        const parsed = JSON.parse(savedTracks) as RecentTrack[];
        setRecentTracks(Array.isArray(parsed) ? parsed : []);
      } catch {
        setRecentTracks([]);
      }
    }

    savedSeekTimeRef.current = loadPlayerState();
  }, [loadPlayerState]);

  useEffect(() => {
    if (!videoId) return;
    void fetchVideoTitle(videoId);
    setProgress(0);
    setDuration(0);
  }, [fetchVideoTitle, videoId]);

  useEffect(() => {
    return () => {
      stopProgressTracking();
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, [handleDocumentMouseMove, handleDocumentMouseUp, stopProgressTracking]);

  useEffect(() => {
    if (isPlaying) startProgressTracking();
  }, [isPlaying, startProgressTracking]);

  return (
    <div className="fixed bottom-50 right-50 z-[100]">
      <MusicToggleButton
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <div
        className={`fixed bottom-[60px] right-5 w-10 h-[50px] z-[100] opacity-0 ${
          isVisible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        onMouseEnter={handleMouseEnter}
      />

      <MusicPlayerPanel
        containerRef={containerRef}
        isVisible={isVisible}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        url={url}
        onUrlChange={handleUrlChange}
        onSubmit={handleSubmit}
        videoTitle={videoTitle}
        progress={progress}
        duration={duration}
        progressBarRef={progressBarRef}
        onProgressClick={handleProgressBarClick}
        onProgressMouseDown={handleMouseDown}
        formatTime={formatTime}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        recentTracks={recentTracks}
        onSelectTrack={handleSelectTrack}
        youtubeNode={
          videoId ? (
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onReady}
              onStateChange={onStateChange}
              className="hidden"
            />
          ) : null
        }
      />
    </div>
  );
}
