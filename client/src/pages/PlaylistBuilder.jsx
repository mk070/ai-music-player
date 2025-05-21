import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ListMusic, 
  Sparkles, 
  Tag, 
  ImagePlus, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';

// AI Prompt Input Component
const PlaylistPromptInput = ({ prompt, setPrompt, onGenerate }) => {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the perfect playlist... (e.g. 'Beach vibes for sunset relaxing')"
          className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3c3abe] focus:border-transparent"
        />
        <Sparkles size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3c3abe]" />
        
        <button 
          onClick={onGenerate}
          disabled={!prompt.trim()}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full text-xs ${
            prompt.trim() 
              ? 'bg-[#3c3abe] text-white hover:bg-[#3c3abe]/80' 
              : 'bg-white/10 text-gray-400'
          } transition-colors`}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

// Tag Selector Component
const TagSelector = ({ selectedTags, setSelectedTags }) => {
  const availableTags = [
    'Rock', 'Pop', 'Hip-Hop', 'Electronic', 'Jazz',
    'Classical', 'R&B', 'Reggae', 'Country', 'Metal',
    'Folk', 'Blues', 'Disco', 'Dance', 'Ambient'
  ];
  
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {availableTags.map(tag => (
        <motion.button
          key={tag}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleTag(tag)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedTags.includes(tag)
              ? 'bg-[#3c3abe] text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {tag}
        </motion.button>
      ))}
    </div>
  );
};

// Mood Picker Component
const MoodPicker = ({ selectedMood, setSelectedMood }) => {
  const moods = [
    { emoji: '😊', name: 'Happy' },
    { emoji: '😢', name: 'Sad' },
    { emoji: '😌', name: 'Relaxed' },
    { emoji: '🥳', name: 'Party' },
    { emoji: '😎', name: 'Cool' },
    { emoji: '🥰', name: 'Romantic' },
    { emoji: '💪', name: 'Energetic' },
    { emoji: '😴', name: 'Sleepy' }
  ];
  
  return (
    <div className="grid grid-cols-4 gap-3">
      {moods.map(mood => (
        <motion.button
          key={mood.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedMood(mood.name)}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            selectedMood === mood.name 
              ? 'border-[#3c3abe] bg-[#3c3abe]/20' 
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          }`}
        >
          <span className="text-2xl mb-1">{mood.emoji}</span>
          <span className="text-xs">{mood.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

// Cover Art Viewer Component
const CoverArtViewer = ({ coverImage, regenerateCover }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-48 h-48 rounded-lg bg-white/5 overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt="Cover Art" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImagePlus size={32} className="text-white/40" />
            </div>
          )}
        </div>
        
        {coverImage && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={regenerateCover}
            className="absolute bottom-2 right-2 h-8 w-8 bg-[#3c3abe] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <RefreshCw size={16} className="text-white" />
          </motion.button>
        )}
      </div>
      
      {coverImage && (
        <button 
          onClick={regenerateCover}
          className="mt-3 text-sm text-[#3c3abe] flex items-center gap-1"
        >
          <RefreshCw size={14} />
          <span>Regenerate</span>
        </button>
      )}
    </div>
  );
};

// Generated Song Item Component
const SongItem = ({ song, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-3 bg-white/5 rounded-lg flex items-center gap-3 group hover:bg-white/10 transition-colors"
    >
      <div className="h-10 w-10 bg-[#3c3abe]/20 rounded flex items-center justify-center">
        <span className="text-[#3c3abe] font-medium">{index + 1}</span>
      </div>
      
      <div className="flex-1">
        <h4 className="text-white text-sm font-medium">{song.title}</h4>
        <p className="text-gray-400 text-xs">{song.artist}</p>
      </div>
      
      {song.reason && (
        <div className="px-2 py-1 bg-[#3c3abe]/10 rounded text-xs text-[#3c3abe] hidden group-hover:block">
          {song.reason}
        </div>
      )}
    </motion.div>
  );
};

// Main Playlist Builder Page Component
const PlaylistBuilderPage = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [coverImage, setCoverImage] = useState('/api/placeholder/300/300');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSongs, setGeneratedSongs] = useState([]);
  const [activeTab, setActiveTab] = useState('ai'); // 'ai', 'tags', 'mood'
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const fakeSongs = [
        { 
          title: 'Summer Vibes', 
          artist: 'Coastal Dreams', 
          reason: 'Matches your summer theme' 
        },
        { 
          title: 'Ocean Breeze', 
          artist: 'Wave Runners', 
          reason: 'Perfect for beach relaxation' 
        },
        { 
          title: 'Sunset Glow', 
          artist: 'Evening Sky', 
          reason: 'Captures sunset feelings' 
        },
        { 
          title: 'Sandy Shores', 
          artist: 'Beachcomber', 
          reason: 'Beach vibes with chill rhythm' 
        },
        { 
          title: 'Tropical Paradise', 
          artist: 'Island Beats', 
          reason: 'Upbeat summer energy' 
        },
      ];
      
      setGeneratedSongs(fakeSongs);
      setPlaylistName('Beach Sunset Vibes');
      setIsGenerating(false);
    }, 2000);
  };
  
  const regenerateCover = () => {
    // Just update the URL to trigger a new placeholder image
    setCoverImage(`/api/placeholder/300/300?${Math.random()}`);
  };
  
  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-white mb-6">Create Playlist</h1>
      
      <div className="grid md:grid-cols-5 gap-8">
        {/* Left Column */}
        <div className="md:col-span-3">
          {/* Method Tabs */}
          <div className="flex border-b border-white/10 mb-6">
            <button 
              onClick={() => setActiveTab('ai')}
              className={`pb-3 px-4 ${activeTab === 'ai' ? 'border-b-2 border-[#3c3abe] text-white' : 'text-gray-400'}`}
            >
              AI Prompt
            </button>
            <button 
              onClick={() => setActiveTab('tags')}
              className={`pb-3 px-4 ${activeTab === 'tags' ? 'border-b-2 border-[#3c3abe] text-white' : 'text-gray-400'}`}
            >
              By Tags
            </button>
            <button 
              onClick={() => setActiveTab('mood')}
              className={`pb-3 px-4 ${activeTab === 'mood' ? 'border-b-2 border-[#3c3abe] text-white' : 'text-gray-400'}`}
            >
              By Mood
            </button>
          </div>
          
          {/* Generator Forms */}
          <div className="mb-8">
            {activeTab === 'ai' && (
              <div>
                <PlaylistPromptInput 
                  prompt={prompt} 
                  setPrompt={setPrompt} 
                  onGenerate={handleGenerate}
                />
              </div>
            )}
            
            {activeTab === 'tags' && (
              <div>
                <h3 className="text-white font-medium mb-3">Select Tags</h3>
                <TagSelector 
                  selectedTags={selectedTags} 
                  setSelectedTags={setSelectedTags} 
                />
                <div className="mt-4">
                  <button 
                    onClick={handleGenerate}
                    disabled={selectedTags.length === 0}
                    className={`px-4 py-2 rounded-lg ${
                      selectedTags.length > 0 
                        ? 'bg-[#3c3abe] text-white hover:bg-[#3c3abe]/80' 
                        : 'bg-white/10 text-gray-400'
                    } transition-colors`}
                  >
                    Generate with Tags
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'mood' && (
              <div>
                <h3 className="text-white font-medium mb-3">Select Mood</h3>
                <MoodPicker 
                  selectedMood={selectedMood} 
                  setSelectedMood={setSelectedMood} 
                />
                <div className="mt-4">
                  <button 
                    onClick={handleGenerate}
                    disabled={!selectedMood}
                    className={`px-4 py-2 rounded-lg ${
                      selectedMood 
                        ? 'bg-[#3c3abe] text-white hover:bg-[#3c3abe]/80' 
                        : 'bg-white/10 text-gray-400'
                    } transition-colors`}
                  >
                    Generate with Mood
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Results */}
          {isGenerating ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={32} className="text-[#3c3abe]" />
                </motion.div>
              </div>
              <p className="text-white">Generating your playlist...</p>
            </div>
          ) : generatedSongs.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Generated Songs</h3>
                <button className="text-sm text-[#3c3abe]">Regenerate List</button>
              </div>
              
              <div className="space-y-2">
                {generatedSongs.map((song, index) => (
                  <SongItem key={index} song={song} index={index} />
                ))}
              </div>
              
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-[#3c3abe] text-white rounded-lg hover:bg-[#3c3abe]/90 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>Save Playlist</span>
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column */}
        <div className="md:col-span-2">
          <div className="bg-white/5 rounded-xl p-6 sticky top-20">
            <h3 className="text-white font-medium mb-4">Playlist Details</h3>
            
            {/* Playlist Name */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Playlist Name</label>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Give your playlist a name"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3c3abe] focus:border-transparent"
              />
            </div>
            
            {/* Cover Art */}
            <div className="flex flex-col items-center">
              <label className="block text-gray-400 text-sm mb-3">Cover Art</label>
              <CoverArtViewer 
                coverImage={coverImage} 
                regenerateCover={regenerateCover} 
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistBuilderPage;