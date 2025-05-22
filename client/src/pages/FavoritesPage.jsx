import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Download, Grid, List, Clock, Headphones, Sparkles, Music, Users, Calendar } from 'lucide-react';

const FavoritesPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState({
    songs: [
      {
        id: 1,
        title: "Midnight City",
        artist: "M83",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300",
        mood: "🌙 Dreamy",
        duration: "4:03",
        plays: 127
      },
      {
        id: 2,
        title: "Sunflower",
        artist: "Post Malone ft. Swae Lee",
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300",
        mood: "☀️ Summer",
        duration: "3:38",
        plays: 89
      },
      {
        id: 3,
        title: "Blinding Lights",
        artist: "The Weeknd",
        cover: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300",
        mood: "🔥 Hype",
        duration: "3:20",
        plays: 156
      }
    ],
    playlists: [
      {
        id: 1,
        name: "Summer Nights '23",
        cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
        songs: 24,
        duration: "1h 32m",
        mood: "🌅 Nostalgic"
      },
      {
        id: 2,
        name: "Late Night Drives",
        cover: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=300",
        songs: 18,
        duration: "1h 8m",
        mood: "🌃 Chill"
      }
    ],
    moments: [
      {
        id: 1,
        description: "You played this 37 times in July",
        song: "Golden Hour",
        artist: "Joji",
        emoji: "🌅",
        date: "July 2024"
      },
      {
        id: 2,
        description: "Your longest listening streak",
        playlist: "Rainy Day Vibes",
        emoji: "🌧️",
        streak: "12 days"
      }
    ]
  });

  const [counts, setCounts] = useState({ songs: 0, playlists: 0, total: 0 });
  const heroRef = useRef(null);
  const tabsRef = useRef(null);

  // Animate counts on mount
  useEffect(() => {
    const totalSongs = favorites.songs.length;
    const totalPlaylists = favorites.playlists.length;
    const total = totalSongs + totalPlaylists + favorites.moments.length;

    const animateCount = (target, duration = 1000) => {
      return new Promise(resolve => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            start = target;
            clearInterval(timer);
            resolve();
          }
          return Math.floor(start);
        }, 16);
      });
    };

    // Stagger the count animations
    setTimeout(() => setCounts(prev => ({ ...prev, songs: totalSongs })), 200);
    setTimeout(() => setCounts(prev => ({ ...prev, playlists: totalPlaylists })), 400);
    setTimeout(() => setCounts(prev => ({ ...prev, total: total })), 600);
  }, []);

  // Smooth scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const scrolled = window.scrollY > 300;
        tabsRef.current.style.transform = scrolled ? 'translateY(0)' : 'translateY(10px)';
        tabsRef.current.style.opacity = scrolled ? '0.95' : '1';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (type, id) => {
    // Animation for removing favorite
    const element = document.querySelector(`[data-item="${type}-${id}"]`);
    if (element) {
      element.style.transform = 'scale(0.95)';
      element.style.opacity = '0.7';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
      }, 150);
    }
  };

  const filterContent = () => {
    switch (activeTab) {
      case 'Songs':
        return { songs: favorites.songs, playlists: [], moments: [] };
      case 'Playlists':
        return { songs: [], playlists: favorites.playlists, moments: [] };
      case 'Moments':
        return { songs: [], playlists: [], moments: favorites.moments };
      default:
        return favorites;
    }
  };

  const filteredContent = filterContent();

  return (
    <div className="min-h-screen font-sans bg-[#07070d] text-[#c4c4c4] font-['Rubik']">
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative overflow-hidden pt-20 pb-12 px-6"
        style={{
          background: `linear-gradient(135deg, 
            rgba(60, 58, 190, 0.1) 0%, 
            rgba(45, 46, 55, 0.9) 50%, 
            rgba(60, 58, 190, 0.05) 100%),
            url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200') center/cover`
        }}
      >
        <div className="absolute inset-0 bg-[#07070d]/80 backdrop-blur-sm"></div>
        
        {/* Animated SVG Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <path
              d="M0,400 Q300,200 600,400 T1200,400"
              stroke="#3c3abe"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M0,450 Q400,250 800,450 T1200,450"
              stroke="#3c3abe"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
              className="animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="transform transition-all duration-1000 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold font-sans text-[#fcfcff] mb-4 tracking-tight">
              Your Favorite Sounds
            </h1>
            <p className="text-xl md:text-2xl text-[#c4c4c4] mb-8 italic">
              "These tracks made you feel something."
            </p>
            
            {/* Dynamic Stats */}
            <div className="flex justify-center items-center space-x-8 text-[#fcfcff]">
              <div className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-[#3c3abe]" />
                <span className="text-2xl font-bold">{counts.total}</span>
                <span className="text-sm opacity-70">favorites</span>
              </div>
              <div className="w-px h-6 bg-[#3c3abe] opacity-50"></div>
              <div className="flex items-center space-x-2">
                <Headphones className="w-5 h-5 text-[#3c3abe]" />
                <span className="text-2xl font-bold">{counts.songs}</span>
                <span className="text-sm opacity-70">songs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#3c3abe]" />
                <span className="text-2xl font-bold">{counts.playlists}</span>
                <span className="text-sm opacity-70">playlists</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Filter Tabs */}
      <div 
        ref={tabsRef}
        className="sticky top-0 z-40 bg-[#07070d]/95 backdrop-blur-md border-b border-[#3c3abe]/20 transition-all duration-300"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-[#fcfcff]/5 rounded-full p-1">
              {['All', 'Songs', 'Playlists', 'Moments'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-[#3c3abe] text-[#fcfcff] shadow-lg shadow-[#3c3abe]/30'
                      : 'text-[#c4c4c4] hover:text-[#fcfcff] hover:bg-[#fcfcff]/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex bg-[#fcfcff]/5 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'grid' ? 'bg-[#3c3abe] text-[#fcfcff]' : 'text-[#c4c4c4] hover:text-[#fcfcff]'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'list' ? 'bg-[#3c3abe] text-[#fcfcff]' : 'text-[#c4c4c4] hover:text-[#fcfcff]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-[#3c3abe]/20 border border-[#3c3abe] rounded-full text-[#3c3abe] hover:bg-[#3c3abe] hover:text-[#fcfcff] transition-all duration-300">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Songs Section */}
            {filteredContent.songs.length > 0 && (
              <div className="mb-12">
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                  {filteredContent.songs.map((song, index) => (
                    <div
                      key={song.id}
                      data-item={`song-${song.id}`}
                      className={`group relative bg-[#fcfcff]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#fcfcff]/10 hover:border-[#3c3abe]/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#3c3abe]/20 ${
                        viewMode === 'list' ? 'flex items-center space-x-4' : ''
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Cover Art */}
                      <div className={`relative ${viewMode === 'list' ? 'w-16 h-16 flex-shrink-0' : 'w-full h-48 mb-4'} rounded-xl overflow-hidden`}>
                        <img
                          src={song.cover}
                          alt={song.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07070d]/60 to-transparent"></div>
                        
                        {/* Play Button Overlay */}
                        <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#07070d]/50 backdrop-blur-sm">
                          <div className="w-12 h-12 bg-[#3c3abe] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-[#fcfcff] ml-1" />
                          </div>
                        </button>
                      </div>

                      {/* Song Info */}
                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-[#fcfcff] font-semibold text-lg mb-1 group-hover:text-[#3c3abe] transition-colors">
                              {song.title}
                            </h3>
                            <p className="text-[#c4c4c4] text-sm">{song.artist}</p>
                          </div>
                          <button
                            onClick={() => toggleFavorite('song', song.id)}
                            className="text-[#3c3abe] hover:scale-125 transition-transform"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-[#3c3abe]/20 text-[#3c3abe] px-3 py-1 rounded-full border border-[#3c3abe]/30">
                            {song.mood}
                          </span>
                          <div className="flex items-center space-x-4 text-xs text-[#c4c4c4]">
                            <span>{song.duration}</span>
                            <span className="flex items-center space-x-1">
                              <Headphones className="w-3 h-3" />
                              <span>{song.plays}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playlists Section */}
            {filteredContent.playlists.length > 0 && (
              <div className="mb-12">
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
                  {filteredContent.playlists.map((playlist, index) => (
                    <div
                      key={playlist.id}
                      data-item={`playlist-${playlist.id}`}
                      className={`group relative bg-[#fcfcff]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#fcfcff]/10 hover:border-[#3c3abe]/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#3c3abe]/20 ${
                        viewMode === 'list' ? 'flex items-center space-x-4' : ''
                      }`}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'w-20 h-20 flex-shrink-0' : 'w-full h-40 mb-4'} rounded-xl overflow-hidden`}>
                        <img
                          src={playlist.cover}
                          alt={playlist.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07070d]/60 to-transparent"></div>
                      </div>

                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-[#fcfcff] font-semibold text-lg mb-1 group-hover:text-[#3c3abe] transition-colors">
                              {playlist.name}
                            </h3>
                            <p className="text-[#c4c4c4] text-sm">{playlist.songs} songs • {playlist.duration}</p>
                          </div>
                          <button
                            onClick={() => toggleFavorite('playlist', playlist.id)}
                            className="text-[#3c3abe] hover:scale-125 transition-transform"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-[#3c3abe]/20 text-[#3c3abe] px-3 py-1 rounded-full border border-[#3c3abe]/30">
                            {playlist.mood}
                          </span>
                          <button className="text-xs bg-[#3c3abe] text-[#fcfcff] px-4 py-2 rounded-full hover:bg-[#3c3abe]/80 transition-colors">
                            View Playlist
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Moments Section */}
            {filteredContent.moments.length > 0 && (
              <div className="mb-12">
                <div className="space-y-4">
                  {filteredContent.moments.map((moment, index) => (
                    <div
                      key={moment.id}
                      className="group bg-[#fcfcff]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#fcfcff]/10 hover:border-[#3c3abe]/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#3c3abe]/20"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-[#3c3abe]/20 rounded-full flex items-center justify-center text-2xl border border-[#3c3abe]/30">
                          {moment.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="text-[#fcfcff] font-medium mb-1">{moment.description}</p>
                          <p className="text-[#c4c4c4] text-sm">
                            {moment.song && `${moment.song} by ${moment.artist}`}
                            {moment.playlist && moment.playlist}
                            {moment.streak && ` • ${moment.streak}`}
                            {moment.date && ` • ${moment.date}`}
                          </p>
                        </div>
                        <button className="text-[#3c3abe] hover:text-[#fcfcff] hover:bg-[#3c3abe] p-2 rounded-full transition-all duration-300">
                          <Sparkles className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Top Memories */}
          <div className="hidden lg:block w-80">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-[#3c3abe]/10 to-[#fcfcff]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#3c3abe]/30">
                <h3 className="text-[#fcfcff] font-bold text-xl mb-6 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#3c3abe]" />
                  <span>Top Memories</span>
                </h3>

                <div className="space-y-4">
                  <div className="bg-[#fcfcff]/5 rounded-xl p-4 border border-[#fcfcff]/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xs">🏆</div>
                      <span className="text-[#fcfcff] font-medium text-sm">Most Loved</span>
                    </div>
                    <p className="text-[#c4c4c4] text-sm">Blinding Lights • 156 plays</p>
                  </div>

                  <div className="bg-[#fcfcff]/5 rounded-xl p-4 border border-[#fcfcff]/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-xs">🔥</div>
                      <span className="text-[#fcfcff] font-medium text-sm">Longest Streak</span>
                    </div>
                    <p className="text-[#c4c4c4] text-sm">Late Night Drives • 12 days</p>
                  </div>

                  <div className="bg-[#fcfcff]/5 rounded-xl p-4 border border-[#fcfcff]/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xs">💫</div>
                      <span className="text-[#fcfcff] font-medium text-sm">Most Emotional</span>
                    </div>
                    <p className="text-[#c4c4c4] text-sm">Midnight City • July memories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="border-t border-[#fcfcff]/10 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c4c4c4] text-lg italic opacity-70">
            "Sometimes all you need is one song to bring back a thousand memories."
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;