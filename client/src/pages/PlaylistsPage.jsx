import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Play, 
  Share2, 
  Heart, 
  MessageCircle, 
  GitFork,
  Plus,
  MoreVertical,
  Filter,
  Clock,
  Users,
  Headphones,
  Sparkles,
  Download,
  Volume2,
  Search,
  Music,
  Home,
  User
} from 'lucide-react';

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Sample data
const aiMoodPlaylists = [
  {
    id: 1,
    name: "Chill Drive",
    mood: "melancholy",
    color: "from-blue-400 to-purple-500",
    tracks: 24,
    duration: "1h 32m",
    plays: "2.1k",
    cover: "/api/placeholder/300/300"
  },
  {
    id: 2,
    name: "Monsoon Nights",
    mood: "nostalgic",
    color: "from-teal-400 to-blue-500",
    tracks: 18,
    duration: "58m",
    plays: "1.8k",
    cover: "/api/placeholder/300/300"
  },
  {
    id: 3,
    name: "Summer Breeze",
    mood: "uplifting",
    color: "from-yellow-400 to-orange-500",
    tracks: 32,
    duration: "2h 14m",
    plays: "3.2k",
    cover: "/api/placeholder/300/300"
  },
  {
    id: 4,
    name: "Late Night Vibes",
    mood: "chill",
    color: "from-purple-400 to-pink-500",
    tracks: 21,
    duration: "1h 26m",
    plays: "1.5k",
    cover: "/api/placeholder/300/300"
  },
  {
    id: 5,
    name: "Road Trip Classics",
    mood: "energetic",
    color: "from-green-400 to-teal-500",
    tracks: 45,
    duration: "3h 12m",
    plays: "4.1k",
    cover: "/api/placeholder/300/300"
  }
];

const userPlaylists = [
  {
    id: 1,
    name: "Summer 2024 Hits",
    cover: "/api/placeholder/300/300",
    duration: "2h 45m",
    tracks: 42,
    tags: ["#Summer2024", "#Hits"],
    type: "created",
    isPublic: true
  },
  {
    id: 2,
    name: "Rainy Day Feels",
    cover: "/api/placeholder/300/300",
    duration: "1h 28m",
    tracks: 23,
    tags: ["#RainDrive", "#LoFi"],
    type: "favorited",
    isPublic: false
  },
  {
    id: 3,
    name: "Workout Energy",
    cover: "/api/placeholder/300/300",
    duration: "56m",
    tracks: 18,
    tags: ["#Workout", "#Energy"],
    type: "created",
    isPublic: true
  },
  {
    id: 4,
    name: "Study Sessions",
    cover: "/api/placeholder/300/300",
    duration: "3h 15m",
    tracks: 67,
    tags: ["#Study", "#Focus"],
    type: "shared",
    isPublic: false
  }
];

const communityPlaylists = [
  {
    id: 1,
    name: "Gen Z Anthems",
    creator: { name: "Alex Rivera", avatar: "/api/placeholder/40/40" },
    cover: "/api/placeholder/300/300",
    duration: "1h 42m",
    tracks: 28,
    likes: 1247,
    comments: 89,
    forks: 156,
    tags: ["#GenZ", "#Trending"]
  },
  {
    id: 2,
    name: "Midnight Coffee Shop",
    creator: { name: "Luna Park", avatar: "/api/placeholder/40/40" },
    cover: "/api/placeholder/300/300",
    duration: "2h 18m",
    tracks: 35,
    likes: 892,
    comments: 67,
    forks: 203,
    tags: ["#CoffeeShop", "#Ambient"]
  },
  {
    id: 3,
    name: "Beach Sunset Vibes",
    creator: { name: "Maya Chen", avatar: "/api/placeholder/40/40" },
    cover: "/api/placeholder/300/300",
    duration: "1h 33m",
    tracks: 24,
    likes: 2156,
    comments: 145,
    forks: 298,
    tags: ["#Beach", "#Sunset"]
  }
];

const Playlists = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const heroRef = useRef(null);
  const aiCarouselRef = useRef(null);
  const playlistsGridRef = useRef(null);
  const communityRef = useRef(null);
  const ctaButtonRef = useRef(null);
  const playlistContainerRef = useRef(null);
  
  // Hero animations
  useEffect(() => {
    if (heroRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo('.hero-title', 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo('.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo('.hero-badge',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.2"
      );
    }
  }, []);

  // AI Carousel animations
  useEffect(() => {
    if (aiCarouselRef.current) {
      gsap.fromTo('.ai-playlist-card',
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: aiCarouselRef.current,
            start: "top 80%"
          }
        }
      );
    }
  }, []);

  // Playlists grid animations
  useEffect(() => {
    if (playlistsGridRef.current) {
      gsap.fromTo('.playlist-card',
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: playlistsGridRef.current,
            start: "top 85%"
          }
        }
      );
    }
  }, [activeFilter]);

  // Community section animations
  useEffect(() => {
    if (communityRef.current) {
      gsap.fromTo('.community-card',
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: communityRef.current,
            start: "top 80%"
          }
        }
      );
    }
  }, []);

  // Floating CTA button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter playlists
  const filteredPlaylists = userPlaylists.filter(playlist => {
    if (activeFilter === 'all') return true;
    return playlist.type === activeFilter;
  });

  const getMoodColor = (mood) => {
    const colors = {
      melancholy: 'bg-blue-900/40 text-blue-300 border border-blue-500/30',
      nostalgic: 'bg-purple-900/40 text-purple-300 border border-purple-500/30',
      uplifting: 'bg-amber-900/40 text-amber-300 border border-amber-500/30',
      chill: 'bg-teal-900/40 text-teal-300 border border-teal-500/30',
      energetic: 'bg-green-900/40 text-green-300 border border-green-500/30',
      focus: 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30',
      summer: 'bg-pink-900/40 text-pink-300 border border-pink-500/30'
    };
    return colors[mood] || 'bg-gray-800/40 text-gray-400 border border-gray-600/30';
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-[#c4c4c4] font-['Rubik',sans-serif]">
    
      {/* AI Mood-Based Mix Carousel */}
      <section ref={aiCarouselRef} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#fcfcff] mb-4">
              AI Curated for Your Mood
            </h2>
            <p className="text-[#c4c4c4] text-lg">
              Playlists that understand your vibe before you do
            </p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => {
                playlistContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-[#1a1a24] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#3c3abe] transition-colors duration-300"
            >
              &larr;
            </button>
            
            <div 
              ref={playlistContainerRef}
              className="ai-playlist-container flex overflow-hidden space-x-6 py-6 px-2"
            >
              {aiMoodPlaylists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  className="ai-playlist-card flex-shrink-0 w-80"
                  onHoverStart={() => setHoveredCard(`ai-${playlist.id}`)}
                  onHoverEnd={() => setHoveredCard(null)}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${playlist.color} rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    
                    <div className="relative bg-[#0f0f17]/80 backdrop-blur-md rounded-2xl p-6 border border-[#2a2a3a] hover:border-[#3c3abe] hover:shadow-lg hover:shadow-[#3c3abe]/20 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-[#fcfcff] mb-2">
                            {playlist.name}
                          </h3>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getMoodColor(playlist.mood)} backdrop-blur-sm`}>
                            #{playlist.mood}
                          </span>
                        </div>
                        
                        <motion.button
                          className="w-12 h-12 bg-[#3c3abe] rounded-full flex items-center justify-center text-white hover:bg-[#3c3abe]/80 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play size={18} fill="white" />
                        </motion.button>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm text-[#c4c4c4]">
                          <span>{playlist.tracks} tracks</span>
                          <span>{playlist.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#c4c4c4]">
                          <span className="flex items-center"><Users size={12} className="mr-1" /> {playlist.plays}</span>
                          <button className="hover:text-[#3c3abe] transition-colors hover:scale-110">
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button 
              onClick={() => {
                playlistContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-[#1a1a24] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#3c3abe] transition-colors duration-300"
            >
              &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* My Playlists */}
      <section ref={playlistsGridRef} className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#fcfcff] mb-4">
                My Playlists
              </h2>
              <p className="text-[#c4c4c4] text-lg">
                Your personal collection of curated vibes
              </p>
            </div>
            
            <motion.button
              className="mt-6 md:mt-0 bg-gradient-to-r from-[#3c3abe] to-[#6563ee] text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 hover:shadow-lg hover:shadow-[#3c3abe]/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              <span>Create New Playlist</span>
            </motion.button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['all', 'created', 'favorited', 'shared'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-[#3c3abe] text-white'
                    : 'bg-[#fcfcff]/10 text-[#c4c4c4] hover:bg-[#fcfcff]/20'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Playlists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaylists.map((playlist) => (
              <motion.div
                key={playlist.id}
                className="playlist-card group relative"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3c3abe]/20 to-[#6563ee]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-[#fcfcff] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-48">
                      <img 
                        src={playlist.cover} 
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Play Button Overlay */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                      >
                        <button className="w-16 h-16 bg-[#3c3abe] rounded-full flex items-center justify-center text-white shadow-lg">
                          <Play size={24} fill="white" />
                        </button>
                      </motion.div>
                      
                      {/* More Options */}
                      <button className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#07070d] mb-2">
                        {playlist.name}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-600 space-x-4 mb-3">
                        <span className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{playlist.duration}</span>
                        </span>
                        <span>{playlist.tracks} tracks</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {playlist.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#3c3abe]/10 text-[#3c3abe] text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          playlist.isPublic 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {playlist.isPublic ? 'Public' : 'Private'}
                        </span>
                        
                        <button className="text-gray-400 hover:text-[#3c3abe] transition-colors">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community & Shared Playlists */}
      <section ref={communityRef} className="py-20 px-6 bg-[#fcfcff]/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#fcfcff] mb-4">
              Community Playlists
            </h2>
            <p className="text-[#c4c4c4] text-lg">
              Discover and share playlists with fellow music lovers
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {communityPlaylists.map((playlist) => (
              <motion.div
                key={playlist.id}
                className="community-card bg-[#fcfcff]/10 backdrop-blur-md rounded-2xl p-6 border border-[#fcfcff]/20 hover:border-[#3c3abe]/50 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#fcfcff] mb-1">
                      {playlist.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-[#c4c4c4]">
                      <img
                        src={playlist.creator.avatar}
                        alt={playlist.creator.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span>by {playlist.creator.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-[#c4c4c4] space-x-4 mb-4">
                  <span className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{playlist.duration}</span>
                  </span>
                  <span>{playlist.tracks} tracks</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {playlist.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#3c3abe]/20 text-[#3c3abe] text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#fcfcff]/10">
                  <div className="flex items-center space-x-4 text-sm text-[#c4c4c4]">
                    <button className="flex items-center space-x-1 hover:text-red-400 transition-colors">
                      <Heart size={14} />
                      <span>{playlist.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                      <MessageCircle size={14} />
                      <span>{playlist.comments}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                      <GitFork size={14} />
                      <span>{playlist.forks}</span>
                    </button>
                  </div>
                  
                  <motion.button
                    className="w-10 h-10 bg-[#3c3abe] rounded-full flex items-center justify-center text-white hover:bg-[#3c3abe]/80 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={14} fill="white" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* You Might Also Like */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-[#fcfcff] mb-6">
              You might also like...
            </h3>
            
            <div className="flex justify-center">
              <motion.button
                className="bg-[#fcfcff]/10 backdrop-blur-sm text-[#c4c4c4] px-6 py-3 rounded-xl hover:bg-[#fcfcff]/20 transition-all duration-300 border border-[#fcfcff]/20"
                whileHover={{ scale: 1.05 }}
              >
                Discover More Playlists
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Offline CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#3c3abe]/20 to-[#6563ee]/20 backdrop-blur-sm rounded-2xl p-8 border border-[#3c3abe]/30">
            <Download className="mx-auto mb-4 text-[#3c3abe]" size={48} />
            <h3 className="text-2xl font-bold text-[#fcfcff] mb-4">
              Save Your Favorites Offline
            </h3>
            <p className="text-[#c4c4c4] mb-6">
              Download your playlists and enjoy your music anywhere, even without internet
            </p>
            
            <motion.button
              className="bg-gradient-to-r from-[#3c3abe] to-[#6563ee] text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-[#3c3abe]/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enable Offline Mode
            </motion.button>
          </div>
        </div>
      </section>


      {/* Floating CTA Button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            ref={ctaButtonRef}
            className="fixed bottom-16 right-16 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.button
              className="group relative w-16 h-16 bg-gradient-to-r from-[#3c3abe] to-[#6563ee] rounded-full shadow-lg shadow-[#3c3abe]/25 flex items-center justify-center text-white overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 8px 32px rgba(60, 58, 190, 0.25)",
                  "0 8px 32px rgba(60, 58, 190, 0.5)",
                  "0 8px 32px rgba(60, 58, 190, 0.25)"
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              <Plus size={28} />
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.8 }}
                transition={{ duration: 0.5 }}
                style={{ originX: 0.5, originY: 0.5, opacity: 0.1 }}
              />
            </motion.button>
            
            <motion.div
              className="absolute -top-10 right-0 bg-white text-[#07070d] text-sm font-medium px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Create Playlist
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Player (Minimized version) */}
      <div className="fixed bottom-0 left-0 right-0 bg-black h-16 border-t border-[#3c3abe]/20 flex items-center justify-between px-4 z-40">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden mr-3">
            <img 
              src="/api/placeholder/40/40" 
              alt="Now playing" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-white text-sm font-medium">Currently Playing</h4>
            <p className="text-[#c4c4c4] text-xs">Artist Name</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-[#c4c4c4] hover:text-white transition-colors">
            <Play size={20} />
          </button>
          <button className="text-[#c4c4c4] hover:text-white transition-colors">
            <Heart size={20} />
          </button>
          <button className="text-[#c4c4c4] hover:text-white transition-colors">
            <Volume2 size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Hidden on larger screens) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-[#07070d] border-t border-[#3c3abe]/20 flex items-center justify-around px-2 py-3 z-40">
        <button className="flex flex-col items-center justify-center text-[#3c3abe]">
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#c4c4c4]">
          <Search size={20} />
          <span className="text-xs mt-1">Search</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#c4c4c4]">
          <Music size={20} />
          <span className="text-xs mt-1">Library</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#c4c4c4]">
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
      </div>
);
};


export default Playlists;