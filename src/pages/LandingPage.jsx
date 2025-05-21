import React, { useEffect, useRef, useState } from 'react';
import { Music, LogIn, Headphones, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // Simulate navigate function for demo
  
  
  useEffect(() => {
    // Mark as loaded to trigger animations
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    // Create particles effect
    if (particlesRef.current) {
      const particles = particlesRef.current;
      
      // Clear any existing particles
      particles.innerHTML = '';
      
      // Create 80 particles (more than original for denser effect)
      for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        
        // Random size between 2px and 12px
        const size = Math.random() * 10 + 2;
        
        // Randomize opacity for depth effect
        const opacity = Math.random() * 0.3 + 0.1;
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Add particle with tailwind classes
        particle.className = 'absolute rounded-full';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.opacity = opacity;
        particle.style.background = `rgba(255, 255, 255, ${opacity})`;
        
        // Add to container
        particles.appendChild(particle);
        
        // Animate each particle
        animateParticle(particle);
      }
    }
  }, []);
  
  // Function to animate particles
  const animateParticle = (element) => {
    const duration = Math.random() * 20 + 15;
    const xRange = Math.random() * 100 - 50;
    const yRange = Math.random() * 100 - 50;
    
    // Starting position
    let x = 0;
    let y = 0;
    
    // Animation function
    const animate = () => {
      // Calculate next position using sine waves for smooth movement
      const newX = xRange * Math.sin(Date.now() / (duration * 200));
      const newY = yRange * Math.sin(Date.now() / (duration * 300));
      
      // Apply transform
      element.style.transform = `translate(${newX}px, ${newY}px)`;
      
      // Continue animation
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
  };
  
  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-navy-dark overflow-hidden relative">
      {/* Futuristic background with gradient and particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark via-navy to-navy-dark overflow-hidden">
        {/* Particles container */}
        <div ref={particlesRef} className="absolute inset-0 z-0"></div>
        
        {/* Circular gradient accent */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent opacity-5 blur-3xl rounded-full transform -translate-y-1/4 translate-x-1/4"></div>
        
        {/* Bottom accent gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-accent/10 to-transparent"></div>
      </div>
      
      {/* Navbar */}
      <nav className={`relative z-10 px-6 py-6 flex items-center justify-between transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center">
          <Headphones className="text-accent mr-2" size={24} />
          <span className="text-content font-bold text-xl">ReverBeat</span>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          <button className="text-text-light hover:text-accent transition-colors">Features</button>
          <button className="text-text-light hover:text-accent transition-colors">Pricing</button>
          <button className="text-text-light hover:text-accent transition-colors">About</button>
          <button 
            onClick={() => navigate('/login')}
            className="bg-accent/10 hover:bg-accent/20 text-accent rounded-full px-6 py-2 transition-all"
          >
            Log In
          </button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div 
        ref={heroRef} 
        className={`flex-1 flex items-center justify-center px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center rounded-full bg-accent/10 text-accent px-4 py-1 mb-6">
              <span className="mr-2 text-sm">New Release</span>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-content leading-tight">
              Experience <span className="text-accent">ReverBeat</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-light mt-6 mb-8 max-w-lg mx-auto lg:mx-0">
              Relive your summer memories through music. Create, share, and experience the soundtrack of your past and present summers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => navigate('/dashboard')}
                className="group relative overflow-hidden bg-accent text-white rounded-full py-3 px-8 shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all flex items-center justify-center w-full sm:w-auto"
                aria-label="Try Without Sign Up"
              >
                <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <Music size={20} className="mr-2 relative z-10" />
                <span className="relative z-10">Try Without Sign Up</span>
              </button>
              
              <button 
                onClick={() => navigate('/login')}
                className="group relative overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 text-content rounded-full py-3 px-8 hover:bg-white/10 transition-all flex items-center justify-center w-full sm:w-auto"
                aria-label="Sign Up / Log In"
              >
                <LogIn size={20} className="mr-2" />
                <span>Sign Up / Log In</span>
              </button>
            </div>
          </div>
          
          {/* Right content - 3D visual representation */}
          <div className="relative flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Circular audio wave animation */}
              <div className="absolute inset-0 rounded-full border-4 border-accent/30 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-spin" style={{ animationDuration: '15s' }}></div>
              
              {/* Central icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-accent rounded-full p-6 shadow-lg shadow-accent/30">
                  <Headphones size={48} className="text-content" />
                </div>
              </div>
              
              {/* Orbit elements */}
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="absolute w-full h-full rounded-full border border-accent/10 animate-spin"
                  style={{ 
                    animationDuration: `${10 + i * 5}s`,
                    transform: `scale(${1 + i * 0.2})`
                  }}
                >
                  <div 
                    className="absolute w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/30"
                    style={{ 
                      left: `${50 + Math.cos(i * 2) * 50}%`, 
                      top: `${50 + Math.sin(i * 2) * 50}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div 
        ref={featuresRef}
        className={`relative z-10 py-12 px-6 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: <Music size={24} className="text-accent" />, 
                title: "AI-Powered Playlist Creation", 
                description: "Discover your perfect summer soundtrack with our advanced music recommendation algorithms."
              },
              { 
                icon: <Headphones size={24} className="text-accent" />, 
                title: "Immersive Audio Experience", 
                description: "Experience crystal clear sound with our high-definition audio processing technology."
              },
              { 
                icon: <ChevronRight size={24} className="text-accent" />, 
                title: "Seamless Sharing", 
                description: "Share your favorite summer playlists across all social platforms with one click."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-accent opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="bg-navy-dark rounded-full p-3 inline-flex mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-content text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className={`relative z-10 px-6 py-4 border-t border-white/5 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <Headphones className="text-accent mr-2" size={20} />
              <span className="text-content font-bold">ReverBeat</span>
            </div>
            <p className="text-text-light text-sm mt-1">© 2025 ReverBeat. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6">
            <button className="text-text-light text-sm hover:text-accent transition-colors">Terms</button>
            <button className="text-text-light text-sm hover:text-accent transition-colors">Privacy</button>
            <button className="text-text-light text-sm hover:text-accent transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;