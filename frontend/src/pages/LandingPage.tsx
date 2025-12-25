import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BentoGrid, BentoGridItem } from '../components/ui/bento-grid';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ScrollReveal from '../components/ScrollReveal';
import CursorAlphabets from '../components/CursorAlphabets';
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
  Eye,
  ChevronDown,
  Play
} from 'lucide-react';

// Animated OCR Demo Component
const OCRAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-white p-4 rounded-lg shadow-xl"
        >
          <div className="space-y-1.5">
            <div className="h-1.5 bg-neutral-200 rounded w-20"></div>
            <div className="h-1.5 bg-neutral-300 rounded w-16"></div>
            <div className="h-1.5 bg-neutral-200 rounded w-24"></div>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
        >
          <CheckCircle className="w-3 h-3 text-white" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Animated Translation Demo
const TranslationAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-white p-2 rounded-lg shadow-lg"
        >
          <div className="text-lg font-bold text-right">اردو</div>
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-5 h-5 text-green-500" />
        </motion.div>
        <motion.div
          animate={{ x: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-white p-2 rounded-lg shadow-lg"
        >
          <div className="text-lg font-bold">English</div>
        </motion.div>
      </div>
    </div>
  );
};

// Animated Database Demo
const DatabaseAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl overflow-hidden">
      <div className="relative flex flex-col gap-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="bg-white rounded-md shadow-md p-1.5"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-purple-200 rounded"></div>
              <div className="space-y-0.5">
                <div className="h-1 bg-neutral-300 rounded w-12"></div>
                <div className="h-1 bg-neutral-200 rounded w-8"></div>
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
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  
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
        <div className="flex flex-1 w-full h-full rounded-xl bg-gradient-to-br from-red-50 to-orange-100 items-center justify-center">
          <motion.div
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <FileText className="w-12 h-12 text-red-500" />
          </motion.div>
        </div>
      ),
      icon: <FileText className="h-4 w-4 text-red-500" />,
    },
    {
      title: "Secure & Reliable",
      description: "Enterprise-grade security with encryption at rest and in transit for sensitive land records.",
      header: (
        <div className="flex flex-1 w-full h-full rounded-xl bg-gradient-to-br from-yellow-50 to-amber-100 items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock className="w-12 h-12 text-yellow-600" />
          </motion.div>
        </div>
      ),
      icon: <ShieldCheck className="h-4 w-4 text-yellow-500" />,
    },
    {
      title: "Historical Tracking",
      description: "Track ownership history and changes over time with comprehensive audit logs.",
      header: (
        <div className="flex flex-1 w-full h-full rounded-xl bg-gradient-to-br from-orange-50 to-red-100 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <History className="w-12 h-12 text-orange-500" />
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
    <div ref={containerRef} className="min-h-screen bg-white text-[#292929] font-sans overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Cursor Alphabet Interaction */}
        <CursorAlphabets maxAlphabets={20} spawnRadius={120} />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-neutral-100 border border-[#292929] hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#292929]" />
            <span className="text-sm font-medium text-[#292929]">
              Revolutionizing Land Records Management
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight uppercase"
            style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', letterSpacing: '0.05em' }}
          >
            <span className="text-[#292929]">DIGITIZE LAND RECORDS</span>
            <br />
            <span className="text-[#292929]">
              IN SECONDS
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#292929] max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Transform legacy Urdu & Hindi paper records into structured digital data with 
            <span className="font-bold"> AI-powered OCR</span> and 
            <span className="font-bold"> intelligent translation</span>.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Link to="/signup" className="group px-6 py-3 rounded-full bg-[#292929] text-white font-medium text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              Start Digitizing Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-6 py-3 rounded-full bg-white border-2 border-[#292929] text-[#292929] hover:bg-[#292929] hover:text-white transition-all font-medium text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#292929] text-white flex items-center justify-center">
                <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
              </div>
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 rounded-2xl border border-neutral-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-[#292929]/30 transition-all duration-300 cursor-pointer group"
              >
                <motion.div 
                  className="text-4xl md:text-5xl font-bold text-[#292929] group-hover:scale-110 transition-transform duration-300"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-[#292929]/70 mt-2 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
      </section>

      {/* Scrolling Revealing Text - Challenge Section */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1 }}
          >
            {/* Animated Line */}
            <div className="flex justify-center mb-8">
              <motion.div 
                className="h-[2px] bg-gradient-to-r from-transparent via-[#292929] to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "200px" }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-[#292929]">
              The Challenge We're Solving
            </h2>
          </motion.div>

          {/* GSAP ScrollReveal Text */}
          <ScrollReveal 
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={3}
            blurStrength={4}
            containerClassName="mb-8"
            textClassName="text-[#292929]"
          >
            Millions of land records across India remain locked in paper documents written in Urdu and Hindi, making them inaccessible to modern agricultural technology and planning.
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section className="py-12 px-4 bg-white relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center mb-10"
          >
            <div className="w-full max-w-xl h-[2px] bg-gradient-to-r from-transparent via-[#292929] to-transparent" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-[#292929]">
              Powerful Features
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
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
                  className={i === 5 ? "md:col-span-3" : (i === 4 ? "md:col-span-2" : "")}
                />
              ))}
            </BentoGrid>
          </motion.div>
        </div>
      </section>

      {/* Challenge Section with Animation */}
      <section ref={challengeRef} className="py-16 px-4 bg-[#292929] relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={challengeInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
                The Challenge
              </h2>
              <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
                Land records in Jammu & Kashmir are largely physical, often in Urdu script, 
                requiring manual digitization that's time-consuming and error-prone.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: FileText, text: "Physical & Scanned Records", color: "blue", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/40" },
                  { icon: Zap, text: "Manual Digitization Bottlenecks", color: "yellow", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/40" },
                  { icon: TrendingUp, text: "Multi-Parcel Ownership Complexity", color: "green", bgColor: "bg-green-500/20", borderColor: "border-green-500/40" },
                  { icon: ShieldCheck, text: "Unsettled Land Ambiguity", color: "purple", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/40" },
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={challengeInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className={`flex items-center gap-4 group p-4 rounded-xl border ${item.borderColor} ${item.bgColor} hover:scale-[1.02] transition-all duration-300`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                    </div>
                    <span className="text-lg font-semibold text-white">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={challengeInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-700"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.02, 1, 1.02, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="w-80 h-96 bg-white rounded-2xl shadow-2xl p-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-4 w-24 bg-neutral-200 rounded"></div>
                      <Upload className="w-5 h-5 text-[#292929]" />
                    </div>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        animate={{ width: `${60 + Math.random() * 40}%` }}
                        transition={{ delay: i * 0.2, duration: 0.5 }}
                        className="h-3 bg-gradient-to-r from-neutral-300 to-neutral-400 rounded"
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
      <section className="py-16 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#29292908_1px,transparent_1px),linear-gradient(to_bottom,#29292908_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-[#292929] mb-6">
            Ready to Transform Your Records?
          </h2>
          <p className="text-xl text-neutral-600 mb-10">
            Join thousands of organizations digitizing their land records with AgriStack OCR.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="px-8 py-3.5 rounded-full bg-[#292929] text-white font-semibold text-base hover:scale-105 transition-transform shadow-xl">
              Get Started Now
            </Link>
            <Link to="/login" className="px-8 py-3.5 rounded-full border-2 border-[#292929] text-[#292929] font-semibold text-base hover:bg-[#292929] hover:text-white transition-all">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
