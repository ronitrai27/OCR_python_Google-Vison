import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import showToast from '../utils/toast';
import { Loader2, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      showToast.error('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!formData.email) {
      setError('Please enter your email address');
      showToast.error('Please enter your email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      showToast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          },
          emailRedirectTo: `${window.location.origin}/auth-callback`
        },
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          throw new Error('This email is already registered. Please login instead.');
        }
        throw error;
      }

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        showToast.error('This email is already registered. Please login instead.');
        navigate('/login');
      } else if (data?.session) {
        // User is auto-confirmed (no email verification required)
        showToast.success('Account created successfully! 🎉');
        showToast.info('Please complete your farmer profile');
        navigate('/registration');
      } else {
        // Email confirmation required
        showToast.success('Account created! Please check your email to verify.');
        navigate('/login'); 
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      showToast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth-callback`
        }
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
      showToast.error('Google signup failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const benefits = [
    "AI-Powered OCR for Urdu & Hindi",
    "Instant Multi-Language Translation",
    "Secure Cloud Document Storage",
    "Professional PDF Reports"
  ];

  return (
    <div className="min-h-screen flex bg-white text-[#292929]">
      {/* Left Side - Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-1 bg-[#292929] items-center justify-center p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center">
              <span className="text-4xl">🌾</span>
            </div>
          </motion.div>
          
          <h2 className="text-4xl font-bold mb-4">
            Start Your Digital Journey
          </h2>
          <p className="text-lg text-white/80 mb-10">
            Join thousands of organizations modernizing their land records with cutting-edge AI technology.
          </p>
          
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-400" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full relative z-10"
        >
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#292929] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-[#292929]">
              Create Account
            </h1>
            <p className="text-neutral-500">
              Start digitizing your land records today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2"
            >
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#292929] mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input 
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-neutral-200 bg-white focus:border-[#292929] outline-none transition-all text-[#292929] placeholder:text-neutral-400"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#292929] mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input 
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-neutral-200 bg-white focus:border-[#292929] outline-none transition-all text-[#292929] placeholder:text-neutral-400"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#292929] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-neutral-200 bg-white focus:border-[#292929] outline-none transition-all text-[#292929] placeholder:text-neutral-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#292929] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input 
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-neutral-200 bg-white focus:border-[#292929] outline-none transition-all text-[#292929] placeholder:text-neutral-400"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Must be at least 6 characters
              </p>
            </div>

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                required
                className="w-4 h-4 mt-1 rounded border-neutral-300 text-[#292929] focus:ring-2 focus:ring-[#292929] cursor-pointer accent-[#292929]" 
              />
              <span className="text-sm text-neutral-500">
                I agree to the{' '}
                <a href="#" className="text-[#292929] hover:underline font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#292929] hover:underline font-medium">Privacy Policy</a>
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-6 bg-[#292929] hover:bg-[#404040] text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button 
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full py-4 px-6 bg-white border-2 border-neutral-200 hover:border-[#292929] rounded-xl font-semibold transition-all flex items-center justify-center gap-3 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="text-[#292929]">Continue with Google</span>
          </button>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <span className="text-neutral-500">Already have an account? </span>
            <Link 
              to="/login" 
              className="text-[#292929] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
