import React, { createContext, useState, useContext, useEffect } from 'react';

// Sample data for music
const sampleSongs = [
  {
    id: 1,
    title: "I'm Good (Blue)",
    artist: "David Guetta & Bebe Rexha",
    duration: "03:29",
    cover: "https://images.pexels.com/photos/45243/saxophone-music-gold-glitter-45243.jpeg",
    audio: "",
    plays: "8,078,651"
  },
  {
    id: 2,
    title: "Under the Influence",
    artist: "Chris Brown",
    duration: "03:04",
    cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
    audio: "",
    plays: "2,341,221"
  },
  {
    id: 3,
    title: "Forget Me",
    artist: "Lewis Capaldi",
    duration: "03:24",
    cover: "https://images.pexels.com/photos/1616470/pexels-photo-1616470.jpeg",
    audio: "",
    plays: "2,212,882"
  },
  {
    id: 4,
    title: "Bad Habit",
    artist: "Steve Lacy",
    duration: "03:32",
    cover: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg",
    audio: "",
    plays: "1,934,291"
  },
  {
    id: 5,
    title: "DON'T YOU WORRY",
    artist: "Black Eyed Peas, Shakira & David Guetta",
    duration: "03:42",
    cover: "https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg",
    audio: "",
    plays: "1,856,239"
  }
];

const sampleArtists = [
  {
    id: 1,
    name: "Muse",
    followers: "142,291",
    plays: "119M",
    image: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg"
  },
  {
    id: 2,
    name: "Bring Me the Horizon",
    followers: "95,861",
    plays: "85M",
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"
  },
  {
    id: 3,
    name: "Ed Sheeran",
    followers: "49,438",
    plays: "998K",
    image: "https://images.pexels.com/photos/1656062/pexels-photo-1656062.jpeg"
  }
];

const samplePlaylists = [
  {
    id: 1,
    title: "Family tourism",
    description: "The more, the merrier. Suitable for children",
    cover: "https://images.pexels.com/photos/3621344/pexels-photo-3621344.jpeg",
    songs: [1, 3, 5]
  },
  {
    id: 2,
    title: "Bright Hits",
    description: "The most popular and striking music news",
    cover: "https://images.pexels.com/photos/2516417/pexels-photo-2516417.jpeg",
    songs: [2, 4, 1]
  }
];

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => useContext(MusicPlayerContext);

export const MusicPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [songs] = useState(sampleSongs);
  const [artists] = useState(sampleArtists);
  const [playlists] = useState(samplePlaylists);
  const [user, setUser] = useState(null);

  // Simulate progress updates when playing
  useEffect(() => {
    let interval;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSong]);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const resumeSong = () => {
    setIsPlaying(true);
  };

  const nextSong = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setProgress(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!currentSong) {
      if (songs.length > 0) {
        setCurrentSong(songs[0]);
        setIsPlaying(true);
      }
      return;
    }
    
    setIsPlaying(!isPlaying);
  };

  const login = (email, password) => {
    // Mock login functionality
    setUser({ email, name: email.split('@')[0] });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        volume,
        songs,
        artists,
        playlists,
        user,
        playSong,
        pauseSong,
        resumeSong,
        nextSong,
        prevSong,
        togglePlay,
        setVolume,
        setProgress,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};