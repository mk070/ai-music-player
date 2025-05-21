import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const AuthForm = ({ type = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useMusicPlayer();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (type === 'login' && !password) {
      setError('Password is required');
      return;
    }
    
    if (type === 'signup') {
      // Simulating magic link signup
      alert(`A magic link has been sent to ${email}`);
      return;
    }
    
    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 bg-navy-dark rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-content mb-2">
          {type === 'login' ? 'Welcome Back' : 'Join ReverBeat'}
        </h2>
        <p className="text-text-light">
          {type === 'login' 
            ? 'Sign in to rediscover your summer beats' 
            : 'Create an account to start your summer memory journey'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-text-light mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={16} className="text-text-dark" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="your@email.com"
              aria-label="Email"
            />
          </div>
        </div>
        
        {type === 'login' && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-text-light">
                Password
              </label>
              <a href="#forgot" className="text-xs text-accent hover:text-accent-light">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-text-dark" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                aria-label="Password"
              />
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
        )}
        
        <button 
          type="submit" 
          className="w-full btn btn-primary py-3 flex items-center justify-center"
          aria-label={type === 'login' ? 'Sign in' : 'Sign up'}
        >
          <span>{type === 'login' ? 'Sign in' : 'Send Magic Link'}</span>
          <ArrowRight size={16} className="ml-2" />
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-text">
          {type === 'login' 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <a 
            href={type === 'login' ? '/signup' : '/login'}
            className="text-accent hover:text-accent-light font-medium"
            onClick={(e) => {
              e.preventDefault();
              navigate(type === 'login' ? '/signup' : '/login');
            }}
          >
            {type === 'login' ? 'Sign up' : 'Sign in'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;