import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage.tsx';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import OCRFeaturePage from './pages/OCRFeaturePage';
import TranslationFeaturePage from './pages/TranslationFeaturePage';
import DatabaseFeaturePage from './pages/DatabaseFeaturePage';
import FarmerRegistrationPage from './pages/FarmerRegistrationPage';
import ProfilePage from './pages/ProfilePage';
import AuthCallback from './pages/AuthCallback';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DisputedLandsPage from './pages/DisputedLandsPage';
import LoadingScreen from './components/LoadingScreen';

// Wrapper component to handle route changes and animations
const AppContent = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/features/ocr" element={<OCRFeaturePage />} />
        <Route path="/features/translation" element={<TranslationFeaturePage />} />
        <Route path="/features/database" element={<DatabaseFeaturePage />} />
        <Route path="/disputed-lands" element={<DisputedLandsPage />} />
        <Route path="/registration" element={<FarmerRegistrationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#292929',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px 20px',
          },
        }}
      />
      <AppContent />
    </Router>
  );
}

export default App;
