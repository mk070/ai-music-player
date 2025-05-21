import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const PrivateRoute = ({ children }) => {
  // Temporarily bypass authentication in development
  const isDev = process.env.NODE_ENV === 'development';
  const { isAuthenticated } = useMusicPlayer();
  
  return (isDev || isAuthenticated()) ? children : <Navigate to="/login" />;
};

export default PrivateRoute;