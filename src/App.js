import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { authAPI } from './services/api';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const MatchesPage = lazy(() => import('./pages/MatchesPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));

const AppRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingMatch, setPendingMatch] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (authAPI.isAuthenticated()) {
        try {
          const user = await authAPI.getCurrentUser();
          setCurrentUser(user);
          setIsLoggedIn(true);
          setIsAdmin(user.is_admin || false);
        } catch (error) {
          console.error('Auth check failed:', error);
          authAPI.logout();
        }
      }
    };

    checkAuth();
  }, []);

  const handleBook = (match) => {
    if (!isLoggedIn) {
      // Redirect to login with a popup message
      navigate('/login', { state: { bookingMessage: 'You need to login/register to book a match.' } });
      return;
    }
    // Redirect to payment gateway
    navigate('/payment');
  };

  const handleCancelBooking = (bookingId) => {
    // This is now handled by the Matches component directly
    console.log('Cancel booking:', bookingId);
  };

  const getUserBookings = () => {
    // This is now handled by the Matches component directly
    return [];
  };

  const isUserBooked = (matchId) => {
    // This is now handled by the Matches component directly
    return false;
  };

  const handleShowProfile = () => {
    setShowProfile(true);
  };

  const handleUpdateProfile = (profileData) => {
    setCurrentUser(prev => ({
      ...prev,
      ...profileData
    }));
    setShowProfile(false);
    alert('Profile updated successfully!');
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    setIsAdmin(userData.is_admin || false);
    if (pendingMatch) {
      navigate('/payment');
      setPendingMatch(null);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsAdmin(false);
    authAPI.logout();
    navigate('/');
  };



  const handleUpdateMatch = async (matchId, updatedData) => {
    // This would need to be implemented with the API
    console.log('Update match:', matchId, updatedData);
  };

  return (
    <ErrorBoundary>
      <Navbar 
        isMenuOpen={false} 
        setIsMenuOpen={() => {}} 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onShowProfile={handleShowProfile}
        onLogout={handleLogout}
      />
      
      {showProfile && (
        <Profile 
          user={currentUser} 
          onUpdateProfile={handleUpdateProfile} 
          onBack={() => setShowProfile(false)} 
        />
      )}
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
          <Route 
            path="/matches" 
            element={
              <MatchesPage 
                onBook={handleBook} 
                isAdmin={isAdmin} 
                onUpdateMatch={handleUpdateMatch}
                isLoggedIn={isLoggedIn}
                onCancelBooking={handleCancelBooking}
                getUserBookings={getUserBookings}
                isUserBooked={isUserBooked}
              />
            } 
          />
          <Route 
            path="/testimonials" 
            element={
              <TestimonialsPage 
                isLoggedIn={isLoggedIn} 
                isAdmin={isAdmin}
                currentUser={currentUser}
              />
            } 
          />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App; 