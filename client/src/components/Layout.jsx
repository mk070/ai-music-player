import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Upload, ListMusic, Heart, Clock, Library, User, Menu, X } from 'lucide-react';
import MusicPlayer from './MusicPlayer';  

// Sticky Player Component
const StickyPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  return (
    <>
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/10 p-3 h-20 flex items-center z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto max-w-screen-xl flex items-center gap-4">
          {/* Album Art with Vinyl Animation */}
          <div className="relative h-14 w-14 rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-blue-600 rounded-full" 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            >
              <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </motion.div>
            <div className="absolute inset-3 bg-cover bg-center rounded-full" 
                style={{ backgroundImage: "url('/api/placeholder/100/100')" }}></div>
          </div>
          
          {/* Song Info */}
          <div className="flex-1" onClick={() => setShowFullPlayer(true)}>
            <h4 className="text-white font-medium truncate">Summer Memories</h4>
            <p className="text-gray-400 text-sm truncate">Artist Name</p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white"
            >
              {isPlaying ? (
                <span className="h-4 w-4 border-l-2 border-r-2 border-white"></span>
              ) : (
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="hidden md:flex flex-1 items-center gap-3">
            <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-gray-400 text-xs">2:14 / 3:45</span>
          </div>
        </div>
      </motion.div>
      
      {/* Full Player Modal */}
      <AnimatePresence>
        {showFullPlayer && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-end p-6">
              <button 
                onClick={() => setShowFullPlayer(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
              {/* Large Album Art */}
              <motion.div 
                className="h-64 w-64 bg-cover bg-center rounded-lg shadow-2xl"
                style={{ backgroundImage: "url('/api/placeholder/300/300')" }}
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 20, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              />
              
              {/* Song Info */}
              <div className="text-center">
                <h2 className="text-white text-2xl font-bold">Summer Memories</h2>
                <p className="text-gray-300 text-lg">Artist Name</p>
              </div>
              
              {/* Waveform Visualizer */}
              <div className="w-full max-w-md h-12 flex items-end justify-between">
                {[...Array(40)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-blue-600 w-1.5 rounded-t-sm"
                    animate={{ 
                      height: isPlaying ? `${Math.random() * 100}%` : '20%'
                    }}
                    transition={{
                      duration: 0.2,
                      repeat: isPlaying ? Infinity : 0,
                      repeatType: "mirror"
                    }}
                  />
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md flex flex-col gap-2">
                <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between w-full text-gray-400 text-sm">
                  <span>2:14</span>
                  <span>3:45</span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-8">
                <button className="text-white h-12 w-12 flex items-center justify-center">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <polygon points="19,5 19,19 5,12" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => setIsPlaying(!isPlaying)} 
                  className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-600 text-white"
                >
                  {isPlaying ? (
                    <span className="h-6 w-6 border-l-2 border-r-2 border-white"></span>
                  ) : (
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  )}
                </button>
                
                <button className="text-white h-12 w-12 flex items-center justify-center">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <polygon points="5,5 5,19 19,12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// TopBar Component
const TopBar = ({ toggleSidebar }) => {
  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-sm h-16 border-b border-white/10 flex items-center px-4 md:px-6"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <button 
        onClick={toggleSidebar}
        className="md:hidden h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white"
      >
        <Menu size={20} />
      </button>
      
      <div className="ml-4 md:ml-0 flex-1">
        <h1 className="text-white text-xl font-bold">SoundWave</h1>
      </div>
      
      <div className="relative">
        <button className="h-10 w-10 rounded-full bg-cover bg-center border border-white/20">
          <img src="/api/placeholder/40/40" alt="Profile" className="rounded-full" />
        </button>
      </div>
    </motion.div>
  );
};

// Main Layout Component
const Layout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/upload', label: 'Upload Music', icon: <Upload size={20} /> },
    { path: '/playlists', label: 'Playlists', icon: <ListMusic size={20} /> },
    { path: '/favorites', label: 'Favorites', icon: <Heart size={20} /> },
    { path: '/journey', label: 'Summer Journey', icon: <Clock size={20} /> },
    { path: '/library', label: 'My Library', icon: <Library size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];
  
  return (
    <div className="flex h-screen bg-[#07070d] text-[#c4c4c4] overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarVisible || window.innerWidth >= 768) && (
          <motion.aside 
            className={`fixed md:relative z-30 h-full w-64 bg-[#07070d] border-r border-white/10 flex flex-col`}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Mobile Close Button */}
            <div className="md:hidden p-4 flex justify-end">
              <button 
                onClick={() => setSidebarVisible(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <nav className="space-y-2">
                {navItems.map(item => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setSidebarVisible(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path 
                        ? 'bg-[#3c3abe] text-[#fcfcff]' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24">
          <Outlet />
        </main>
        
        {/* Music Player */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
};

export default Layout;