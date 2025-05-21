import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Music, Plus } from 'lucide-react';
import gsap from 'gsap';

// Sample timeline entries
const timelineEntries = [
  {
    id: 1,
    date: "June 15, 2025",
    location: "Malibu Beach",
    title: "Sunset Surfing",
    description: "Caught the perfect wave just as the sun was setting. The sky turned into a canvas of orange and pink.",
    songTitle: "Waves",
    songArtist: "Dean Lewis",
    image: "https://images.pexels.com/photos/1089462/pexels-photo-1089462.jpeg"
  },
  {
    id: 2,
    date: "July 4, 2025",
    location: "Lake Tahoe",
    title: "Independence Day",
    description: "Fireworks over the lake with friends. The reflection on the water doubled the spectacular show.",
    songTitle: "Born in the USA",
    songArtist: "Bruce Springsteen",
    image: "https://images.pexels.com/photos/1191377/pexels-photo-1191377.jpeg"
  },
  {
    id: 3,
    date: "July 28, 2025",
    location: "Highway 1, California",
    title: "Road Trip to Big Sur",
    description: "Windows down, music up. The coastal drive was breathtaking with the ocean on one side and mountains on the other.",
    songTitle: "On The Road Again",
    songArtist: "Willie Nelson",
    image: "https://images.pexels.com/photos/1252500/pexels-photo-1252500.jpeg"
  },
  {
    id: 4,
    date: "August 12, 2025",
    location: "Brooklyn, NY",
    title: "Rooftop Party",
    description: "Dancing under the stars with the Manhattan skyline as our backdrop. An unforgettable summer night.",
    songTitle: "Empire State of Mind",
    songArtist: "Jay-Z ft. Alicia Keys",
    image: "https://images.pexels.com/photos/2549573/pexels-photo-2549573.jpeg"
  }
];

const SummerJourney = () => {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState(timelineEntries);
  const timelineRef = useRef(null);
  const entriesRef = useRef(null);
  const formRef = useRef(null);
  
  useEffect(() => {
    if (timelineRef.current && entriesRef.current) {
      // Initialize horizontal scrolling
      const handleWheel = (e) => {
        if (timelineRef.current) {
          e.preventDefault();
          timelineRef.current.scrollLeft += e.deltaY;
        }
      };
      
      timelineRef.current.addEventListener("wheel", handleWheel);
      
      // Animate entries
      const entryElements = entriesRef.current.children;
      
      gsap.from(entryElements, {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out"
      });
      
      return () => {
        if (timelineRef.current) {
          timelineRef.current.removeEventListener("wheel", handleWheel);
        }
      };
    }
  }, []);
  
  useEffect(() => {
    if (formRef.current && showForm) {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power3.out"
      });
    }
  }, [showForm]);
  
  const handleAddEntry = (e) => {
    e.preventDefault();
    
    // Get form data
    const form = e.target;
    const formData = new FormData(form);
    
    // Create new entry
    const newEntry = {
      id: entries.length + 1,
      date: formData.get("date"),
      location: formData.get("location"),
      title: formData.get("title"),
      description: formData.get("description"),
      songTitle: formData.get("songTitle"),
      songArtist: formData.get("songArtist"),
      image: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg"
    };
    
    // Add to entries
    setEntries([...entries, newEntry]);
    
    // Reset form
    form.reset();
    setShowForm(false);
  };
  
  return (
    <div className="pb-20">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-content mb-2">Summer Journey</h1>
            <p className="text-text-light">Relive your summer memories through music</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center"
            aria-label="Add memory"
          >
            <Plus size={18} className="mr-2" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>
      
      {showForm && (
        <div ref={formRef} className="bg-navy-dark rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-content mb-4">Add New Memory</h2>
          <form onSubmit={handleAddEntry}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-text-light mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="input-field"
                  required
                  aria-label="Date"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-text-light mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="input-field"
                  placeholder="Where did this memory take place?"
                  required
                  aria-label="Location"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-text-light mb-2">
                Memory Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="input-field"
                placeholder="Give your memory a title"
                required
                aria-label="Memory title"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-text-light mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className="input-field"
                placeholder="Describe your memory..."
                required
                aria-label="Description"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="songTitle" className="block text-sm font-medium text-text-light mb-2">
                  Song Title
                </label>
                <input
                  type="text"
                  id="songTitle"
                  name="songTitle"
                  className="input-field"
                  placeholder="What song reminds you of this memory?"
                  required
                  aria-label="Song title"
                />
              </div>
              <div>
                <label htmlFor="songArtist" className="block text-sm font-medium text-text-light mb-2">
                  Artist
                </label>
                <input
                  type="text"
                  id="songArtist"
                  name="songArtist"
                  className="input-field"
                  placeholder="Who performed this song?"
                  required
                  aria-label="Song artist"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                aria-label="Save memory"
              >
                Save Memory
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div 
        ref={timelineRef}
        className="flex overflow-x-auto pb-8 pt-4 scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div 
          ref={entriesRef}
          className="flex space-x-6 px-4"
        >
          {entries.map((entry) => (
            <div 
              key={entry.id}
              className="flex-none w-80 bg-navy-dark rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-48">
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center text-xs text-text-light mb-2">
                    <Calendar size={14} className="mr-1" />
                    <span>{entry.date}</span>
                    <div className="mx-2 h-3 w-px bg-text-light/30"></div>
                    <MapPin size={14} className="mr-1" />
                    <span>{entry.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-content">{entry.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-text-light text-sm mb-4">{entry.description}</p>
                <div className="flex items-center p-3 bg-navy rounded-lg">
                  <div className="mr-3 text-accent">
                    <Music size={20} />
                  </div>
                  <div>
                    <div className="text-content font-medium">{entry.songTitle}</div>
                    <div className="text-text-dark text-xs">{entry.songArtist}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="flex space-x-2">
          {entries.map((entry, index) => (
            <button
              key={entry.id}
              className={`h-2 rounded-full transition-all ${
                index === 0 ? 'w-8 bg-accent' : 'w-4 bg-navy-light'
              }`}
              onClick={() => {
                if (entriesRef.current && entriesRef.current.children[index]) {
                  const element = entriesRef.current.children[index];
                  timelineRef.current.scrollLeft = element.offsetLeft - 40;
                }
              }}
              aria-label={`View memory: ${entry.title}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummerJourney;