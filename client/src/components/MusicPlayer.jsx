import React, { useRef, useEffect, useState } from 'react';
import { 
  SkipForward, SkipBack, Shuffle, Repeat, 
  Plus, Mic2, Download, List, Laptop2, Volume2, VolumeXIcon,
  Maximize2, PauseIcon, PlayIcon
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const MusicPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    volume,
    togglePlay, 
    nextSong, 
    prevSong, 
    setVolume,
    setProgress
  } = useMusicPlayer();
  
  const [showVolume, setShowVolume] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const previousVolume = useRef(volume);

  // Format time in MM:SS format
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressChange = (e) => {
    const progressBar = progressBarRef.current;
    const boundingRect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - boundingRect.left;
    const progressBarWidth = boundingRect.width;
    const percentage = clickPosition / progressBarWidth;
    const newTime = percentage * currentSong?.duration;
    setProgress(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const volumeBar = volumeBarRef.current;
    const boundingRect = volumeBar.getBoundingClientRect();
    const clickPosition = e.clientX - boundingRect.left;
    const volumeBarWidth = boundingRect.width;
    const newVolume = Math.max(0, Math.min(1, clickPosition / volumeBarWidth));
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume.current);
      setIsMuted(false);
    } else {
      previousVolume.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm h-[80px] flex items-center px-4 border-t border-zinc-900 z-50">
      {/* Left section - Song info */}
      <div className="flex items-center w-1/4">
        <div className="h-14 w-14 mr-3 overflow-hidden">
          <img 
            src={currentSong?.coverUrl || '/default-cover.jpg'} 
            alt={currentSong?.title || 'Song cover'} 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mr-4">
          <h3 className="text-white font-medium text-sm">{currentSong?.title || 'No song playing'}</h3>
          <p className="text-zinc-400 text-xs">{currentSong?.artist || 'Unknown artist'}</p>
        </div>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Plus size={20} />
        </button>
      </div>

      {/* Center section - Controls and progress */}
      <div className="flex flex-col items-center justify-center w-2/4">
        {/* Control buttons */}
        <div className="flex items-center justify-center mb-2">
          <button className="text-zinc-400 hover:text-white mx-4 transition-colors">
            <Shuffle size={18} />
          </button>
          <button 
            className="text-zinc-400 hover:text-white mx-4 transition-colors"
            onClick={prevSong}
          >
            <SkipBack size={22} />
          </button>
          <button 
            className="text-white mx-4"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <PauseIcon size={36} fill="white" strokeWidth={1} />
            ) : (
              <PlayIcon size={36} fill="none" strokeWidth={1} />
            )}
          </button>
          <button 
            className="text-zinc-400 hover:text-white mx-4 transition-colors"
            onClick={nextSong}
          >
            <SkipForward size={22} />
          </button>
          <button className="text-zinc-400 hover:text-white mx-4 transition-colors">
            <Repeat size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full flex items-center">
          <span className="text-xs text-zinc-400 mr-2">
            {formatTime(progress)}
          </span>
          <div 
            ref={progressBarRef}
            className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleProgressChange}
          >
            <div 
              className="h-full bg-white group-hover:bg-green-500 transition-colors"
              style={{ width: `${(progress / (currentSong?.duration || 1)) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-zinc-400 ml-2">
            {formatTime(currentSong?.duration || 0)}
          </span>
        </div>
      </div>

      {/* Right section - Volume and additional controls */}
      <div className="flex items-center justify-end w-1/4">
        <button className="text-green-500 hover:text-green-400 mx-2 transition-colors">
          <Mic2 size={18} />
        </button>
        <button className="text-zinc-400 hover:text-white mx-2 transition-colors">
          <Download size={18} />
        </button>
        <button className="text-zinc-400 hover:text-white mx-2 transition-colors">
          <List size={18} />
        </button>
        <button className="text-zinc-400 hover:text-white mx-2 transition-colors">
          <Laptop2 size={18} />
        </button>
        
        {/* Volume control */}
        <div className="relative ml-2 flex items-center">
          <button 
            className="text-zinc-400 hover:text-white mx-2 transition-colors"
            onClick={toggleMute}
            onMouseEnter={() => setShowVolume(true)}
          >
            {isMuted || volume === 0 ? <VolumeXIcon size={18} /> : <Volume2 size={18} />}
          </button>
          
          {/* Volume slider */}
          <div 
            className={`w-24 h-1 bg-zinc-700 rounded-full overflow-hidden cursor-pointer ${showVolume ? 'opacity-100' : 'opacity-100'} transition-opacity`}
            ref={volumeBarRef}
            onClick={handleVolumeChange}
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <div 
              className="h-full bg-white hover:bg-green-500 transition-colors"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
        
        <button className="text-zinc-400 hover:text-white ml-4 transition-colors">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;