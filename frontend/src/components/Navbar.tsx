import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Menu, X, LayoutDashboard } from 'lucide-react';
// @ts-ignore
import { supabase } from '../supabaseClient';

interface NavbarProps {
  showBackButton?: boolean;
}

// Animated Nav Link component
const AnimatedNavLink = ({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAnimating(true);
    
    setTimeout(() => {
      navigate(to);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <motion.a
      href={to}
      onClick={handleClick}
      className={`relative text-neutral-400 hover:text-white transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        animate={isAnimating ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      {isAnimating && (
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      )}
    </motion.a>
  );
};

const Navbar = ({ showBackButton = false }: NavbarProps) => {
  const location = useLocation();
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isHomePage = location.pathname === '/';
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFeaturesDropdownOpen(false);
      }
    };

    if (featuresDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [featuresDropdownOpen]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
    >
      <div className="bg-[#292929] backdrop-blur-lg rounded-full border border-neutral-700 shadow-lg px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Left - Back Button or Logo */}
          <div className="flex items-center gap-4">
            {(showBackButton || !isHomePage) && (
              <Link 
                to="/" 
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.9 }}>
                  <ArrowLeft className="w-5 h-5" />
                </motion.div>
                <span className="hidden sm:inline text-sm">Home</span>
              </Link>
            )}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="text-xl font-bold text-white">
                AgriStack OCR
              </Link>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
                className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Features
                <motion.div
                  animate={{ rotate: featuresDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {featuresDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 bg-[#292929] rounded-2xl shadow-xl border border-neutral-700 py-2 w-48 overflow-hidden"
                  >
                    {[
                      { to: '/features/ocr', label: 'OCR Extraction' },
                      { to: '/features/translation', label: 'Translation' },
                      { to: '/features/database', label: 'Database Storage' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link 
                          to={item.to} 
                          className="block px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                          onClick={() => setFeaturesDropdownOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatedNavLink to="/disputed-lands">Disputed Lands</AnimatedNavLink>
            <AnimatedNavLink to="/about">About</AnimatedNavLink>
            <AnimatedNavLink to="/contact">Contact</AnimatedNavLink>
            
            {user ? (
              // Show Dashboard button when logged in
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#292929] font-bold hover:bg-neutral-200 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </motion.div>
            ) : (
              // Show Login/Signup when not logged in
              <>
                <AnimatedNavLink to="/login" className="font-medium">Login</AnimatedNavLink>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/signup" 
                    className="px-5 py-2 rounded-full bg-white text-[#292929] font-bold hover:bg-neutral-200 transition-colors"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-neutral-700 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {[
                  { to: '/features/ocr', label: 'OCR Extraction' },
                  { to: '/features/translation', label: 'Translation' },
                  { to: '/features/database', label: 'Database Storage' },
                  { to: '/disputed-lands', label: 'Disputed Lands' },
                  { to: '/about', label: 'About' },
                  { to: '/contact', label: 'Contact' },
                ].map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      to={item.to} 
                      className="text-neutral-400 hover:text-white transition-colors block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {user ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#292929] font-bold text-center justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Link 
                        to="/login" 
                        className="text-neutral-400 hover:text-white transition-colors block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.30 }}
                    >
                      <Link 
                        to="/signup" 
                        className="px-5 py-2 rounded-full bg-white text-[#292929] font-bold text-center block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
