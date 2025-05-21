import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import gsap from 'gsap';

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
  
  const vinylRef = useRef(null);
  const waveformRef = useRef(null);

  useEffect(() => {
    if (vinylRef.current) {
      if (isPlaying) {
        gsap.to(vinylRef.current, {
          rotation: '+=360',
          repeat: -1,
          duration: 10,
          ease: 'linear'
        });
      } else {
        gsap.killTweensOf(vinylRef.current);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (waveformRef.current && isPlaying) {
      const bars = waveformRef.current.querySelectorAll('.waveform-bar');
      
      bars.forEach((bar) => {
        const randomHeight = Math.random() * 100;
        gsap.to(bar, {
          height: `${randomHeight}%`,
          duration: 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 0.5
        });
      });
    } else if (waveformRef.current) {
      const bars = waveformRef.current.querySelectorAll('.waveform-bar');
      bars.forEach((bar) => {
        gsap.killTweensOf(bar);
      });
    }
  }, [isPlaying, currentSong]);

  const handleProgressChange = (e) => {
    setProgress(parseInt(e.target.value));
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  if (!currentSong) return null;

  return (
    <div className="p-4 px-6">
      <div className="flex items-center">
        <div className="hidden md:block relative flex-shrink-0">
          <div ref={vinylRef} className="vinyl-disc h-16 w-16 mr-4">
            <img 
              src={currentSong.cover} 
              alt={`Album art for ${currentSong.title}`}
              className="h-full w-full object-cover opacity-70"
            />
          </div>
        </div>
      
        <div className="flex flex-col flex-grow md:flex-grow-0 md:w-48 mr-4">
          <span className="text-content font-medium truncate">{currentSong.title}</span>
          <span className="text-text-dark text-sm truncate">{currentSong.artist}</span>
        </div>
      
        <div className="hidden md:flex flex-grow items-center mx-4">
          <div ref={waveformRef} className="w-full flex items-end justify-between h-12">
            {Array(20).fill().map((_, index) => (
              <div 
                key={index} 
                className="waveform-bar w-1 bg-accent mx-0.5 rounded-t"
                style={{ height: isPlaying ? `${Math.random() * 100}%` : '10%' }}
              ></div>
            ))}
          </div>
        </div>
      
        <div className="flex-shrink-0">
          <div className="music-controls flex items-center">
            <button 
              className="focus:outline-none" 
              onClick={prevSong}
              aria-label="Previous song"
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              className="focus:outline-none mx-2 bg-accent hover:bg-accent-light rounded-full p-2 text-content"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button 
              className="focus:outline-none" 
              onClick={nextSong}
              aria-label="Next song"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      
        <div className="hidden lg:flex items-center ml-8">
          <button className="focus:outline-none">
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 ml-2"
            aria-label="Volume control"
          />
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-text-dark">
          <span>{formatTime(progress)}</span>
          <span>{currentSong.duration}</span>
        </div>
        <div className="mt-1">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full"
            aria-label="Progress bar"
          />
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds) {
  const minutes = Math.floor((seconds * 3.29) / 60);
  const remainingSeconds = Math.floor((seconds * 3.29) % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default MusicPlayer;