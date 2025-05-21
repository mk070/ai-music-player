import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MusicPlayer from './MusicPlayer';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentSong } = useMusicPlayer();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-16 md:ml-20' : 'ml-16'}`}>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
        
        {currentSong && (
          <div className="sticky bottom-0 w-full bg-navy-dark border-t border-navy-light z-10">
            <MusicPlayer />
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;