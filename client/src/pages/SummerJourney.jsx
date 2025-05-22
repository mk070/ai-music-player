import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'recharts';
import { Play, Calendar, PlusCircle, ChevronLeft, ChevronRight, Share2, Heart, Music, Sun } from 'lucide-react';

// Lenis will be imported and initialized in the useEffect

// Register Chart.js components
Chart.register(...registerables);

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Sample data for demo purposes
const sampleYears = [2021, 2022, 2023, 2024, 2025];
const sampleMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const sampleMemories = [
  {
    id: 1,
    date: 'August 2023',
    coverImage: '/api/placeholder/400/240',
    title: 'Beach Trip to Malibu',
    mood: 'Energetic',
    location: 'Malibu, CA',
    friends: ['Alex', 'Jamie', 'Taylor'],
    songs: [
      { title: 'Summer Days', artist: 'Martin Garrix' },
      { title: 'I Like You', artist: 'Post Malone' },
      { title: 'As It Was', artist: 'Harry Styles' }
    ]
  },
  {
    id: 2,
    date: 'July 2023',
    coverImage: '/api/placeholder/400/240',
    title: 'Cabin Retreat',
    mood: 'Relaxed',
    location: 'Lake Tahoe',
    friends: ['Morgan', 'Casey'],
    songs: [
      { title: 'Sunroof', artist: 'Nicky Youre' },
      { title: 'Late Night Talking', artist: 'Harry Styles' },
      { title: 'About Damn Time', artist: 'Lizzo' }
    ]
  },
  {
    id: 3,
    date: 'June 2024',
    coverImage: '/api/placeholder/400/240',
    title: 'Backyard BBQ',
    mood: 'Happy',
    location: 'Home',
    friends: ['Jordan', 'Riley', 'Quinn'],
    songs: [
      { title: 'Die With A Smile', artist: 'Lady Gaga & Bruno Mars' },
      { title: 'Please Please Please', artist: 'Sabrina Carpenter' },
      { title: 'Good Luck, Babe!', artist: 'Chappell Roan' }
    ]
  }
];

const sampleAISuggestions = [
  {
    id: 1,
    text: "You listened to chill music a lot in August 2023. Was that your hill trip?",
    coverImage: '/api/placeholder/400/240',
    suggestedMood: 'Relaxed',
    suggestedSongs: ['Sunroof', 'Late Night Talking']
  },
  {
    id: 2,
    text: "These energetic songs from July seem like they were from a beach day. Create this memory?",
    coverImage: '/api/placeholder/400/240',
    suggestedMood: 'Energetic',
    suggestedSongs: ['Summer Days', 'First Person Shooter']
  }
];

const moodData = [
  { month: 'May', Happy: 3, Energetic: 5, Relaxed: 2, Nostalgic: 1 },
  { month: 'Jun', Happy: 5, Energetic: 4, Relaxed: 3, Nostalgic: 2 },
  { month: 'Jul', Happy: 4, Energetic: 6, Relaxed: 5, Nostalgic: 1 },
  { month: 'Aug', Happy: 6, Energetic: 3, Relaxed: 7, Nostalgic: 4 },
  { month: 'Sep', Happy: 2, Energetic: 1, Relaxed: 4, Nostalgic: 6 }
];

const SummerJourney = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [activeMemories, setActiveMemories] = useState(sampleMemories);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('memories');
  const [typewriterText, setTypewriterText] = useState('');
  const [isTypewriterComplete, setIsTypewriterComplete] = useState(false);
  
  const timelineRef = useRef(null);
  const memoriesRef = useRef(null);
  const aiSuggestionsRef = useRef(null);
  const lenisRef = useRef(null);

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    // Only run this on the client side
    if (typeof window === 'undefined') return;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: 'vertical',
      smoothTouch: false,
      touchMultiplier: 1.5
    });

    // Store the Lenis instance
    lenisRef.current = lenis;

    // Sync with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    
    // Add raf to update Lenis on each frame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    // Improve performance
    gsap.ticker.lagSmoothing(0);
    
    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      gsap.ticker.remove((time) => {
        if (lenisRef.current) lenisRef.current.raf(time * 1000);
      });
    };
  }, []);

  // Timeline scroll animation
  useEffect(() => {
    if (timelineRef.current) {
      gsap.fromTo(
        '.timeline-year',
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out"
        }
      );
    }
  }, []);

  // Memory cards animations
  useEffect(() => {
    if (memoriesRef.current) {
      gsap.fromTo(
        '.memory-card',
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: memoriesRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, [activeTab]);

  // AI Suggestions animations with typewriter effect
  useEffect(() => {
    if (aiSuggestionsRef.current && activeTab === 'ai') {
      // Animate cards
      gsap.fromTo(
        '.ai-card',
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.2,
          duration: 0.8,
          ease: "back.out(1.7)",
        }
      );

      // Typewriter effect for the first AI suggestion
      const text = sampleAISuggestions[0].text;
      let i = 0;
      setTypewriterText('');
      setIsTypewriterComplete(false);
      
      const typewriterInterval = setInterval(() => {
        if (i < text.length) {
          setTypewriterText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typewriterInterval);
          setIsTypewriterComplete(true);
        }
      }, 30);

      return () => clearInterval(typewriterInterval);
    }
  }, [activeTab]);

  // Filter memories based on selected year and month
  useEffect(() => {
    // In a real app, this would filter from a larger dataset
    // For demo, we're just simulating filtering
    setActiveMemories(sampleMemories.filter(memory => 
      memory.date.includes(selectedYear.toString()) || 
      memory.date.includes(selectedMonth)
    ));
  }, [selectedYear, selectedMonth]);

  const handleYearClick = (year) => {
    setSelectedYear(year);
    
    // Scroll animation for year selection
    gsap.to('.timeline-year', {
      scale: function(i, target) {
        return target.textContent === year.toString() ? 1.2 : 1;
      },
      fontWeight: function(i, target) {
        return target.textContent === year.toString() ? "700" : "400";
      },
      color: function(i, target) {
        return target.textContent === year.toString() ? "#3c3abe" : "#c4c4c4";
      },
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-[#c4c4c4] font-['Rubik',sans-serif] pb-20 overflow-x-hidden">
      {/* Main Content Area */}
      <div className="px-8 py-6 lenis-content">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#fcfcff] mb-2">Summer Journey</h1>
          <p className="text-[#c4c4c4]">Relive your summer memories through music, moods, and visuals</p>
        </header>
        
        {/* Timeline Selector */}
        <div className="mb-10" ref={timelineRef}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#fcfcff]">Timeline</h2>
          </div>
          
          <div className="flex space-x-6 mb-4">
            {sampleYears.map(year => (
              <button
                key={year}
                className={`timeline-year px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedYear === year ? 'bg-[#3c3abe] text-white font-medium' : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => handleYearClick(year)}
              >
                {year}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
            {sampleMonths.map(month => (
              <button
                key={month}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  selectedMonth === month ? 'bg-[#3c3abe]/20 text-[#3c3abe] font-medium' : 'hover:bg-gray-800'
                }`}
                onClick={() => handleMonthClick(month)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center bg-gray-800 rounded-lg p-1 mb-8 w-full max-w-md">
          <button 
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
              activeTab === 'memories' ? 'bg-[#3c3abe] text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('memories')}
          >
            <div className="flex flex-col items-center">
              <Calendar size={20} />
              <span className="text-xs mt-1">Memories</span>
            </div>
          </button>
          
          <button 
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
              activeTab === 'mood' ? 'bg-[#3c3abe] text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('mood')}
          >
            <div className="flex flex-col items-center">
              <Heart size={20} />
              <span className="text-xs mt-1">Mood</span>
            </div>
          </button>
          
          <button 
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
              activeTab === 'ai' ? 'bg-[#3c3abe] text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('ai')}
          >
            <div className="flex flex-col items-center">
              <Music size={20} />
              <span className="text-xs mt-1">AI</span>
            </div>
          </button>
        </div>
        
        {/* Content Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'memories' && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              ref={memoriesRef}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#fcfcff]">Memory Entries</h2>
                <button className="bg-[#3c3abe] hover:bg-[#3c3abe]/80 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300">
                  <PlusCircle size={18} />
                  <span>New Memory</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeMemories.map(memory => (
                  <motion.div
                    key={memory.id}
                    className="memory-card bg-[#fcfcff] rounded-xl overflow-hidden shadow-lg"
                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  >
                    <div className="relative h-48">
                      <img src={memory.coverImage} alt={memory.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <span className="text-white font-medium">{memory.date}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 text-[#07070d]">
                      <h3 className="font-bold text-lg mb-2">{memory.title}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {memory.mood}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {memory.location}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Friends</h4>
                        <div className="flex flex-wrap gap-1">
                          {memory.friends.map((friend, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {friend}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-3">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Top Songs</h4>
                        <ul className="space-y-1">
                          {memory.songs.map((song, i) => (
                            <li key={i} className="text-sm flex justify-between">
                              <span>{song.title}</span>
                              <span className="text-gray-500">{song.artist}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <button className="flex items-center space-x-1 text-[#3c3abe] hover:text-[#3c3abe]/80 transition-colors">
                          <Play size={16} />
                          <span className="text-sm font-medium">Play All</span>
                        </button>
                        
                        <button className="text-gray-500 hover:text-[#3c3abe] transition-colors">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Add New Memory Card */}
                <motion.div
                  className="memory-card bg-[#3c3abe]/10 border-2 border-dashed border-[#3c3abe]/30 rounded-xl flex flex-col items-center justify-center h-80 cursor-pointer"
                  whileHover={{ scale: 1.03, borderColor: '#3c3abe', transition: { duration: 0.3 } }}
                >
                  <div className="bg-[#3c3abe]/20 p-4 rounded-full mb-4">
                    <PlusCircle size={32} className="text-[#3c3abe]" />
                  </div>
                  <p className="text-[#3c3abe] font-medium">Add New Memory</p>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#fcfcff]">Mood History</h2>
                <p className="text-[#c4c4c4]">Track how your mood changes throughout summer</p>
              </div>
              
              <div className="bg-[#fcfcff] p-6 rounded-xl shadow-lg mb-8">
                <h3 className="text-[#07070d] font-medium mb-6">Mood Distribution (2024)</h3>
                <div className="h-64">
                  {/* Chart visualization using Recharts */}
                  <div className="w-full h-full flex items-end justify-between">
                    {moodData.map((entry, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="flex h-52 space-x-1">
                          <div 
                            className="w-4 bg-green-400 rounded-t-md mood-bar" 
                            style={{ height: `${entry.Happy * 8}%` }}
                          />
                          <div 
                            className="w-4 bg-yellow-400 rounded-t-md mood-bar" 
                            style={{ height: `${entry.Energetic * 8}%` }}
                          />
                          <div 
                            className="w-4 bg-blue-400 rounded-t-md mood-bar" 
                            style={{ height: `${entry.Relaxed * 8}%` }}
                          />
                          <div 
                            className="w-4 bg-purple-400 rounded-t-md mood-bar" 
                            style={{ height: `${entry.Nostalgic * 8}%` }}
                          />
                        </div>
                        <p className="text-[#07070d] text-sm mt-2">{entry.month}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center space-x-6 mt-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm text-[#07070d]">Happy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-sm text-[#07070d]">Energetic</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-sm text-[#07070d]">Relaxed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                    <span className="text-sm text-[#07070d]">Nostalgic</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#fcfcff] p-6 rounded-xl shadow-lg">
                <h3 className="text-[#07070d] font-medium mb-4">Mood Insights</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-blue-800">You were mostly relaxed in August. This correlates with your beach trips and nature walks.</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-yellow-800">Your energy peaks in July with outdoor activities and festivals.</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-purple-800">Nostalgic feelings increase in September as summer ends.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              ref={aiSuggestionsRef}
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#fcfcff]">AI-Suggested Memories</h2>
                <p className="text-[#c4c4c4]">We've analyzed your listening habits to suggest memories you might want to create</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sampleAISuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    className="ai-card bg-[#fcfcff] rounded-xl overflow-hidden shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="relative h-48">
                      <img src={suggestion.coverImage} alt="AI Suggested Memory" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div className="bg-[#3c3abe]/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                          AI Suggestion
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 text-[#07070d]">
                      <div className="min-h-16 mb-4">
                        {index === 0 ? (
                          <p className="relative after:content-[''] after:inline-block after:w-1 after:h-5 after:bg-[#3c3abe] after:animate-blink after:ml-1">
                            {typewriterText}
                          </p>
                        ) : (
                          <p>{suggestion.text}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {suggestion.suggestedMood}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Suggested Songs:</h4>
                        <ul className="space-y-1">
                          {suggestion.suggestedSongs.map((song, i) => (
                            <li key={i} className="text-sm flex items-center">
                              <Music size={14} className="mr-2 text-gray-400" />
                              <span>{song}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex space-x-3 mt-4">
                        <button className="flex-1 bg-[#3c3abe] hover:bg-[#3c3abe]/90 text-white py-2 rounded-lg transition-colors">
                          Create Memory
                        </button>
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg transition-colors">
                          Skip
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Relive a Day Feature Card */}
                <motion.div
                  className="ai-card col-span-1 lg:col-span-2 bg-gradient-to-r from-[#3c3abe] to-[#6563ee] rounded-xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">Relive a Day</h3>
                    <p className="mb-6 opacity-90">
                      Experience your memories as a story with synchronized music, photos, and notes.
                    </p>
                    
                    <div className="flex space-x-6">
                      <div className="flex-1 bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                        <h4 className="font-medium mb-3">July 4th Weekend</h4>
                        <p className="text-sm opacity-80 mb-4">
                          Beachside bonfire with friends, featuring sunset views and acoustic music
                        </p>
                        <button className="bg-white text-[#3c3abe] px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                          Play Memory
                        </button>
                      </div>
                      
                      <div className="flex-1 bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                        <h4 className="font-medium mb-3">Road Trip - August</h4>
                        <p className="text-sm opacity-80 mb-4">
                          Driving along the coast with your favorite summer playlist and scenic stops
                        </p>
                        <button className="bg-white text-[#3c3abe] px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                          Play Memory
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Mood Reflection Popup - Conditionally rendered */}
              {isTypewriterComplete && (
                <motion.div
                  className="fixed bottom-8 right-8 max-w-sm bg-white rounded-xl shadow-xl overflow-hidden"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 py-3 px-4">
                    <h4 className="text-white font-medium">Mood Reflection</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800 mb-4">
                      You were mostly chill last summer – would you like a calming playlist for this year?
                    </p>
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-[#3c3abe] hover:bg-[#3c3abe]/90 text-white py-2 rounded-lg transition-colors text-sm">
                        Generate Playlist
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 py-2 text-sm">
                        Maybe Later
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SummerJourney;