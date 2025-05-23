import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
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
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistViewPage from './pages/PlaylistViewPage';
import FavoritesPage from './pages/FavoritesPage';    
import NewMemoryPage from './pages/NewMemoryPage';
function App() {
  // Replace with your actual Google OAuth client ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="h-full flex flex-col">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
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
                <Route path="/favorites" element={
                  <PrivateRoute>
                    <FavoritesPage />
                  </PrivateRoute>
                } />
                <Route path="/playlists" element={
                  <PrivateRoute>
                    <PlaylistsPage />
                  </PrivateRoute>
                } />
                <Route path="/playlists-builder" element={
                  <PrivateRoute>
                    <PlaylistBuilder />
                  </PrivateRoute>
                } />
                <Route path="/playlists/:playlistId" element={
                  <PrivateRoute>
                    <PlaylistViewPage />
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
                <Route path="/memories/new" element={
                  <PrivateRoute>
                    <NewMemoryPage />
                  </PrivateRoute>
                } />
              </Route>
            </Routes>
          </MusicPlayerProvider>
        </ErrorBoundary>
        </Router>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;