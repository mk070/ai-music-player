import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from '@react-oauth/google';
import api from '../utils/api';

const AuthForm = ({ type = 'login' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useMusicPlayer();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const validateForm = () => {
    if (type === 'signup') {
      if (!name.trim()) {
        setError('Name is required');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }
    
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const url = type === 'login' ? `${api}/auth/login` : `${api}/auth/register`;
      const payload = type === 'login' 
        ? { email, password }
        : { name, email, password };
      
      const response = await api.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // Important for cookies
      });
      
      const { token, user } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Update the auth state
      login(user);
      
      // Show success message
      toast.success(
        type === 'login' ? 'Login successful!' : 'Account created successfully!',
        { position: 'top-right' }
      );
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         'An error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      
      // Send the credential to your backend
      const response = await api.post(
        `/auth/google`,
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );
      
      const { token, user } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Update the auth state
      login(user);
      
      // Show success message
      toast.success('Google login successful!', { position: 'top-right' });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         'Google login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleError = () => {
    setError('Google sign in failed');
    toast.error('Failed to sign in with Google', { position: 'top-right' });
  };
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#fcfcff] mb-2">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-text-light">
          {type === 'login' 
            ? 'Sign in to rediscover your summer beats' 
            : 'Create an account to start your summer memory journey'}
        </p>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {type === 'signup' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-light mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-text-dark" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                className="input-field pl-10 w-full"
                placeholder="John Doe"
                aria-label="Full Name"
                disabled={loading}
              />
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-light mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={16} className="text-text-dark" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="input-field pl-10 w-full"
              placeholder="your@email.com"
              aria-label="Email"
              disabled={loading}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-text-light">
              Password
            </label>
            {type === 'login' && (
              <a href="/forgot-password" className="text-xs text-accent hover:text-accent-light">
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={16} className="text-text-dark" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="input-field pl-10 w-full"
              placeholder="••••••••"
              aria-label="Password"
              disabled={loading}
            />
          </div>
        </div>
        
        {type === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-light mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-text-dark" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                className="input-field pl-10 w-full"
                placeholder="••••••••"
                aria-label="Confirm Password"
                disabled={loading}
              />
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          className={`w-full bg-accent hover:bg-accent-light text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          aria-label={type === 'login' ? 'Sign in' : 'Sign up'}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              {type === 'login' ? 'Signing In...' : 'Creating Account...'}
            </>
          ) : (
            <>
              {type === 'login' ? 'Sign In' : 'Sign Up'}
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[#0f0f16] text-text-light">Or continue with</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            text={type === 'login' ? 'signin_with' : 'signup_with'}
            shape="pill"
            width="300"
            useOneTap
          />
        </div>
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