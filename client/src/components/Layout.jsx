import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Upload, ListMusic, Heart, Clock, Library, User, Menu, X } from 'lucide-react';
import MusicPlayer from './MusicPlayer';  
import Topbar from './Topbar';


// TopBar Component
// const TopBar = ({ toggleSidebar }) => {
//   return (
//     <motion.div 
//       className="bg-white/5 backdrop-blur-sm h-16 border-b border-white/10 flex items-center px-4 md:px-6"
//       initial={{ y: -50 }}
//       animate={{ y: 0 }}
//       transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//     >
//       <button 
//         onClick={toggleSidebar}
//         className="md:hidden h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white"
//       >
//         <Menu size={20} />
//       </button>
      
//       <div className="ml-4 md:ml-0 flex-1">
//         <h1 className="text-white text-xl font-bold">SoundWave</h1>
//       </div>
      
//       <div className="relative">
//         <button className="h-10 w-10 rounded-full bg-cover bg-center border border-white/20">
//           <img src="/api/placeholder/40/40" alt="Profile" className="rounded-full" />
//         </button>
//       </div>
//     </motion.div>
//   );
// };

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
    // { path: '/library', label: 'My Library', icon: <Library size={20} /> },
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
        <Topbar toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
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