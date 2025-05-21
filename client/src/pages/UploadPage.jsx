import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Loader, Music, PlusCircle, Check } from 'lucide-react';

// Tag Input Component
const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue) {
      if (!tags.includes(inputValue)) {
        setTags([...tags, inputValue]);
      }
      setInputValue('');
      e.preventDefault();
    }
  };
  
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <motion.div 
            key={tag}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-[#3c3abe]/20 border border-[#3c3abe] text-white px-3 py-1 rounded-full flex items-center gap-1"
          >
            <span>{tag}</span>
            <button 
              onClick={() => removeTag(tag)}
              className="h-4 w-4 flex items-center justify-center rounded-full bg-white/20"
            >
              <X size={10} />
            </button>
          </motion.div>
        ))}
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags (press Enter)"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3c3abe] focus:border-transparent"
        />
        <button 
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={() => {
            if (inputValue && !tags.includes(inputValue)) {
              setTags([...tags, inputValue]);
              setInputValue('');
            }
          }}
        >
          <PlusCircle size={18} className="text-[#3c3abe]" />
        </button>
      </div>
    </div>
  );
};

// Mood Selector Component
const MoodSelector = ({ selectedMood, setSelectedMood }) => {
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

// Toggle Switch Component
const ToggleSwitch = ({ enabled, setEnabled, label }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white">{label}</span>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
          enabled ? 'bg-[#3c3abe]' : 'bg-white/20'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

// Upload Card Component
const UploadCard = ({ file, setFile }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(100);
        }, 500);
      }
      setUploadProgress(progress);
    }, 200);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <motion.div 
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
        isDragging 
          ? 'border-[#3c3abe] bg-[#3c3abe]/10' 
          : file 
            ? 'border-green-500/50 bg-green-500/10' 
            : 'border-white/20 bg-white/5'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files[0])}
      />
      
      {!file ? (
        <div className="py-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <Upload size={32} className="text-[#3c3abe]" />
          </div>
          
          <h3 className="text-white text-lg font-medium mb-2">Upload Music</h3>
          <p className="text-gray-400 mb-6">Drag and drop your audio files here, or click to browse</p>
          
          <button 
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-[#3c3abe] text-white rounded-lg hover:bg-[#3c3abe]/80 transition-colors"
          >
            Browse Files
          </button>
        </div>
      ) : isUploading ? (
        <div className="py-8">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 relative">
            <svg className="w-16 h-16 absolute" viewBox="0 0 100 100">
              <circle
                className="text-white/10"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
                r="44"
                cx="50"
                cy="50"
              />
              <circle
                className="text-[#3c3abe]"
                strokeWidth="6"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="44"
                cx="50"
                cy="50"
                strokeDasharray="276.5"
                strokeDashoffset={276.5 * (1 - uploadProgress / 100)}
              />
            </svg>
            <span className="text-white text-sm font-medium">{Math.round(uploadProgress)}%</span>
          </div>
          
          <h3 className="text-white text-lg font-medium mb-2">Uploading...</h3>
          <p className="text-gray-400">{file.name}</p>
        </div>
      ) : (
        <div className="py-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <Check size={32} className="text-green-500" />
          </div>
          
          <h3 className="text-white text-lg font-medium mb-2">Upload Complete</h3>
          <p className="text-gray-400 mb-4">{file.name}</p>
          
          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => setFile(null)}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Memory Input Component
const MemoryInput = ({ memory, setMemory }) => {
  return (
    <div className="w-full">
      <textarea
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
        placeholder="What memory does this song bring back? (optional)"
        className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3c3abe] focus:border-transparent resize-none"
      ></textarea>
    </div>
  );
};

// Main Upload Page Component
const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [memory, setMemory] = useState('');
  
  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-white mb-6">Upload Music</h1>
      
      <div className="grid gap-8">
        {/* Upload Area */}
        <UploadCard file={file} setFile={setFile} />
        
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="grid gap-6">
              {/* Tags */}
              <div>
                <h3 className="text-white font-medium mb-3">Tags</h3>
                <TagInput tags={tags} setTags={setTags} />
              </div>
              
              {/* Mood */}
              <div>
                <h3 className="text-white font-medium mb-3">How does this song make you feel?</h3>
                <MoodSelector selectedMood={selectedMood} setSelectedMood={setSelectedMood} />
              </div>
              
              {/* Memory */}
              <div>
                <h3 className="text-white font-medium mb-3">Memory</h3>
                <MemoryInput memory={memory} setMemory={setMemory} />
              </div>
              
              {/* AI Toggle */}
              <ToggleSwitch 
                enabled={useAI} 
                setEnabled={setUseAI} 
                label="Let AI Fill My Memory"
              />
              
              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-[#3c3abe] text-white rounded-lg hover:bg-[#3c3abe]/90 transition-colors font-medium"
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UploadPage;