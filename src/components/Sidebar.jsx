import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Disc, Upload, Heart, User, Settings, Headphones, Film, LogOut } from 'lucide-react';
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
    <div 
      className={`h-screen flex flex-col fixed top-0 left-0 bg-navy-dark transition-all duration-300 ${
        isOpen ? 'w-16 md:w-20' : 'w-16'
      }`}
      aria-label="Sidebar Navigation"
    >
      <div className="p-2 flex justify-center items-center">
        <div className="sidebar-icon bg-accent text-content">
          <Headphones size={24} />
          <span className="sidebar-tooltip">ReverBeat</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center py-6 space-y-4">
        <SidebarIcon 
          icon={<Home size={20} />} 
          tooltip="Home" 
          active={isActive('/dashboard')} 
          onClick={() => navigate('/dashboard')} 
        />
        <SidebarIcon 
          icon={<Disc size={20} />} 
          tooltip="Playlists" 
          active={isActive('/playlists')} 
          onClick={() => navigate('/playlists')} 
        />
        <SidebarIcon 
          icon={<Upload size={20} />} 
          tooltip="Upload" 
          active={isActive('/upload')} 
          onClick={() => navigate('/upload')} 
        />
        <SidebarIcon 
          icon={<Heart size={20} />} 
          tooltip="Favorites" 
          active={isActive('/favorites')} 
          onClick={() => navigate('/favorites')} 
        />
        <SidebarIcon 
          icon={<Film size={20} />} 
          tooltip="Summer Journey" 
          active={isActive('/journey')} 
          onClick={() => navigate('/journey')} 
        />
        <SidebarIcon 
          icon={<User size={20} />} 
          tooltip="Profile" 
          active={isActive('/profile')} 
          onClick={() => navigate('/profile')} 
        />
      </div>
      
      <div className="p-4 flex flex-col items-center space-y-4">
        <SidebarIcon 
          icon={<Settings size={20} />} 
          tooltip="Settings" 
          active={isActive('/settings')} 
          onClick={() => navigate('/settings')} 
        />
        <SidebarIcon 
          icon={<LogOut size={20} />} 
          tooltip="Logout" 
          onClick={handleLogout} 
        />
      </div>
    </div>
  );
};

const SidebarIcon = ({ icon, tooltip, active = false, onClick }) => {
  return (
    <div 
      className={`sidebar-icon ${active ? 'bg-accent text-content' : ''}`}
      onClick={onClick}
      role="button"
      aria-label={tooltip}
    >
      {icon}
      <span className="sidebar-tooltip">{tooltip}</span>
    </div>
  );
};

export default Sidebar;