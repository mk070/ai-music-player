import React, { useEffect, useRef, useState } from 'react';
import HeroSection from '../components/HeroSection';
import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';
import PlaylistCard from '../components/PlaylistCard';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { ChevronRight, Music, Radio, Heart, Clock, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Dashboard = () => {
  const { songs, artists, playlists, playSong, currentSong } = useMusicPlayer();
  const [isLoaded, setIsLoaded] = useState(false);
  const pageRef = useRef(null);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Animation timeline
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });
    
    // Animate hero section
    tl.from('.hero-section', {
      y: 30,
      opacity: 0,
      duration: 0.8
    });
    
    // Animate sections with stagger
    tl.from('.dashboard-section', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    }, '-=0.4');
    
    // Setup scroll animations
    gsap.utils.toArray('.scroll-animate').forEach((section, i) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.1
      });
    });
    
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const handleHeroCta = () => {
    if (songs.length > 0) {
      playSong(songs[0]);
    }
  };
  
  // Get recently played songs (last 5)
  const recentSongs = [...songs].reverse().slice(0, 5);
  // Get top artists (sorted by popularity)
  const topArtists = [...artists].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
  // Get featured playlists
  const featuredPlaylists = playlists.slice(0, 4);
  
  return (
    <div 
      ref={pageRef} 
      className={`min-h-screen pb-32 pt-4 px-4 md:px-8 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Hero Section */}
      <section className="hero-section mb-12 rounded-2xl overflow-hidden bg-gradient-to-r from-accent-dark/20 to-accent/20 backdrop-blur-sm">
        <div className="p-8 md:p-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-content mb-4">
              Welcome back to <span className="text-accent">ReverBeat</span>
            </h1>
            <p className="text-lg text-text-light mb-8">
              Your personal music journey continues. Discover new tracks, revisit favorites, and create the perfect playlist for every moment.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleHeroCta}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full font-medium flex items-center transition-all shadow-lg hover:shadow-accent/30"
              >
                <Play className="mr-2" size={18} />
                Continue Listening
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-content px-6 py-3 rounded-full font-medium flex items-center transition-all backdrop-blur-sm">
                <Plus className="mr-2" size={18} />
                New Playlist
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recently Played */}
      <section className="dashboard-section scroll-animate mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-content flex items-center">
            <Clock className="text-accent mr-3" size={24} />
            Recently Played
          </h2>
          <button className="text-accent hover:text-accent-light flex items-center text-sm group">
            See all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="bg-navy-dark/50 backdrop-blur-sm rounded-2xl p-4">
          <div className="space-y-2">
            {recentSongs.map((song, index) => (
              <SongCard 
                key={`recent-${song.id}`} 
                song={song} 
                index={index + 1}
                compact={true}
                showPlayButton={true}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Top Artists */}
      <section className="dashboard-section scroll-animate mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-content flex items-center">
            <Heart className="text-accent mr-3" size={24} />
            Your Top Artists
          </h2>
          <button className="text-accent hover:text-accent-light flex items-center text-sm group">
            See all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {topArtists.map(artist => (
            <ArtistCard key={`artist-${artist.id}`} artist={artist} />
          ))}
        </div>
      </section>
      
      {/* Featured Playlists */}
      <section className="dashboard-section scroll-animate">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-content flex items-center">
            <Music className="text-accent mr-3" size={24} />
            Made For You
          </h2>
          <button className="text-accent hover:text-accent-light flex items-center text-sm group">
            See all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPlaylists.map(playlist => (
            <div key={`playlist-${playlist.id}`} className="hover:scale-[1.02] transition-transform">
              <PlaylistCard playlist={playlist} />
            </div>
          ))}
        </div>
      </section>
      
      {/* Currently Playing Bar - Fixed at bottom */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-navy-dark/90 backdrop-blur-lg border-t border-white/10 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={currentSong.cover} 
                alt={currentSong.title} 
                className="w-12 h-12 rounded-md mr-4"
              />
              <div>
                <h4 className="font-medium text-content">{currentSong.title}</h4>
                <p className="text-sm text-text-light">{currentSong.artist}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-text-light hover:text-accent transition-colors">
                <SkipBack size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent/90 transition-colors">
                <Play size={16} className="ml-0.5" />
              </button>
              <button className="text-text-light hover:text-accent transition-colors">
                <SkipForward size={20} />
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-2 w-1/3">
              <span className="text-xs text-text-light">1:23</span>
              <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-1/3"></div>
              </div>
              <span className="text-xs text-text-light">3:45</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;