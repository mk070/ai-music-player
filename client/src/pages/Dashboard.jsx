import React, { useState, useEffect, useRef } from 'react';
import { Music, Home, Folder, User, Heart, Star, Settings, Search, Bell, Play, Pause, SkipForward, SkipBack, Volume2, List, MoreHorizontal } from 'lucide-react';
import { dashboardApi } from '../utils/api';

// Simulate importing GSAP and Lenis
const gsapSimulated = {
  registerPlugin: () => {},
  to: (target, options) => {},
  fromTo: (target, fromVars, toVars) => {},
  timeline: () => ({ to: () => ({}) }),
};

const ScrollTriggerSimulated = {
  create: () => {},
};

// Loading skeleton component
const LoadingSkeleton = ({ count = 1, isArtist = false }) => {
  return Array(count).fill(0).map((_, index) => (
    <div key={index} className="animate-pulse">
      <div className="flex items-center">
        {isArtist ? (
          <div className="w-14 h-14 rounded-full bg-gray-700 mr-4"></div>
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded-md mr-4"></div>
        )}
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  ));
};

// Main App Component
const ReverBeatApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('3:47');
  const [progress, setProgress] = useState(30);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Welcome To Horrorwood',
    artist: 'Ice Nine Kills',
    cover: '/api/placeholder/64/64',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const appRef = useRef(null);
  
  // State for storing API data
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentFavorites, setRecentFavorites] = useState([]);
  const [loading, setLoading] = useState({
    trending: true,
    artists: true,
    favorites: true,
  });
  const [error, setError] = useState({
    trending: null,
    artists: null,
    favorites: null,
  });

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch trending songs
        const trendingResponse = await dashboardApi.getTrendingSongs();
        setTrendingSongs(trendingResponse.data);
        setLoading(prev => ({ ...prev, trending: false }));
      } catch (err) {
        setError(prev => ({ ...prev, trending: 'Failed to load trending songs' }));
        setLoading(prev => ({ ...prev, trending: false }));
      }

      try {
        // Fetch top artists
        const artistsResponse = await dashboardApi.getTopArtists();
        setTopArtists(artistsResponse.data);
        setLoading(prev => ({ ...prev, artists: false }));
      } catch (err) {
        setError(prev => ({ ...prev, artists: 'Failed to load top artists' }));
        setLoading(prev => ({ ...prev, artists: false }));
      }

      try {
        // Fetch recent favorites
        const favoritesResponse = await dashboardApi.getRecentFavorites();
        setRecentFavorites(favoritesResponse.data);
        setLoading(prev => ({ ...prev, favorites: false }));
      } catch (err) {
        setError(prev => ({ ...prev, favorites: 'Failed to load recent favorites' }));
        setLoading(prev => ({ ...prev, favorites: false }));
      }
      try {
        // Fetch all data in parallel
        const [trendingRes, artistsRes, favoritesRes] = await Promise.allSettled([
          dashboardApi.getTrendingSongs(),
          dashboardApi.getTopArtists(),
          dashboardApi.getRecentFavorites(),
        ]);

        // Handle trending songs response
        if (trendingRes.status === 'fulfilled') {
          setTrendingSongs(trendingRes.value.data);
        } else {
          setError(prev => ({ ...prev, trending: 'Failed to load trending songs' }));
          console.error('Error fetching trending songs:', trendingRes.reason);
        }

        // Handle top artists response
        if (artistsRes.status === 'fulfilled') {
          setTopArtists(artistsRes.value.data);
        } else {
          setError(prev => ({ ...prev, artists: 'Failed to load top artists' }));
          console.error('Error fetching top artists:', artistsRes.reason);
        }

        // Handle recent favorites response
        if (favoritesRes.status === 'fulfilled') {
          setRecentFavorites(favoritesRes.value.data);
        } else {
          setError(prev => ({ ...prev, favorites: 'Failed to load recent favorites' }));
          console.error('Error fetching recent favorites:', favoritesRes.reason);
        }
      } catch (err) {
        console.error('Error in dashboard data fetch:', err);
        setError({
          trending: 'Failed to load data',
          artists: 'Failed to load data',
          favorites: 'Failed to load data',
        });
      } finally {
        setLoading({
          trending: false,
          artists: false,
          favorites: false,
        });
      }
    };

    fetchDashboardData();
  }, []);
  
  // Simulate GSAP animations on load
  useEffect(() => {
    // Mark as loaded to trigger animations
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    // Simulate GSAP initialization
    if (appRef.current) {
      // Animation would go here in a real implementation
    }
  }, []);
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Handle progress bar click
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const newProgress = (clickPosition / progressBarWidth) * 100;
    setProgress(Math.min(100, Math.max(0, newProgress)));
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-white">
      {/* Main content */}
      <div className="pb-24">
        {/* Hero Banner */}
        <div className="px-4 sm:px-6 lg:px-8 mb-10 w-full">
          <div className="w-full max-w-full h-56 rounded-2xl overflow-hidden relative">
            <img 
              src="/api/placeholder/1000/400" 
              alt="R&B Now" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07070d]/70 to-transparent flex items-center">
              <div className="pl-10">
                <h2 className="text-6xl font-bold text-[#3c3abe]">R&B NOW</h2>
              </div>
            </div>
            <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#07070d]/50 flex items-center justify-center">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
        
        {/* Trending section */}
        <div className="px-8 mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#fcfcff]">Trending right now</h2>
            <button className="text-sm text-[#3c3abe]">See all</button>
          </div>
          
          <div className="space-y-4">
            {loading.trending ? (
              <LoadingSkeleton count={5} />
            ) : error.trending ? (
              <div className="text-red-400">{error.trending}</div>
            ) : (
              trendingSongs.map((song) => (
                <div key={song.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 text-sm opacity-50 mr-4">
                      {song.id < 10 ? `0${song.id}` : song.id}
                    </div>
                    <div className="w-12 h-12 rounded overflow-hidden mr-4">
                      <img 
                        src={song.cover} 
                        alt={song.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#fcfcff]">{song.title}</h3>
                      <p className="text-sm opacity-70">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm opacity-70 mr-12">{song.duration}</span>
                    <button className="mr-8">
                      <Heart size={18} />
                    </button>
                    <button>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Two Column Layout */}
        <div className="px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Left Column */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#fcfcff]">Recently played</h2>
              <button className="text-sm text-[#3c3abe]">See all</button>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-full">
                {loading.favorites ? (
                  <div className="col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                      {Array(3).fill(0).map((_, idx) => (
                        <div key={`favorite-skeleton-${idx}`} className="bg-[#3a3a43]/20 rounded-xl overflow-hidden">
                          <div className="h-40 bg-gray-700"></div>
                          <div className="p-4">
                            <div className="w-3/4 h-4 bg-gray-700 rounded mb-2"></div>
                            <div className="w-full h-3 bg-gray-700 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : error.favorites ? (
                  <div className="col-span-3 text-red-400">{error.favorites}</div>
                ) : (
                  recentFavorites.map((item) => (
                    <div key={item.id} className="bg-[#3a3a43]/20 rounded-xl overflow-hidden hover:bg-[#3a3a43]/30 transition-colors cursor-pointer group">
                      <div className="h-40 relative overflow-hidden">
                        <img 
                          src={item.cover} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07070d]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="w-12 h-12 bg-[#3c3abe] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                            <Play size={20} className="text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-[#fcfcff]">{item.title}</h3>
                        <p className="text-sm mt-1 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#fcfcff]">Top Artist</h2>
              <button className="text-sm text-[#3c3abe]">See all</button>
            </div>
            
            <div className="space-y-6">
              {loading.artists ? (
                <LoadingSkeleton count={3} isArtist={true} />
              ) : error.artists ? (
                <div className="text-red-400">{error.artists}</div>
              ) : (
                topArtists.map((artist) => (
                  <div key={artist.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                        <img 
                          src={artist.cover} 
                          alt={artist.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#fcfcff]">{artist.name}</h3>
                        <p className="text-sm opacity-70">{artist.followers} Followers</p>
                      </div>
                    </div>
                    <button>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {/* Recent favorites section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-[#fcfcff] mb-6">Recent favorites</h2>
              <div className="space-y-4">
                {loading.favorites ? (
                  <LoadingSkeleton count={3} />
                ) : error.favorites ? (
                  <div className="text-red-400">{error.favorites}</div>
                ) : (
                  recentFavorites.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-[#3a3a43]/20 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded overflow-hidden">
                        <img 
                          src={item.cover} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#fcfcff] truncate">{item.title}</h3>
                        <p className="text-sm opacity-70 truncate">{item.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Player Bar */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#0f0f16] border-t border-[#1e1e27] px-6 flex items-center">
          <div className="flex items-center w-1/4">
            <div className="w-12 h-12 rounded overflow-hidden mr-4">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h4 className="font-medium text-[#fcfcff]">{currentTrack.title}</h4>
              <p className="text-sm opacity-70">{currentTrack.artist}</p>
            </div>
            <button className="ml-6 text-[#3c3abe]">
              <Heart size={18} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center space-x-6 mb-2">
              <button className="text-[#c4c4c4] hover:text-white">
                <SkipBack size={20} />
              </button>
              <button 
                className="w-10 h-10 rounded-full bg-[#3c3abe] flex items-center justify-center text-white"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </button>
              <button className="text-[#c4c4c4] hover:text-white">
                <SkipForward size={20} />
              </button>
            </div>
            <div className="w-full flex items-center space-x-3">
              <span className="text-xs opacity-50 w-10 text-right">{currentTime}</span>
              <div 
                className="h-1 bg-[#3a3a43] rounded-full flex-1 relative group"
                onClick={handleProgressClick}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-[#3c3abe] rounded-full" 
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 -top-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <span className="text-xs opacity-50 w-10">{totalTime}</span>
            </div>
          </div>
          
          <div className="w-1/4 flex items-center justify-end space-x-4">
            <button className="text-[#c4c4c4] hover:text-white">
              <Volume2 size={18} />
            </button>
            <div className="w-24 h-1 bg-[#3a3a43] rounded-full">
              <div className="h-full bg-[#3c3abe] rounded-full w-3/4"></div>
            </div>
            <button className="text-[#c4c4c4] hover:text-white">
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverBeatApp;