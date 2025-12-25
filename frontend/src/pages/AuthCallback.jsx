import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import showToast from '../utils/toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash (Supabase OAuth callback)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          showToast.error('Authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        if (session?.user) {
          showToast.success('Welcome! Login successful 🎉');
          
          // Check if user has completed farmer registration
          const metadata = session.user.user_metadata || {};
          const farmerProfile = metadata.farmer_profile || {};
          
          if (farmerProfile.profile_completed) {
            setMessage('Redirecting to dashboard...');
            navigate('/dashboard');
          } else {
            // New user or profile not completed - redirect to registration
            setMessage('Setting up your profile...');
            showToast.info('Please complete your farmer profile to get started');
            navigate('/registration');
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        showToast.error('Something went wrong. Please try again.');
        navigate('/login');
      }
    };

    // Small delay to ensure URL hash is processed
    setTimeout(handleAuthCallback, 500);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-[#292929] rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-[#292929] mb-2">{message}</h2>
        <p className="text-neutral-500">Please wait while we set things up...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
