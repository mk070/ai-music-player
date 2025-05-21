import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';

const HeroSection = ({ image, title, subtitle, ctaText, ctaAction }) => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  
  useEffect(() => {
    if (heroRef.current && textRef.current) {
      // Create a timeline for the animations
      const tl = gsap.timeline();
      
      // Animate the background
      tl.from(heroRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 1.2,
        ease: 'power3.out'
      });
      
      // Animate the text elements
      tl.from(textRef.current.querySelectorAll('h1, p, button'), {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.8');
      
      // Create the floating effect for the background
      gsap.to(heroRef.current, {
        y: 10,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);
  
  return (
    <div className="relative overflow-hidden rounded-2xl w-full aspect-[21/9] flex items-center justify-center">
      <div 
        ref={heroRef}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={image}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent"></div>
      </div>
      
      <div 
        ref={textRef}
        className="relative z-10 max-w-2xl px-6 md:px-10"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-content mb-4">{title}</h1>
        <p className="text-text-light md:text-lg mb-6">{subtitle}</p>
        <button 
          onClick={ctaAction}
          className="btn btn-primary flex items-center"
          aria-label={ctaText}
        >
          <span>{ctaText}</span>
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;