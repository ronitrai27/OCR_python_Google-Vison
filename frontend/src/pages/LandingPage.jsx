import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BentoGrid, BentoGridItem } from '../components/ui/bento-grid';
import { 
  ScanText, 
  Languages, 
  Database, 
  FileText, 
  ShieldCheck, 
  History,
  Upload,
  Zap,
  Lock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Eye
} from 'lucide-react';

// Animated OCR Demo Component
const OCRAnimation = () => {
  return (
    <div className="relative w-full h-full min-h-[200px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-xl overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-2xl"
        >
          <div className="space-y-2">
            <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-32"></div>
            <div className="h-2 bg-blue-300 dark:bg-blue-600 rounded w-28"></div>
            <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-36"></div>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2"
        >
          <CheckCircle className="w-5 h-5 text-white" />
        </motion.div>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-blue-500 rounded-lg"
        />
      </motion.div>
    </div>
  );
};

// Animated Translation Demo
const TranslationAnimation = () => {
  return (
    <div className="relative w-full h-full min-h-[200px] flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 rounded-xl overflow-hidden">
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-xl"
        >
          <div className="text-2xl font-bold text-right">اردو</div>
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-8 h-8 text-green-500" />
        </motion.div>
        <motion.div
          animate={{ x: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-xl"
        >
          <div className="text-2xl font-bold">English</div>
        </motion.div>
      </div>
    </div>
  );
};

// Animated Database Demo
const DatabaseAnimation = () => {
  return (
    <div className="relative w-full h-full min-h-[200px] flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-950 rounded-xl overflow-hidden">
      <div className="relative">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-3 mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-200 dark:bg-purple-700 rounded"></div>
              <div className="space-y-1">
                <div className="h-2 bg-purple-300 dark:bg-purple-600 rounded w-24"></div>
                <div className="h-2 bg-purple-200 dark:bg-purple-700 rounded w-16"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const containerRef = useRef(null);
  const challengeRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 500]);
  
  const challengeInView = useInView(challengeRef, { once: true, amount: 0.3 });

  const features = [
    {
      title: "Advanced OCR",
      description: "Extract text from scanned Urdu/Hindi documents with 95%+ accuracy using Google Vision API.",
      header: <OCRAnimation />,
      icon: <ScanText className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Multi-Language Translation",
      description: "Seamlessly translate land records from Urdu/Hindi to English using AI4Bharat models.",
      header: <TranslationAnimation />,
      icon: <Languages className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Structured Database",
      description: "Store parsed data in PostgreSQL database ready for AgriStack integration.",
      header: <DatabaseAnimation />,
      icon: <Database className="h-4 w-4 text-purple-500" />,
    },
    {
      title: "PDF Generation",
      description: "Generate professional PDF reports of translated land records instantly with custom templates.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[200px] rounded-xl bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950 dark:to-orange-950 items-center justify-center">
          <motion.div
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <FileText className="w-16 h-16 text-red-500" />
          </motion.div>
        </div>
      ),
      icon: <FileText className="h-4 w-4 text-red-500" />,
    },
    {
      title: "Secure & Reliable",
      description: "Enterprise-grade security with encryption at rest and in transit for sensitive land records.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[200px] rounded-xl bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-950 items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock className="w-16 h-16 text-yellow-600" />
          </motion.div>
        </div>
      ),
      icon: <ShieldCheck className="h-4 w-4 text-yellow-500" />,
    },
    {
      title: "Historical Tracking",
      description: "Track ownership history and changes over time with comprehensive audit logs.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[200px] rounded-xl bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <History className="w-16 h-16 text-orange-500" />
          </motion.div>
        </div>
      ),
      icon: <History className="h-4 w-4 text-orange-500" />,
    },
  ];

  const stats = [
    { value: "95%", label: "OCR Accuracy" },
    { value: "10+", label: "Languages Supported" },
    { value: "50K+", label: "Documents Processed" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-50 font-sans overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            AgriStack OCR
          </motion.div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-black dark:to-purple-950"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
          >
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              🚀 Revolutionizing Land Records Management
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-600 dark:from-neutral-50 dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent leading-tight"
          >
            Digitize Land Records
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              In Seconds
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Transform legacy Urdu & Hindi paper records into structured digital data with 
            <span className="font-semibold text-blue-600 dark:text-blue-400"> AI-powered OCR</span> and 
            <span className="font-semibold text-purple-600 dark:text-purple-400"> intelligent translation</span>.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup" className="group px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center gap-2">
              Start Digitizing Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-full border-2 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all font-semibold text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Watch Demo
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Scroll Text Effect */}
        <div className="absolute bottom-10 w-full overflow-hidden whitespace-nowrap opacity-10">
          <motion.div 
            style={{ x }} 
            className="text-[10rem] font-bold uppercase text-neutral-900 dark:text-white inline-block"
          >
            OCR • Translate • Digitize • AgriStack • Secure • 
          </motion.div>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section className="py-32 px-4 bg-neutral-50 dark:bg-neutral-950 relative">
        <motion.div
          style={{ y }}
          className="absolute top-20 right-0 w-96 h-96 bg-blue-300/20 dark:bg-blue-700/20 rounded-full blur-3xl"
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Everything you need to digitize, translate, and manage land records efficiently.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <BentoGrid className="max-w-6xl mx-auto">
              {features.map((item, i) => (
                <BentoGridItem
                  key={i}
                  title={item.title}
                  description={item.description}
                  header={item.header}
                  icon={item.icon}
                  className={i === 3 || i === 5 ? "md:col-span-2" : ""}
                />
              ))}
            </BentoGrid>
          </motion.div>
        </div>
      </section>

      {/* Challenge Section with Animation */}
      <section ref={challengeRef} className="py-32 px-4 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={challengeInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 bg-clip-text text-transparent">
                The Challenge
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Land records in Jammu & Kashmir are largely physical, often in Urdu script, 
                requiring manual digitization that's time-consuming and error-prone.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: FileText, text: "Physical & Scanned Records", color: "blue" },
                  { icon: Zap, text: "Manual Digitization Bottlenecks", color: "yellow" },
                  { icon: TrendingUp, text: "Multi-Parcel Ownership Complexity", color: "green" },
                  { icon: ShieldCheck, text: "Unsettled Land Ambiguity", color: "purple" },
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={challengeInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 dark:from-${item.color}-900/30 dark:to-${item.color}-800/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                    </div>
                    <span className="text-lg font-semibold">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={challengeInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.02, 1, 1.02, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="w-80 h-96 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                      <Upload className="w-5 h-5 text-blue-500" />
                    </div>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        animate={{ width: `${60 + Math.random() * 40}%` }}
                        transition={{ delay: i * 0.2, duration: 0.5 }}
                        className="h-3 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Records?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of organizations digitizing their land records with AgriStack OCR.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="px-10 py-5 rounded-full bg-white text-purple-600 font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
              Get Started Now
            </Link>
            <Link to="/login" className="px-10 py-5 rounded-full border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-purple-600 transition-all">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">AgriStack OCR</div>
          <p className="mb-4">Digitizing land records for a better agricultural future.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <div className="mt-8 text-sm">
            © 2025 AgriStack OCR. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
