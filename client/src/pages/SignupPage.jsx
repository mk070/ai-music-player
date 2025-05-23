import React, { useEffect, useRef, useState } from 'react';
import AuthForm from '../components/AuthForm';
import { Headphones, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SignupPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Mark as loaded to trigger animations
    setIsLoaded(true);
    
    // Set initial styles before animation
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0 });
    }
    if (contentRef.current) {
      gsap.set(contentRef.current, { y: 30, opacity: 0 });
    }
    
    // Create animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        console.log('Animation complete');
      }
    });

    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    })
    .to(contentRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4');
    
    return () => {
      tl.kill(); // Kill the timeline on unmount
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`min-h-screen flex items-center justify-center p-4 py-8 md:p-8 bg-gradient-to-br from-navy to-navy-dark overflow-y-auto transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="fixed inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-dark overflow-hidden">
        {/* Circular gradient accent */}
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent opacity-5 blur-3xl rounded-full transform -translate-x-1/4 translate-y-1/4"></div>
      </div>
      
      <div 
        ref={contentRef}
        className={`relative bg-navy-dark/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl mb-8 mt-12 pt-10 flex flex-col md:flex-row transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
          <div className="w-full max-w-md">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-text-light hover:text-accent mb-6 transition-colors group"
            >
              <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-content mb-2">Create Account</h1>
            <p className="text-text-light mb-6">Join ReverBeat and start your musical journey</p>
            <AuthForm type="signup" />
          </div>
        </div>
        
        <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-accent-dark to-accent flex flex-col justify-between">
          <div className="flex items-center mb-12">
            <div className="bg-content/10 rounded-full p-3 mr-3 backdrop-blur-sm">
              <Headphones size={24} className="text-content" />
            </div>
            <span className="text-content font-bold text-xl">ReverBeat</span>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-content mb-4">
              Start your musical journey today
            </h2>
            <p className="text-content/80 mb-8">
              Join thousands of music lovers creating the soundtrack to their summer memories.
            </p>
            
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${i === 2 ? 'w-16 bg-content/50' : 'w-4 bg-content/30'}`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-content/80 text-sm">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-content hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;