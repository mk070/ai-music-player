import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Download, 
  Share2, 
  Heart, 
  MoreHorizontal, 
  Edit3, 
  Trash2,
  Clock,
  ListMusic,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Song Row Component
const SongRow = ({ song, index, isPlaying, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group p-3 flex items-center gap-4 rounded-lg transition-colors ${
        isPlaying ? 'bg-[#3c3abe]/20' : isHovered ? 'bg-white/10' : 'hover:bg-white/5'
      }`}
    >
      {/* Number/Play Button */}
      <div className="w-8 flex justify-center">
        {isHovered || isPlaying ? (
          <button 
            onClick={() => onPlay(song.id)}
            className={`h-8 w-8 flex items-center justify-center rounded-full ${
              isPlaying ? 'bg-[#3c3abe] text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isPlaying ? (
              <span className="h-3 w-3 border-l-2 border-r-2 border-current"></span>
            ) : (
              <Play size={14} className="ml-0.5" />
            )}
          </button>
        ) : (
          <span className={`text-sm ${isPlaying ? 'text-[#3c3abe]' : 'text-gray-400'}`}>{index + 1}</span>
        )}
      </div>

      {/* Album Art */}
      <div className="h-10 w-10 bg-white/10 rounded flex-shrink-0 overflow-hidden">
        <img src={`/api/placeholder/40/40?${song.id}`} alt="Album art" className="w-full h-full object-cover" />
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium truncate ${isPlaying ? 'text-[#3c3abe]' : 'text-white'}`}>{song.title}</h4>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      </div>

      {/* AI Reason (if present) */}
      {song.reason && (
        <div className="hidden md:block">
          <div className="px-2 py-1 bg-[#3c3abe]/10 rounded text-xs text-[#3c3abe]">
            {song.reason}
          </div>
        </div>
      )}

      {/* Duration */}
      <div className="hidden md:block">
        <span className="text-sm text-gray-400">{formatDuration(song.duration)}</span>
      </div>

      {/* Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-gray-400 hover:text-white">
          <Heart size={18} />
        </button>
      </div>
    </motion.div>
  );
};

// Main Playlist View Page Component
const PlaylistViewPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState('Beach Sunset Vibes');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Example songs data
  const songs = [
    { id: 1, title: 'Summer Vibes', artist: 'Coastal Dreams', duration: 187, reason: 'Matches your summer theme' },
    { id: 2, title: 'Ocean Breeze', artist: 'Wave Runners', duration: 221, reason: 'Perfect for beach relaxation' },
    { id: 3, title: 'Sunset Glow', artist: 'Evening Sky', duration: 195, reason: 'Captures sunset feelings' },
    { id: 4, title: 'Sandy Shores', artist: 'Beachcomber', duration: 176, reason: 'Beach vibes with chill rhythm' },
    { id: 5, title: 'Tropical Paradise', artist: 'Island Beats', duration: 203, reason: 'Upbeat summer energy' },
  ];

  const totalDuration = songs.reduce((sum, song) => sum + song.duration, 0);
  const formatTotalDuration = () => {
    const minutes = Math.floor(totalDuration / 60);
    const seconds = totalDuration % 60;
    return `${minutes} min ${seconds} sec`;
  };

  const handlePlaySong = (songId) => {
    if (currentSongId === songId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSongId(songId);
      setIsPlaying(true);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setCurrentSongId(songs[0].id);
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <Link to="/playlists" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} />
        <span>Back to Playlists</span>
      </Link>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Playlist Cover & Info */}
        <div className="md:col-span-4">
          <div className="sticky top-20">
            {/* Cover Art */}
            <div className="w-full aspect-square bg-white/5 rounded-xl overflow-hidden mb-4">
              <img src="/api/placeholder/400/400" alt="Playlist cover" className="w-full h-full object-cover" />
            </div>

            {/* Playlist Info */}
            <div className="mb-6">
              {isEditing ? (
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  autoFocus
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-xl font-bold focus:outline-none focus:border-[#3c3abe] focus:ring-1 focus:ring-[#3c3abe]"
                />
              ) : (
                <div className="flex items-start">
                  <h1 className="text-xl font-bold text-white flex-1">{playlistName}</h1>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                <ListMusic size={14} />
                <span>{songs.length} songs</span>
                <span>•</span>
                <Clock size={14} />
                <span>{formatTotalDuration()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlayAll}
                className="flex items-center justify-center gap-2 py-2 bg-[#3c3abe] text-white rounded-lg hover:bg-[#3c3abe]/90 transition-colors"
              >
                <Play size={16} />
                <span>Play</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'bg-pink-600/20 text-pink-400 border border-pink-600/40' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </motion.button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <Download size={16} />
                <span>Download</span>
              </button>
              
              <button className="flex-1 py-2 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <Share2 size={16} />
                <span>Share</span>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  className="h-full aspect-square bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <MoreHorizontal size={16} />
                </button>

                {showActionsMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-[#07070d] border border-white/10 rounded-lg shadow-xl z-10"
                  >
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-white hover:bg-white/10 flex items-center gap-2">
                        <Edit3 size={14} />
                        <span>Edit Cover</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 flex items-center gap-2">
                        <Trash2 size={14} />
                        <span>Delete Playlist</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div className="md:col-span-8">
          <div className="bg-white/5 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-4 text-gray-400 text-sm">
              <div className="w-8 text-center">#</div>
              <div className="w-10"></div>
              <div className="flex-1">Title</div>
              <div className="hidden md:block flex-1">AI Reason</div>
              <div className="hidden md:block w-16 text-center">Duration</div>
              <div className="w-8"></div>
            </div>

            {/* Songs */}
            <div className="p-2">
              {songs.map((song, index) => (
                <SongRow 
                  key={song.id}
                  song={song}
                  index={index}
                  isPlaying={isPlaying && currentSongId === song.id}
                  onPlay={handlePlaySong}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistViewPage;