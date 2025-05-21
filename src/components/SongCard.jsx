import React from 'react';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const SongCard = ({ song, index, compact = false }) => {
  const { playSong, currentSong, isPlaying, pauseSong, resumeSong } = useMusicPlayer();
  
  const isCurrentSong = currentSong && currentSong.id === song.id;
  
  const handlePlayClick = () => {
    if (isCurrentSong) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song);
    }
  };
  
  if (compact) {
    return (
      <div className="flex items-center p-2 hover:bg-navy-light rounded-lg transition-colors duration-200 group">
        <div className="w-8 text-center text-text mr-4">
          {index < 10 ? `0${index}` : index}
        </div>
        <div className="h-12 w-12 mr-4 relative">
          <img src={song.cover} alt={song.title} className="w-full h-full object-cover rounded" />
          <button 
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100 transition-opacity ${isCurrentSong && isPlaying ? 'opacity-100' : ''}`}
            onClick={handlePlayClick}
            aria-label={isCurrentSong && isPlaying ? "Pause" : "Play"}
          >
            <Play size={20} className="text-white" fill="white" />
          </button>
        </div>
        <div className="flex-1">
          <h3 className="text-content font-medium truncate">{song.title}</h3>
          <p className="text-text-dark text-sm truncate">{song.artist}</p>
        </div>
        <div className="text-text-dark mx-4">{song.duration}</div>
        <button className="text-text-dark hover:text-text-light p-1" aria-label="Like song">
          <Heart size={16} />
        </button>
        <button className="text-text-dark hover:text-text-light p-1" aria-label="More options">
          <MoreHorizontal size={16} />
        </button>
      </div>
    );
  }
  
  return (
    <div className="card overflow-hidden group transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        <img 
          src={song.cover} 
          alt={song.title} 
          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={handlePlayClick}
            className="rounded-full bg-accent hover:bg-accent-light p-3 transform transition-transform duration-300 scale-90 group-hover:scale-100"
            aria-label={isCurrentSong && isPlaying ? "Pause" : "Play"}
          >
            <Play size={24} fill="white" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-navy">{song.title}</h3>
        <p className="text-navy-light text-sm">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCard;