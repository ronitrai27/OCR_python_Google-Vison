import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Loader2, Mail, Lock, User, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (error) throw error;

      navigate('/login'); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "AI-Powered OCR for Urdu & Hindi",
    "Instant Multi-Language Translation",
    "Secure Cloud Document Storage",
    "Professional PDF Reports",
    "Real-time Collaboration Tools",
    "Advanced Analytics Dashboard"
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-black">
      {/* Left Side - Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 items-center justify-center p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, -5, 0],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center">
              <Sparkles className="w-16 h-16" />
            </div>
          </motion.div>
          
          <h2 className="text-5xl font-bold mb-4">
            Start Your Digital Journey
          </h2>
          <p className="text-xl text-white/90 mb-12">
            Join thousands of organizations modernizing their land records with cutting-edge AI technology.
          </p>
          
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 opacity-50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full relative z-10"
        >
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Start digitizing your land records today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-start gap-2"
            >
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
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
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-neutral-900 dark:text-white"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
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
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-neutral-900 dark:text-white"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
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
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-neutral-900 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
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
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-neutral-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                required
                className="mt-1 w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer" 
              />
              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                I agree to the <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-black text-neutral-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            to="/login" 
            className="block w-full py-4 px-6 text-center border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-xl font-semibold transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            Sign In Instead
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
