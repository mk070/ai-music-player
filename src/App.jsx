import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import PlaylistBuilder from './pages/PlaylistBuilder';
import SummerJourney from './pages/SummerJourney';
import UploadPage from './pages/UploadPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <MusicPlayerProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/playlists" element={
                <PrivateRoute>
                  <PlaylistBuilder />
                </PrivateRoute>
              } />
              <Route path="/upload" element={
                <PrivateRoute>
                  <UploadPage />
                </PrivateRoute>
              } />
              <Route path="/journey" element={
                <PrivateRoute>
                  <SummerJourney />
                </PrivateRoute>
              } />
            </Route>
          </Routes>
        </MusicPlayerProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;