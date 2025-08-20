'use client';

import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

const MusicPlayer = () =>
{
    const [url, setUrl] = useState('');
    const [videoId, setVideoId] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isVisible, setIsVisible] = useState(false);
    const [videoTitle, setVideoTitle] = useState('');
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const [recentTracks, setRecentTracks] = useState([]);
    const hideTimerRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const progressInterval = useRef(null);
    const progressBarRef = useRef(null);
    const isDraggingRef = useRef(false);

    // Extract YouTube video ID from URL
    const extractVideoId = (url) =>
    {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Handle URL input change
    const handleUrlChange = (e) =>
    {
        setUrl(e.target.value);
    };

    // Handle form submission
    const handleSubmit = (e) =>
    {
        e.preventDefault();
        const id = extractVideoId(url);
        if (id)
        {
            setVideoId(id);
            setIsPlaying(true);
            // Save player state to localStorage
            savePlayerState(id, true);
        } else
        {
            alert('Please enter a valid YouTube URL');
        }
    };

    // Save player state to localStorage
    const savePlayerState = (videoId, isPlaying, currentTime = 0) =>
    {
        const playerState = {
            videoId,
            isPlaying,
            currentTime,
            volume,
            timestamp: Date.now()
        };
        localStorage.setItem('musicPlayerState', JSON.stringify(playerState));
    };

    // Load player state from localStorage
    const loadPlayerState = () =>
    {
        try
        {
            const savedState = localStorage.getItem('musicPlayerState');
            if (savedState)
            {
                const state = JSON.parse(savedState);
                // Only restore if saved within last 24 hours
                if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000)
                {
                    setVideoId(state.videoId);
                    setIsPlaying(false); // Never auto-play on first load
                    setVolume(state.volume);
                    setUrl(`https://www.youtube.com/watch?v=${state.videoId}`);
                    return state.currentTime;
                }
            }
        } catch (error)
        {
            console.error('Error loading player state:', error);
        }
        return 0;
    };

    // Handle mouse enter for both components
    const handleMouseEnter = () =>
    {
        if (hideTimerRef.current)
        {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
        setIsVisible(true);
    };

    // Handle mouse leave for both components
    const handleMouseLeave = () =>
    {
        hideTimerRef.current = setTimeout(() =>
        {
            setIsVisible(false);
        }, 300);
    };

    // Handle play/pause toggle
    const togglePlay = () =>
    {
        if (playerRef.current)
        {
            if (isPlaying)
            {
                playerRef.current.internalPlayer.pauseVideo();
                savePlayerState(videoId, false, progress);
            } else
            {
                playerRef.current.internalPlayer.playVideo();
                savePlayerState(videoId, true, progress);
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle volume change
    const handleVolumeChange = (e) =>
    {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        if (playerRef.current)
        {
            playerRef.current.internalPlayer.setVolume(newVolume);
        }
        savePlayerState(videoId, isPlaying, progress);
    };

    // Format time (seconds) to MM:SS format
    const formatTime = (seconds) =>
    {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
    };

    // Handle progress bar click/drag
    const handleProgressBarClick = (e) =>
    {
        if (!playerRef.current || !duration) return;

        const progressBar = progressBarRef.current;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const newTime = clickPosition * duration;

        playerRef.current.internalPlayer.seekTo(newTime, true);
        setProgress(newTime);
        savePlayerState(videoId, isPlaying, newTime);
    };

    // Handle progress bar mouse down
    const handleMouseDown = (e) =>
    {
        isDraggingRef.current = true;
        handleProgressBarClick(e);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Handle progress bar mouse move (for dragging)
    const handleMouseMove = (e) =>
    {
        if (isDraggingRef.current)
        {
            handleProgressBarClick(e);
        }
    };

    // Handle progress bar mouse up (end of dragging)
    const handleMouseUp = () =>
    {
        isDraggingRef.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // YouTube player options
    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 0, // Never auto-play
            controls: 0,
            start: 0, // Always start from beginning unless explicitly set
        },
    };

    // Handle player ready
    const onReady = (event) =>
    {
        event.target.setVolume(volume);

        // Restore saved time position
        const savedTime = loadPlayerState();
        if (savedTime > 0)
        {
            event.target.seekTo(savedTime, true);
        }

        // Set video duration
        const getDuration = async () =>
        {
            try
            {
                const duration = await event.target.getDuration();
                setDuration(duration);
            } catch (error)
            {
                console.error('Error getting video duration:', error);
            }
        };
        getDuration();

        startProgressTracking();
    };

    // Function to start progress tracking
    const startProgressTracking = () =>
    {
        if (progressInterval.current)
        {
            clearInterval(progressInterval.current);
        }

        progressInterval.current = setInterval(() =>
        {
            if (playerRef.current && isPlaying)
            {
                try
                {
                    playerRef.current.internalPlayer.getCurrentTime().then(currentTime =>
                    {
                        setProgress(currentTime);
                        // Save progress every 5 seconds
                        if (Math.floor(currentTime) % 5 === 0)
                        {
                            savePlayerState(videoId, isPlaying, currentTime);
                        }
                    }).catch(error =>
                    {
                        console.error('Error getting current time:', error);
                    });
                } catch (error)
                {
                    console.error('Error accessing player:', error);
                }
            }
        }, 250);
    };

    // Handle player state change
    const onStateChange = (event) =>
    {
        // Video ended
        if (event.data === 0)
        {
            setIsPlaying(false);
            setProgress(0);
            clearInterval(progressInterval.current);
            savePlayerState(videoId, false, 0);
        }

        // Video is playing
        if (event.data === 1)
        {
            setIsPlaying(true);
            startProgressTracking();
        }

        // Video is paused
        if (event.data === 2)
        {
            setIsPlaying(false);
            savePlayerState(videoId, false, progress);
        }
    };

    // Get video title when video is loaded
    const fetchVideoTitle = async (videoId) =>
    {
        try
        {
            const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
            const data = await response.json();
            setVideoTitle(data.title);

            // Update recent tracks
            setRecentTracks(prev =>
            {
                const filteredTracks = prev.filter(track => track.id !== videoId);
                const trackToAdd = {
                    id: videoId,
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    title: data.title
                };
                const newTracks = [trackToAdd, ...filteredTracks].slice(0, 3);
                localStorage.setItem('recentTracks', JSON.stringify(newTracks));
                return newTracks;
            });
        } catch (error)
        {
            console.error('Error fetching video title:', error);
            setVideoTitle(`YouTube Video (${videoId})`);
        }
    };

    // Load saved tracks and player state on mount
    useEffect(() =>
    {
        const savedTracks = localStorage.getItem('recentTracks');
        if (savedTracks)
        {
            setRecentTracks(JSON.parse(savedTracks));
        }

        // Load player state
        loadPlayerState();
    }, []);

    // Effect to fetch video title when videoId changes
    useEffect(() =>
    {
        if (videoId)
        {
            fetchVideoTitle(videoId);
            setProgress(0);
            setDuration(0);
        }
    }, [videoId]);

    // Clean up intervals when component unmounts
    useEffect(() =>
    {
        return () =>
        {
            if (progressInterval.current)
            {
                clearInterval(progressInterval.current);
            }
            if (hideTimerRef.current)
            {
                clearTimeout(hideTimerRef.current);
            }
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Restart progress tracking if isPlaying changes
    useEffect(() =>
    {
        if (isPlaying)
        {
            startProgressTracking();
        }
    }, [isPlaying]);

    return (
        <div className="fixed bottom-50 right-50 z-[100]">
            {/* Music Icon */}
            <button
                className="fixed bottom-5 right-5 w-15 h-15 rounded-full bg-[var(--main-color)] text-white text-2xl flex items-center justify-center cursor-pointer border-none z-[101] shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label="Show music player"
            >
                ♫
            </button>

            {/* Bridge element to help mouse transition */}
            <div
                className={`fixed bottom-[60px] right-5 w-10 h-[50px] z-[100] opacity-0 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
                onMouseEnter={handleMouseEnter}
            />

            {/* Main Player */}
            <div
                ref={containerRef}
                className={`fixed bottom-[70px] right-5 w-[350px] bg-[var(--background)] rounded-xl border border-[var(--border-color)] text-[var(--text-color)] z-[100] p-0 transition-all duration-300 shadow-lg ${!isVisible ? 'opacity-0 translate-y-5 pointer-events-none' : 'opacity-100 translate-y-0'
                    } max-md:w-full max-md:right-0 max-md:bottom-0 max-md:rounded-none`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Player Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--border-color)] bg-[var(--background)] rounded-t-xl max-md:rounded-none">
                    <div className="flex items-center gap-2">
                        <span className="text-lg text-[var(--main-color)]">♫</span>
                        <h3 className="m-0 text-xl font-semibold">Chilling...</h3>
                    </div>
                </div>

                {/* Player Content */}
                <div className="flex flex-col p-4 gap-4">
                    {/* URL Form */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={url}
                            onChange={handleUrlChange}
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

                    {/* Now Playing */}
                    {videoTitle && (
                        <div className="py-4 w-full overflow-hidden">
                            <div className="flex items-center gap-1 w-full overflow-hidden">
                                <div className="text-xl whitespace-nowrap overflow-hidden text-ellipsis w-full relative">
                                    <div className="inline-block w-full overflow-hidden">
                                        <span className={`inline-block whitespace-nowrap pr-12 ${videoTitle.length > 30 ? 'animate-scroll' : ''}`}>
                                            {videoTitle}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="w-full flex flex-col gap-1">
                        <div
                            className="w-full h-1.5 bg-[var(--border-color)] rounded-full relative cursor-pointer overflow-hidden hover:h-2 transition-all duration-200"
                            ref={progressBarRef}
                            onClick={handleProgressBarClick}
                            onMouseDown={handleMouseDown}
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

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={togglePlay}
                            className="w-9 h-9 rounded-full border-none bg-[var(--main-color)] text-white cursor-pointer text-sm flex items-center justify-center transition-transform duration-200 hover:scale-110"
                        >
                            {isPlaying ? "⏸" : "▶"}
                        </button>

                        <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm w-4">
                                {volume < 10 ? "🔈" : volume < 50 ? "🔉" : "🔊"}
                            </span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="flex-1 h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>

                    {/* Recent Tracks */}
                    {recentTracks.length > 0 && (
                        <div className="border-t border-[var(--border-color)] pt-2 mt-1 relative overflow-hidden">
                            <h4 className="text-sm m-0 mb-2">Recent Tracks</h4>
                            <ul className="list-none m-0 p-0 flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-1">
                                {recentTracks.map((track) => (
                                    <li
                                        key={track.id}
                                        onClick={() =>
                                        {
                                            setVideoId(track.id);
                                            setUrl(track.url);
                                            setIsPlaying(true);
                                            savePlayerState(track.id, true);
                                        }}
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
                    )}
                </div>

                {/* Hidden YouTube Player */}
                {videoId && (
                    <YouTube
                        videoId={videoId}
                        opts={opts}
                        onReady={onReady}
                        onStateChange={onStateChange}
                        ref={playerRef}
                        className="hidden"
                    />
                )}
            </div>

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
                    0% { transform: translateX(0); }
                    10% { transform: translateX(0); }
                    60% { transform: translateX(calc(-100% + 200px)); }
                    90% { transform: translateX(0); }
                    100% { transform: translateX(0); }
                }
                
                .animate-scroll {
                    animation: scroll 15s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default MusicPlayer;
