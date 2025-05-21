import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useMusicPlayer();
  
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;