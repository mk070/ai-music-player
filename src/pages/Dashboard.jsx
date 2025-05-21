import React, { useState, useEffect, useRef } from 'react';
import { Music, Home, Folder, User, Heart, Star, Settings, Search, Bell, Play, Pause, SkipForward, SkipBack, Volume2, List, MoreHorizontal } from 'lucide-react';

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
  
  // Mock trending songs data
  const trendingSongs = [
    { id: 1, title: "I'm Good (Blue)", artist: "David Guetta & Bebe Rexha", duration: "03:29", plays: "8 078 651", cover: "/api/placeholder/60/60" },
    { id: 2, title: "Under the Influence", artist: "Chris Brown", duration: "03:04", plays: "2 341 221", cover: "/api/placeholder/60/60" },
    { id: 3, title: "Forget Me", artist: "Lewis Capaldi", duration: "03:24", plays: "2 212 882", cover: "/api/placeholder/60/60" },
    { id: 4, title: "Bad Habit", artist: "Steve Lacy", duration: "03:32", plays: "1 934 291", cover: "/api/placeholder/60/60" },
    { id: 5, title: "DON'T YOU WORRY", artist: "Black Eyed Peas, Shakira & David Guetta", duration: "03:42", plays: "1 956 239", cover: "/api/placeholder/60/60" },
  ];
  
  // Mock top artists data
  const topArtists = [
    { id: 1, name: "Muse", followers: "142291", plays: "19M", cover: "/api/placeholder/56/56" },
    { id: 2, name: "Bring Me the Horizon", followers: "52081", plays: "58M", cover: "/api/placeholder/56/56" },
    { id: 3, name: "Ed Sheeran", followers: "49435", plays: "998K", cover: "/api/placeholder/56/56" },
  ];
  
  // Mock recent favorites data
  const recentFavorites = [
    { id: 1, title: "Family tourism", description: "The more, the merrier. Suitable for children", cover: "/api/placeholder/180/180" },
    { id: 2, title: "Bright Hits", description: "The most popular and striking music news", cover: "/api/placeholder/180/180" },
    { id: 3, title: "Freeze", description: "Chilled beats for summer nights", cover: "/api/placeholder/180/180" },
    { id: 4, title: "Summer Vibes", description: "Perfect soundtrack for sunny days", cover: "/api/placeholder/180/180" },
  ];
  
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
    const progressBarWidth = progressBar.offsetWidth;
    const newProgress = (clickPosition / progressBarWidth) * 100;
    setProgress(newProgress);
  };
  
  return (
    <div 
      ref={appRef} 
      className="min-h-screen w-full bg-[#07070d] font-rubik text-[#c4c4c4] overflow-x-hidden"
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
    >
      {/* Main Content */}
      <div className="w-full max-w-[100vw] flex flex-col min-h-screen">
        {/* Main Content Scroll Area */}
        <div className="flex-1 w-full overflow-y-auto">
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
              {trendingSongs.map((song) => (
                <div key={song.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 text-sm opacity-50 mr-4">{song.id < 10 ? `0${song.id}` : song.id}</div>
                    <div className="w-12 h-12 rounded overflow-hidden mr-4">
                      <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
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
              ))}
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
                  {recentFavorites.map((item) => (
                    <div key={item.id} className="bg-[#3a3a43]/20 rounded-xl overflow-hidden hover:bg-[#3a3a43]/30 transition-colors cursor-pointer group">
                      <div className="h-40 relative overflow-hidden">
                        <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
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
                  ))}
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
                {topArtists.map((artist) => (
                  <div key={artist.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                        <img src={artist.cover} alt={artist.name} className="w-full h-full object-cover" />
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
                ))}
              </div>
              
              {/* Recent favorites section */}
              <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#fcfcff]">Recent favourites</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-[#3a3a43]/20 rounded-xl overflow-hidden cursor-pointer hover:bg-[#3a3a43]/30 transition-colors p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#3c3abe] to-purple-600 rounded-md flex items-center justify-center">
                        <Music size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#fcfcff]">AI Summer Mix</h3>
                        <p className="text-xs opacity-70">Generated for you</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#3a3a43]/20 rounded-xl overflow-hidden cursor-pointer hover:bg-[#3a3a43]/30 transition-colors p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-md flex items-center justify-center">
                        <Heart size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#fcfcff]">Your Favorites</h3>
                        <p className="text-xs opacity-70">32 songs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Player */}
        
      </div>
    </div>
  );
};

export default ReverBeatApp;