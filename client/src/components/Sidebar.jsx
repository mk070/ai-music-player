import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Music, Home, Folder, User, Heart, Star, Settings } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useMusicPlayer();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`h-screen fixed top-0 left-0 z-30 flex flex-col bg-[#232328] text-[#c4c4c4] border-r border-[#3a3a43] overflow-hidden transition-all duration-300 ${isOpen ? 'w-20 md:w-24' : 'w-0'}`}>
      {/* Logo */}
      <div className="py-6 flex justify-center">
        <div className="w-10 h-10 bg-[#3c3abe] rounded-full flex items-center justify-center">
          <Music size={18} className="text-white" />
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-8 mt-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isActive('/dashboard') ? 'bg-[#3c3abe]/20 text-[#3c3abe]' : 'hover:bg-[#3a3a43]/20'}`}
        >
          <Home size={22} />
        </button>
        <button 
          onClick={() => navigate('/music')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isActive('/music') ? 'bg-[#3c3abe]/20 text-[#3c3abe]' : 'hover:bg-[#3a3a43]/20'}`}
        >
          <Music size={22} />
        </button>
        <button 
          onClick={() => navigate('/library')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isActive('/library') ? 'bg-[#3c3abe]/20 text-[#3c3abe]' : 'hover:bg-[#3a3a43]/20'}`}
        >
          <Folder size={22} />
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isActive('/profile') ? 'bg-[#3c3abe]/20 text-[#3c3abe]' : 'hover:bg-[#3a3a43]/20'}`}
        >
          <User size={22} />
        </button>
      </nav>
      
      {/* Lower Section */}
      <div className="flex flex-col items-center gap-6 mb-8">
        <button 
          onClick={() => navigate('/favorites')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isActive('/favorites') ? 'bg-[#3c3abe]/20 text-[#3c3abe]' : 'hover:bg-[#3a3a43]/20'}`}
        >
          <Heart size={22} />
        </button>
        <button 
          onClick={() => navigate('/featured')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isActive('/featured') ? 'bg-[#3c3abe]/20 text-[#3c3abe]' : 'hover:bg-[#3a3a43]/20'}`}
        >
          <Star size={22} />
        </button>
        <button 
          onClick={() => navigate('/playlists')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isActive('/playlists') ? 'bg-[#3c3abe]/20 text-[#3c3abe]' : 'hover:bg-[#3a3a43]/20'}`}
        >
          <Folder size={22} />
        </button>
        <button 
          onClick={() => navigate('/settings')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isActive('/settings') ? 'bg-[#3c3abe]/20 text-[#3c3abe]' : 'hover:bg-[#3a3a43]/20'}`}
        >
          <Settings size={22} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;