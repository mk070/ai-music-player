import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Calendar, Plus, X, Music, MapPin, Users, Image as ImageIcon, Clock, Save } from 'lucide-react';

const NewMemoryPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    mood: 'happy',
    location: '',
    friends: '',
    songs: [{ title: '', artist: '' }],
    description: ''
  });

  // Mood options
  const moodOptions = [
    { value: 'happy', label: '😊 Happy' },
    { value: 'excited', label: '🎉 Excited' },
    { value: 'chill', label: '😌 Chill' },
    { value: 'energetic', label: '⚡ Energetic' },
    { value: 'romantic', label: '💖 Romantic' },
    { value: 'nostalgic', label: '🕰️ Nostalgic' },
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle song input changes
  const handleSongChange = (index, e) => {
    const { name, value } = e.target;
    const newSongs = [...formData.songs];
    newSongs[index] = { ...newSongs[index], [name]: value };
    setFormData(prev => ({
      ...prev,
      songs: newSongs
    }));
  };

  // Add new song field
  const addSongField = () => {
    setFormData(prev => ({
      ...prev,
      songs: [...prev.songs, { title: '', artist: '' }]
    }));
  };

  // Remove song field
  const removeSongField = (index) => {
    if (formData.songs.length > 1) {
      const newSongs = formData.songs.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        songs: newSongs
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically make an API call to save the memory
      console.log('Submitting memory:', {
        ...formData,
        friends: formData.friends.split(',').map(friend => friend.trim()).filter(Boolean)
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate back to memories page after successful submission
      navigate('/summer-journey');
    } catch (error) {
      console.error('Error saving memory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy to-navy-dark text-content py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-navy-light/50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-navy-light/30"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-content">Add New Memory</h1>
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-navy-light/30 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cover Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-content/80">Cover Image</label>
              <div className="mt-1 flex items-center">
                <label className="group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-navy-light/30 rounded-xl cursor-pointer hover:border-accent/50 transition-colors">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <ImageIcon className="w-12 h-12 text-accent mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                      <p className="text-sm text-content/60 group-hover:text-content/80">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-content/40 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-content/80 mb-1">
                Memory Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-navy/50 border border-navy-light/30 rounded-lg text-content placeholder-content/40 focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                placeholder="e.g., Summer Beach Party 2023"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-content/80 mb-1">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content/40" size={18} />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-navy/50 border border-navy-light/30 rounded-lg text-content placeholder-content/40 focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Mood */}
              <div>
                <label htmlFor="mood" className="block text-sm font-medium text-content/80 mb-1">
                  Mood
                </label>
                <div className="relative">
                  <select
                    id="mood"
                    name="mood"
                    value={formData.mood}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-navy/50 border border-navy-light/30 rounded-lg text-content focus:ring-2 focus:ring-accent/50 focus:border-transparent appearance-none transition-all"
                  >
                    {moodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-content/80 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content/40" size={18} />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-navy/50 border border-navy-light/30 rounded-lg text-content placeholder-content/40 focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                  placeholder="e.g., Malibu Beach, CA"
                />
              </div>
            </div>

            {/* Friends */}
            <div>
              <label htmlFor="friends" className="block text-sm font-medium text-content/80 mb-1">
                Friends (comma separated)
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content/40" size={18} />
                <input
                  type="text"
                  id="friends"
                  name="friends"
                  value={formData.friends}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-navy/50 border border-navy-light/30 rounded-lg text-content placeholder-content/40 focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                  placeholder="e.g., Alex, Jamie, Taylor"
                />
              </div>
            </div>

            {/* Songs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-content/80">Songs</label>
                <button
                  type="button"
                  onClick={addSongField}
                  className="inline-flex items-center text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  <Plus size={16} className="mr-1" /> Add Song
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.songs.map((song, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content/40" size={16} />
                        <input
                          type="text"
                          name="title"
                          value={song.title}
                          onChange={(e) => handleSongChange(index, e)}
                          className="w-full pl-9 pr-3 py-2 bg-navy/50 border border-navy-light/30 rounded-lg text-sm text-content placeholder-content/40 focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                          placeholder="Song title"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content/40" size={16} />
                        <input
                          type="text"
                          name="artist"
                          value={song.artist}
                          onChange={(e) => handleSongChange(index, e)}
                          className="w-full pl-9 pr-3 py-2 bg-navy/50 border border-navy-light/30 rounded-lg text-sm text-content placeholder-content/40 focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                          placeholder="Artist"
                          required
                        />
                      </div>
                    </div>
                    {formData.songs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSongField(index)}
                        className="p-2 text-content/50 hover:text-red-400 transition-colors"
                        aria-label="Remove song"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-content/80 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-navy/50 border border-navy-light/30 rounded-lg text-content placeholder-content/40 focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                placeholder="Share the story behind this memory..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent/80 text-white font-medium hover:from-accent/90 hover:to-accent/70 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Memory
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NewMemoryPage;
