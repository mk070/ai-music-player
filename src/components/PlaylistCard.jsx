import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Play } from 'lucide-react';

const PlaylistCard = ({ playlist }) => {
  const { songs, playSong } = useMusicPlayer();
  
  const handlePlay = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      const firstSongId = playlist.songs[0];
      const songToPlay = songs.find(s => s.id === firstSongId);
      if (songToPlay) {
        playSong(songToPlay);
      }
    }
  };
  
  return (
    <div className="card overflow-hidden group transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        <img 
          src={playlist.cover} 
          alt={playlist.title} 
          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={handlePlay}
            className="rounded-full bg-accent hover:bg-accent-light p-3 transform transition-transform duration-300 scale-90 group-hover:scale-100"
            aria-label="Play playlist"
          >
            <Play size={24} fill="white" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-navy">{playlist.title}</h3>
        <p className="text-navy-light text-sm">{playlist.description}</p>
      </div>
    </div>
  );
};

export default PlaylistCard;