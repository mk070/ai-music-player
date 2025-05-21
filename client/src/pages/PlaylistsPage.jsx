import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, PlusCircle, Play, Edit2, Share2, Trash2, Music, Heart, Calendar, Clock } from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Mock data for playlists
const mockPlaylists = [
  {
    id: 1,
    title: "Summer Roadtrip '24",
    coverUrl: "https://images.unsplash.com/photo-1523997597394-92519105b5d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    songCount: 14,
    createdAt: "June 2024",
    type: "manual",
    favorite: true,
    mood: "energy",
    tags: ["summer", "driving"]
  },
  {
    id: 2,
    title: "Study Focus Flow",
    coverUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    songCount: 24,
    createdAt: "May 2024",
    type: "ai",
    favorite: false,
    mood: "focus",
    tags: ["concentration", "ambient"],
    aiReason: "Based on your productivity patterns"
  },
  {
    id: 3,
    title: "Beach Sunset Chill",
    coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    songCount: 18,
    createdAt: "July 2024",
    type: "manual",
    favorite: true,
    mood: "chill",
    tags: ["summer", "relax"]
  },
  {
    id: 4,
    title: "Morning Boost",
    coverUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    songCount: 10,
    createdAt: "July 2024",
    type: "ai", 
    favorite: false,
    mood: "energy",
    tags: ["workout", "morning"],
    aiReason: "Generated based on your morning activity"
  },
  {
    id: 5,
    title: "Late Night Coding",
    coverUrl: "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    songCount: 35,
    createdAt: "April 2024",
    type: "manual",
    favorite: true,
    mood: "focus",
    tags: ["electronic", "ambient"]
  },
  {
    id: 6,
    title: "Nostalgic Throwbacks",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    songCount: 22,
    createdAt: "June 2024",
    type: "ai",
    favorite: false,
    mood: "nostalgia",
    tags: ["retro", "classics"],
    aiReason: "Based on your most played tracks from 2010-2015"
  },
  {
    id: 7,
    title: "Summer Memories",
    coverUrl: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    songCount: 17,
    createdAt: "July 2024",
    type: "manual",
    favorite: true,
    mood: "summer",
    tags: ["pop", "summer"]
  },
  {
    id: 8,
    title: "Heartbreak Healer",
    coverUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    songCount: 16,
    createdAt: "May 2024",
    type: "ai",
    favorite: false,
    mood: "melancholy",
    tags: ["sad", "emotional"],
    aiReason: "Created based on your journal entries this month"
  }
];

const PlaylistsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [filteredPlaylists, setFilteredPlaylists] = useState(mockPlaylists);
  
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const filterRef = useRef(null);
  
  // Filter playlists based on active filter and search term
  useEffect(() => {
    let result = [...mockPlaylists];
    
    // Apply filter
    if (activeFilter !== "all") {
      if (activeFilter === "ai") {
        result = result.filter(playlist => playlist.type === "ai");
      } else if (activeFilter === "manual") {
        result = result.filter(playlist => playlist.type === "manual");
      } else if (activeFilter === "favorites") {
        result = result.filter(playlist => playlist.favorite);
      } else if (activeFilter === "summer") {
        result = result.filter(playlist => 
          playlist.tags.includes("summer") || playlist.mood === "summer"
        );
      }
    }
    
    // Apply search
    if (searchTerm) {
      result = result.filter(playlist => 
        playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        playlist.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sorting
    if (sortOption === "recent") {
      // Already sorted by recent in our mock data
    } else if (sortOption === "alphabetical") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "most-played") {
      // In a real app, we'd sort by play count
      result.sort((a, b) => b.songCount - a.songCount);
    }
    
    setFilteredPlaylists(result);
  }, [activeFilter, searchTerm, sortOption]);
  
  // GSAP animations
  useEffect(() => {
    // Header animation
    gsap.from(headerRef.current.children, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
    
    // Filter tabs animation
    gsap.from(filterRef.current.children, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "back.out(1.7)",
      delay: 0.4
    });
    
    // Cards animation with ScrollTrigger
    const cards = cardsRef.current.children;
    gsap.from(cards, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none none"
      }
    });
    
    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredPlaylists]);

  return (
    <div className="min-h-screen font-['Rubik'] bg-[#2d2e37] text-[#c4c4c4]">
      {/* Main layout with left navigation and right content */}
      <div className="flex">
        {/* Left Navigation Bar - simplified for this example */}
        <div className="hidden md:flex w-20 lg:w-64 h-screen bg-[#262630] flex-col fixed left-0 top-0 border-r border-[#3c3abe]/20">
          <div className="p-6">
            <h2 className="text-white text-xl font-bold">Sonique</h2>
          </div>
          <nav className="mt-8 flex flex-col px-4">
            <a href="#" className="flex items-center py-3 px-4 rounded-lg text-[#c4c4c4] hover:bg-[#3c3abe]/10 transition-all">
              <span className="mr-3">🏠</span>
              <span className="hidden lg:inline">Home</span>
            </a>
            <a href="#" className="flex items-center py-3 px-4 rounded-lg bg-[#3c3abe]/20 text-white">
              <span className="mr-3">📚</span>
              <span className="hidden lg:inline">My Library</span>
            </a>
            <a href="#" className="flex items-center py-3 px-4 ml-6 rounded-lg text-white">
              <span className="mr-3">🎵</span>
              <span className="hidden lg:inline">Playlists</span>
            </a>
            <a href="#" className="flex items-center py-3 px-4 rounded-lg text-[#c4c4c4] hover:bg-[#3c3abe]/10 transition-all">
              <span className="mr-3">💎</span>
              <span className="hidden lg:inline">Explore</span>
            </a>
            <a href="#" className="flex items-center py-3 px-4 rounded-lg text-[#c4c4c4] hover:bg-[#3c3abe]/10 transition-all">
              <span className="mr-3">🧠</span>
              <span className="hidden lg:inline">AI DJ</span>
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full md:ml-20 lg:ml-64 p-4 md:p-8">
          {/* Header Section */}
          <header ref={headerRef} className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Your Playlists</h1>
            <p className="text-sm text-slate-300 italic mb-6">All your moods and memories in one place</p>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-xl px-6 py-2.5 shadow-lg flex items-center"
                onClick={() => alert("Navigate to /playlist-builder")}
              >
                <PlusCircle size={18} className="mr-2" />
                Create New Playlist
              </motion.button>
              
              {/* Search & Sort */}
              <div className="flex items-center mt-4 sm:mt-0">
                <div className="relative mr-4">
                  <input
                    type="text"
                    placeholder="Search playlists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 backdrop-blur-md rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3c3abe] w-full max-w-xs"
                  />
                  <Search size={16} className="text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3c3abe] appearance-none cursor-pointer"
                >
                  <option value="recent">Recently Added</option>
                  <option value="alphabetical">A-Z</option>
                  <option value="most-played">Most Played</option>
                </select>
              </div>
            </div>
          </header>
          
          {/* Filters */}
          <div ref={filterRef} className="mb-8 overflow-x-auto py-2 -mx-2 px-2">
            <div className="flex space-x-3 text-white text-sm font-semibold">
              <button
                className={`px-4 py-1.5 rounded-full transition-all ${activeFilter === 'all' ? 'bg-[#3c3abe] text-white' : 'bg-white/10 backdrop-blur-md hover:bg-white/20'}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-1.5 rounded-full transition-all flex items-center ${activeFilter === 'ai' ? 'bg-[#3c3abe] text-white' : 'bg-white/10 backdrop-blur-md hover:bg-white/20'}`}
                onClick={() => setActiveFilter('ai')}
              >
                <span className="mr-1.5">🧠</span> AI-Suggested
              </button>
              <button
                className={`px-4 py-1.5 rounded-full transition-all ${activeFilter === 'manual' ? 'bg-[#3c3abe] text-white' : 'bg-white/10 backdrop-blur-md hover:bg-white/20'}`}
                onClick={() => setActiveFilter('manual')}
              >
                Manual
              </button>
              <button
                className={`px-4 py-1.5 rounded-full transition-all flex items-center ${activeFilter === 'favorites' ? 'bg-[#3c3abe] text-white' : 'bg-white/10 backdrop-blur-md hover:bg-white/20'}`}
                onClick={() => setActiveFilter('favorites')}
              >
                <span className="mr-1.5">❤️</span> Favorites
              </button>
              <button
                className={`px-4 py-1.5 rounded-full transition-all flex items-center ${activeFilter === 'summer' ? 'bg-[#3c3abe] text-white' : 'bg-white/10 backdrop-blur-md hover:bg-white/20'}`}
                onClick={() => setActiveFilter('summer')}
              >
                <span className="mr-1.5">🌞</span> Summer Vibes
              </button>
            </div>
          </div>
          
          {/* Playlist Grid */}
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            <AnimatePresence>
              {filteredPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </AnimatePresence>
          </div>
          
          {/* Empty State */}
          {filteredPlaylists.length === 0 && (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <Music size={48} className="text-white/30 mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">No playlists found</h3>
              <p className="text-white/60 mb-6">Try adjusting your filters or create a new playlist</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-xl px-4 py-2 shadow-lg flex items-center"
                onClick={() => alert("Navigate to /playlist-builder")}
              >
                <PlusCircle size={18} className="mr-2" />
                Create New Playlist
              </motion.button>
            </div>
          )}
          
          {/* Mobile Floating Action Button */}
          <div className="md:hidden fixed bottom-6 right-6 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-full p-4 shadow-xl"
              onClick={() => alert("Navigate to /playlist-builder")}
            >
              <PlusCircle size={24} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PlaylistCard Component
const PlaylistCard = ({ playlist }) => {
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef(null);
  
 // Continuing the PlaylistCard component:

  // Hover effect with GSAP
  useEffect(() => {
    if (isHovering) {
      gsap.to(cardRef.current, {
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgba(60, 58, 190, 0.15), 0 8px 10px -6px rgba(60, 58, 190, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(cardRef.current, {
        scale: 1,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isHovering]);

  // Mood emoji mapping
  const getMoodEmoji = (mood) => {
    const moods = {
      energy: "🔥",
      focus: "🧠",
      chill: "😌",
      nostalgia: "✨",
      summer: "🌞",
      melancholy: "💔"
    };
    return moods[mood] || "🎵";
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 overflow-hidden relative">
          <img 
            src={playlist.coverUrl} 
            alt={playlist.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Play button overlay on hover */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#3c3abe] rounded-full p-3 text-white"
              onClick={(e) => {
                e.stopPropagation();
                alert(`Playing playlist: ${playlist.title}`);
              }}
            >
              <Play size={24} fill="white" />
            </motion.button>
          </motion.div>
          
          {/* AI Badge */}
          {playlist.type === "ai" && (
            <div className="absolute top-3 left-3 bg-[#3c3abe]/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <span className="mr-1">🧠</span> AI
            </div>
          )}
          
          {/* Favorite Badge */}
          {playlist.favorite && (
            <div className="absolute top-3 right-3 bg-pink-500/90 text-white text-xs px-2 py-1 rounded-full">
              ❤️
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1">{playlist.title}</h3>
          
          <div className="flex items-center text-sm text-gray-300 mb-3">
            <Music size={14} className="mr-1" />
            <span className="mr-3">{playlist.songCount} songs</span>
            <Calendar size={14} className="mr-1" /> 
            <span>{playlist.createdAt}</span>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="bg-[#3c3abe]/20 text-[#c4c4c4] text-xs px-2 py-1 rounded-full flex items-center">
              {getMoodEmoji(playlist.mood)} {playlist.mood}
            </div>
            {playlist.tags.map((tag, index) => (
              <div key={index} className="bg-white/10 text-[#c4c4c4] text-xs px-2 py-1 rounded-full">
                #{tag}
              </div>
            ))}
          </div>
          
          {/* AI Reason */}
          {playlist.type === "ai" && playlist.aiReason && (
            <div className="text-xs text-[#c4c4c4]/70 italic mb-3">
              "{playlist.aiReason}"
            </div>
          )}
          
          {/* Action buttons */}
          <div className="mt-2 flex justify-between">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-[#c4c4c4] hover:text-white transition-colors rounded-full hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Edit playlist: ${playlist.title}`);
                }}
              >
                <Edit2 size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-[#c4c4c4] hover:text-white transition-colors rounded-full hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Share playlist: ${playlist.title}`);
                }}
              >
                <Share2 size={16} />
              </motion.button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-[#c4c4c4] hover:text-red-400 transition-colors rounded-full hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                alert(`Delete playlist: ${playlist.title}`);
              }}
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistsPage;