import React, { useState, useRef, useEffect } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import SongCard from '../components/SongCard';
import { Music, Plus, Save, X } from 'lucide-react';
import gsap from 'gsap';

const PlaylistBuilder = () => {
  const { songs } = useMusicPlayer();
  const [playlistName, setPlaylistName] = useState('');
  const [playlistMood, setPlaylistMood] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const loadingRef = useRef(null);
  const resultsRef = useRef(null);
  
  const handleAddSong = (song) => {
    setSelectedSongs(prev => {
      if (prev.find(s => s.id === song.id)) {
        return prev.filter(s => s.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  };
  
  const handleGenerate = (e) => {
    e.preventDefault();
    
    if (!playlistName || !playlistMood) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      const randomSongs = [...songs].sort(() => 0.5 - Math.random()).slice(0, 3);
      setSelectedSongs(randomSongs);
      
      // Show results
      if (resultsRef.current) {
        gsap.from(resultsRef.current.children, {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    }, 2000);
  };
  
  const handleSave = () => {
    setIsSuccess(true);
    
    // Reset after showing success
    setTimeout(() => {
      setIsSuccess(false);
      setPlaylistName('');
      setPlaylistMood('');
      setSelectedSongs([]);
    }, 2000);
  };
  
  useEffect(() => {
    if (containerRef.current && formRef.current) {
      // Animate the form entrance
      gsap.from(formRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, []);
  
  return (
    <div ref={containerRef} className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content mb-2">Create a New Playlist</h1>
        <p className="text-text-light">Build your perfect summer playlist with AI assistance</p>
      </div>
      
      {isSuccess ? (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-content mb-2">Playlist Saved!</h2>
          <p className="text-text-light">Your playlist "{playlistName}" has been created successfully.</p>
        </div>
      ) : (
        <>
          <form ref={formRef} onSubmit={handleGenerate} className="bg-navy-dark rounded-lg p-6 mb-8">
            <div className="mb-6">
              <label htmlFor="playlistName" className="block text-sm font-medium text-text-light mb-2">
                Playlist Name
              </label>
              <input
                type="text"
                id="playlistName"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="input-field"
                placeholder="Summer Vibes 2025"
                required
                aria-label="Playlist name"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="playlistMood" className="block text-sm font-medium text-text-light mb-2">
                Mood / Theme
              </label>
              <input
                type="text"
                id="playlistMood"
                value={playlistMood}
                onChange={(e) => setPlaylistMood(e.target.value)}
                className="input-field"
                placeholder="Chill beach sunset, energetic road trip, etc."
                required
                aria-label="Playlist mood or theme"
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="btn btn-primary py-2 px-4 flex items-center"
                disabled={isGenerating}
                aria-label="Generate playlist"
              >
                <Music size={18} className="mr-2" />
                <span>Generate Playlist</span>
              </button>
            </div>
          </form>
          
          {isGenerating ? (
            <div ref={loadingRef} className="text-center py-20">
              <div className="inline-block animate-spin-slow mb-4">
                <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="#2d2e37" strokeWidth="10" />
                  <path d="M50 5C29.5 5 13 21.5 13 42" stroke="#3c3abe" strokeWidth="10" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-text-light">Curating your perfect playlist...</p>
            </div>
          ) : selectedSongs.length > 0 ? (
            <div ref={resultsRef}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-content">Generated Recommendations</h2>
                <button
                  onClick={handleSave}
                  className="btn btn-primary py-2 px-4 flex items-center"
                  aria-label="Save playlist"
                >
                  <Save size={18} className="mr-2" />
                  <span>Save Playlist</span>
                </button>
              </div>
              
              <div className="space-y-2 mb-8">
                {selectedSongs.map((song, index) => (
                  <div key={song.id} className="flex items-center">
                    <SongCard song={song} index={index + 1} compact={true} />
                    <button
                      onClick={() => handleAddSong(song)}
                      className="ml-2 text-text-light hover:text-red-400 transition-colors"
                      aria-label="Remove from playlist"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-content mb-4">Add More Songs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {songs
                    .filter(song => !selectedSongs.find(s => s.id === song.id))
                    .slice(0, 3)
                    .map(song => (
                      <div key={song.id} className="relative group">
                        <SongCard song={song} />
                        <button
                          onClick={() => handleAddSong(song)}
                          className="absolute top-2 right-2 bg-navy-dark/70 hover:bg-accent p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Add to playlist"
                        >
                          <Plus size={16} className="text-content" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default PlaylistBuilder;