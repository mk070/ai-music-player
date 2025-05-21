import React, { useEffect, useRef, useState } from 'react';
import AuthForm from '../components/AuthForm';
import { Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LoginPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
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
        setAnimationComplete(true);
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
    }, '-=0.4'); // Start this animation 0.4s before the previous one ends
    
    return () => {
      tl.kill(); // Kill the timeline on unmount
    };
  }, []);
  
  // Remove the loading state check to see the animation
  // The animation will still run, but we won't block rendering

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-gradient-to-br from-navy to-navy-dark overflow-hidden"
    >
      <div 
        ref={contentRef}
        className="bg-navy-dark rounded-2xl overflow-hidden shadow-xl max-w-4xl w-full flex flex-col md:flex-row"
      >
        <div className="md:w-1/2 p-8 md:p-10 bg-gradient-to-br from-accent-dark to-accent hidden md:flex flex-col justify-between">
          <div className="flex items-center mb-12">
            <div className="bg-content/10 rounded-full p-3 mr-3">
              <Headphones size={24} className="text-content" />
            </div>
            <span className="text-content font-bold text-xl">ReverBeat</span>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-content mb-4">
              Your summer memories deserve a soundtrack
            </h2>
            <p className="text-content/80 mb-8">
              Create playlists that capture the essence of your summer experiences and relive them whenever you want.
            </p>
            
            <div className="flex space-x-2">
              <div className="h-1 w-16 bg-content rounded-full opacity-50"></div>
              <div className="h-1 w-4 bg-content rounded-full opacity-30"></div>
              <div className="h-1 w-4 bg-content rounded-full opacity-30"></div>
            </div>
          </div>
          
          <div className="mt-auto">
            <button 
              onClick={() => navigate('/')}
              className="text-content/70 hover:text-content text-sm"
            >
              ← Back to home
            </button>
          </div>
        </div>
        
        <div className="md:w-1/2 flex items-center justify-center p-6 md:p-10">
          <AuthForm type="login" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;