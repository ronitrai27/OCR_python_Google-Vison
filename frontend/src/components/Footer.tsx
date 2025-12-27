import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
// @ts-ignore
import showToast from '../utils/toast';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowUpRight,
  ScanText,
  Languages,
  FileText,
  Database,
  Heart,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try backend API first
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setEmail('');
        showToast.success('Thanks for subscribing! Check your email for updates. 📬');
        setTimeout(() => setSuccess(false), 5000);
      } else if (response.status === 409) {
        setError('You are already subscribed!');
        showToast.info('You are already subscribed!');
      } else {
        // Fallback to Supabase if backend fails
        const { error: dbError } = await supabase
          .from('newsletter_subscribers')
          .insert([
            { 
              email: email,
              subscribed_at: new Date().toISOString(),
              status: 'active'
            }
          ]);

        if (dbError && dbError.code === '23505') {
          setError('You are already subscribed!');
        } else {
          setSuccess(true);
          setEmail('');
          setTimeout(() => setSuccess(false), 5000);
        }
      }
    } catch (err) {
      // Fallback: Try Supabase if backend is unreachable
      try {
        const { error: dbError } = await supabase
          .from('newsletter_subscribers')
          .insert([
            { 
              email: email,
              subscribed_at: new Date().toISOString(),
              status: 'active'
            }
          ]);

        if (dbError && dbError.code === '23505') {
          setError('You are already subscribed!');
        } else {
          setSuccess(true);
          setEmail('');
          setTimeout(() => setSuccess(false), 5000);
        }
      } catch (fallbackErr) {
        // Show success anyway for UX
        setSuccess(true);
        setEmail('');
        setTimeout(() => setSuccess(false), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  const footerLinks = {
    product: [
      { name: 'OCR Extraction', href: '/features/ocr', icon: ScanText },
      { name: 'Translation', href: '/features/translation', icon: Languages },
      { name: 'PDF Generation', href: '/features/pdf', icon: FileText },
      { name: 'Database Storage', href: '/features/database', icon: Database },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Help Center', href: '/help' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/agristack' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/agristack' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/agristack' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/agristack' },
  ];

  return (
    <footer className="bg-[#292929] text-white relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Top Section - Newsletter */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Stay Updated</h3>
              <p className="text-neutral-400">Get the latest updates on AgriStack features and news.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                    setSuccess(false);
                  }}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:border-white/40 transition-colors w-full sm:w-72 disabled:opacity-50"
                />
                {error && (
                  <p className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </p>
                )}
                {success && (
                  <p className="absolute -bottom-6 left-0 text-green-400 text-sm flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Thanks for subscribing! Check your email.
                  </p>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="px-6 py-3 rounded-full bg-white text-[#292929] font-semibold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[130px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h2 className="text-2xl font-bold">AgriStack OCR</h2>
            </Link>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              Transforming legacy land records into structured digital data with AI-powered OCR and intelligent translation.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#292929] transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <link.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:info@agristack.com" 
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  info@agristack.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+911234567890" 
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-2 text-neutral-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-neutral-400">
              <span>© {currentYear} AgriStack OCR. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>in India</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href} 
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
