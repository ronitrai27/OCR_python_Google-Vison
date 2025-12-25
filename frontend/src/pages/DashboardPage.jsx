import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ImageUpload from '../components/ImageUpload';
import { processOCR, translateText } from '../services/ocrService';
import { 
  FileText, 
  Languages, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Download, 
  Copy, 
  LogOut,
  BarChart3,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate('/login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleUploadSuccess = async (fileData) => {
    setProcessing(true);
    setError(null);
    setOcrResult(null);
    setTranslation(null);

    try {
      const ocrResponse = await processOCR(fileData.filepath);
      if (ocrResponse.success) {
        setOcrResult(ocrResponse.data.text);
        
        const transResponse = await translateText(ocrResponse.data.text, "ur", "en");
        setTranslation(transResponse.data.translated);
      } else {
        setError("OCR processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Processing failed", error);
      setError("An error occurred during processing.");
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { icon: FileText, label: "Documents Processed", value: "24", color: "blue" },
    { icon: Clock, label: "Avg. Processing Time", value: "3.2s", color: "green" },
    { icon: TrendingUp, label: "Accuracy Rate", value: "96.8%", color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-purple-50 dark:from-black dark:via-blue-950 dark:to-purple-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AgriStack OCR
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {user?.user_metadata?.first_name || 'User'}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {user?.email}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {user?.user_metadata?.first_name?.[0] || user?.email?.[0].toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Upload Document
              </h2>
              <ImageUpload onUploadSuccess={handleUploadSuccess} />
              
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                    <span>Upload clear, high-quality scans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2"></div>
                    <span>Supports Urdu and Hindi scripts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                    <span>Processing takes 2-5 seconds</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status / Error */}
            {processing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex items-center gap-4"
              >
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    Processing your document...
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    This may take a few moments. Please wait.
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-start gap-4"
              >
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-100">Error</p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {/* OCR Result */}
            {ocrResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden"
              >
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Extracted Text
                  </h2>
                  <button
                    onClick={() => copyToClipboard(ocrResult)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {copied ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                </div>
                <div className="p-6">
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto border border-neutral-200 dark:border-neutral-700">
                    {ocrResult}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Translation Result */}
            {translation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden"
              >
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Languages className="w-5 h-5 text-purple-500" />
                    English Translation
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(translation)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm font-medium">Copy</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Export PDF</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 font-serif text-lg leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto border border-neutral-200 dark:border-neutral-700">
                    {translation}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!processing && !ocrResult && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                  <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                  No Documents Yet
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                  Upload your first document to get started with AI-powered OCR and translation.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
