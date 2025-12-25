import React, { useState, useEffect, useCallback, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { uploadFile, processOCR, processOCRWithVision, translateDocument, getStats, getDocuments, getDistrictProgress } from '../services/ocrService';
import showToast from '../utils/toast';
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
  Sparkles,
  Users,
  MapPin,
  FileCheck,
  RefreshCw,
  Eye,
  Search,
  Filter,
  Database,
  Globe,
  Shield,
  Zap,
  Upload,
  X,
  File as FileIcon,
  ScanLine,
  ArrowRight,
  FileUp,
  BookOpen,
  Settings,
  User,
  ChevronDown,
  Home
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // User state
  const [user, setUser] = useState({ email: 'demo@example.com', user_metadata: { first_name: 'Demo' } });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('ocr');
  
  // OCR state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrError, setOcrError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [useGoogleVision, setUseGoogleVision] = useState(false);
  
  // Translation state
  const [translationFile, setTranslationFile] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [sourceLang, setSourceLang] = useState('ur');
  const [targetLang, setTargetLang] = useState('en');
  const [translationError, setTranslationError] = useState(null);
  const [translationProgress, setTranslationProgress] = useState({ current: 0, total: 0 });
  const [dragActiveTranslation, setDragActiveTranslation] = useState(false);
  const translationFileInputRef = useRef(null);
  
  // Dashboard state
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(true);
  
  // Stats state
  const [stats, setStats] = useState({
    documentsProcessed: 0,
    farmersRegistered: 0,
    parcelsLinked: 0,
    accuracyRate: 0,
    avgProcessingTime: 0,
    pendingRecords: 0,
    languageDistribution: { urdu: 0, hindi: 0, english: 0 }
  });

  const [recentDocuments, setRecentDocuments] = useState([]);
  const [districtProgress, setDistrictProgress] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsResponse, docsResponse, districtResponse] = await Promise.all([
        getStats(),
        getDocuments(1, 10),
        getDistrictProgress()
      ]);

      if (statsResponse.success) {
        const data = statsResponse.data;
        setStats({
          documentsProcessed: data.total_processed || 0,
          farmersRegistered: data.farmers_registered || 0,
          parcelsLinked: data.parcels_linked || 0,
          accuracyRate: data.accuracy_rate || 0,
          avgProcessingTime: data.avg_processing_time || 0,
          pendingRecords: data.pending_records || 0,
          languageDistribution: data.language_distribution || { urdu: 0, hindi: 0, english: 0 }
        });
        setBackendConnected(true);
      } else {
        setBackendConnected(false);
      }

      if (docsResponse.success && docsResponse.data?.documents) {
        setRecentDocuments(docsResponse.data.documents);
      }

      if (districtResponse.success && districtResponse.data) {
        setDistrictProgress(districtResponse.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (err) {
        console.error('Auth error:', err);
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    // Close profile menu on click outside
    const handleClickOutside = (e) => {
      if (showProfileMenu && !e.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('click', handleClickOutside);
    };
  }, [navigate, showProfileMenu]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast.success('Logged out successfully');
    navigate('/login');
  };

  // File handling
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setOcrResult(null);
      setOcrError(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setOcrResult(null);
      setOcrError(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setOcrResult(null);
    setOcrError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // OCR Processing
  const handleOCRProcess = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setProcessing(false);
    setOcrError(null);
    setOcrResult(null);

    try {
      // Step 1: Upload file
      showToast.loading('Uploading document...');
      const uploadResult = await uploadFile(selectedFile);
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }
      
      setUploading(false);
      setProcessing(true);
      showToast.loading(useGoogleVision ? 'Processing with Google Vision API...' : 'Processing OCR...');
      
      // Step 2: Process OCR (use Google Vision API if selected)
      const ocrResponse = useGoogleVision 
        ? await processOCRWithVision(uploadResult.data.filepath)
        : await processOCR(uploadResult.data.filepath);
      if (ocrResponse.success) {
        setOcrResult({
          text: ocrResponse.data.text,
          confidence: ocrResponse.data.confidence,
          language: ocrResponse.data.detected_language,
          documentId: ocrResponse.data.document_id,
          processingTime: ocrResponse.data.processing_time_ms
        });
        
        showToast.success('Document processed successfully!');
        
        // Refresh stats
        fetchDashboardData();
      } else {
        throw new Error(ocrResponse.error || 'OCR processing failed');
      }
    } catch (error) {
      console.error("Processing failed", error);
      setOcrError(error.message || "An error occurred during processing.");
      showToast.error(error.message || "Processing failed");
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  // Translation
  const handleTranslationFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        showToast.error('Please upload a PDF file');
        return;
      }
      setTranslationFile(file);
      setTranslationResult(null);
      setTranslationError(null);
    }
  };

  const handleTranslationDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveTranslation(true);
    } else if (e.type === "dragleave") {
      setDragActiveTranslation(false);
    }
  };

  const handleTranslationDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveTranslation(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        showToast.error('Please upload a PDF file');
        return;
      }
      setTranslationFile(file);
      setTranslationResult(null);
      setTranslationError(null);
    }
  };

  const clearTranslationFile = () => {
    setTranslationFile(null);
    setTranslationResult(null);
    setTranslationError(null);
    setTranslationProgress({ current: 0, total: 0 });
    if (translationFileInputRef.current) {
      translationFileInputRef.current.value = '';
    }
  };

  const handleTranslateDocument = async () => {
    if (!translationFile) return;
    
    setTranslating(true);
    setTranslationError(null);
    setTranslationResult(null);
    setTranslationProgress({ current: 0, total: 0 });

    try {
      showToast.loading('Processing PDF document...');
      const response = await translateDocument(translationFile, sourceLang, targetLang);
      
      if (response.success) {
        setTranslationResult(response.data);
        showToast.success(`Successfully translated ${response.data.pages_processed || 1} page(s)!`);
      } else {
        throw new Error(response.error || 'Translation failed');
      }
    } catch (error) {
      console.error("Translation failed", error);
      setTranslationError(error.message || "Translation failed. Please try again.");
      showToast.error(error.message || "Translation failed");
    } finally {
      setTranslating(false);
    }
  };

  const useOcrForTranslation = () => {
    if (ocrResult?.text) {
      // Create a text blob to use directly
      showToast.info('OCR text ready for translation. Please upload as PDF for full document translation.');
      setActiveTab('translation');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const refreshData = useCallback(() => {
    fetchDashboardData();
    showToast.info('Refreshing data...');
  }, [fetchDashboardData]);

  const statCards = [
    { icon: FileText, label: "Documents Processed", value: stats.documentsProcessed, suffix: "", color: "#292929" },
    { icon: Users, label: "Farmers Registered", value: stats.farmersRegistered, suffix: "", color: "#16a34a" },
    { icon: MapPin, label: "Parcels Linked", value: stats.parcelsLinked, suffix: "", color: "#2563eb" },
    { icon: TrendingUp, label: "Accuracy Rate", value: stats.accuracyRate, suffix: "%", color: "#9333ea" },
    { icon: Clock, label: "Avg. Processing", value: stats.avgProcessingTime, suffix: "s", color: "#ea580c" },
    { icon: FileCheck, label: "Pending Records", value: stats.pendingRecords, suffix: "", color: "#dc2626" },
  ];

  const tabs = [
    { id: 'ocr', label: 'OCR Scanner', icon: ScanLine },
    { id: 'translation', label: 'Translation', icon: Languages },
    { id: 'registry', label: 'Land Registry', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const languages = [
    { code: 'ur', name: 'Urdu' },
    { code: 'hi', name: 'Hindi' },
    { code: 'en', name: 'English' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ks', name: 'Kashmiri' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#292929]">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-40 relative">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-xl bg-[#292929] flex items-center justify-center hover:bg-[#404040] transition-colors"
              title="Go to Home"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#292929]">AgriStack OCR</h1>
              <p className="text-xs text-neutral-500">Land Record Digitization Dashboard</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-600 hover:text-[#292929] hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
          
          {/* Connection Status */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 ${backendConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-full`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${backendConnected ? 'bg-green-400' : 'bg-yellow-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${backendConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            </span>
            <span className={`text-xs font-medium ${backendConnected ? 'text-green-700' : 'text-yellow-700'}`}>
              {backendConnected ? (loading ? 'Syncing...' : 'Connected') : 'Offline'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={refreshData} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors" title="Refresh">
              <RefreshCw className={`w-5 h-5 text-[#292929] ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-[#292929]">{user?.user_metadata?.first_name || 'User'}</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#292929] flex items-center justify-center text-white font-bold">
                  {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 text-left text-[#292929]"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/registration');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 text-left text-[#292929]"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Edit Farmer Info</span>
                  </button>
                  <div className="border-t border-neutral-200 my-2"></div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-left text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 relative">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                {loading && <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />}
              </div>
              <p className="text-2xl font-bold text-[#292929]">{loading ? '--' : `${stat.value}${stat.suffix}`}</p>
              <p className="text-xs text-neutral-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200 pb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#292929] text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* OCR Tab */}
          {activeTab === 'ocr' && (
            <motion.div
              key="ocr"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Upload Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-[#292929] mb-4 flex items-center gap-2">
                  <ScanLine className="w-5 h-5" />
                  OCR Document Scanner
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                  Upload a land record document (Jamabandi, Fard, Mutation) to extract text using AI-powered OCR.
                </p>

                {/* Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer mb-4 ${
                    dragActive 
                      ? "border-[#292929] bg-neutral-50" 
                      : "border-neutral-300 hover:border-neutral-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*,.pdf"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-neutral-100 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-[#292929]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#292929]">Click to upload or drag and drop</p>
                      <p className="text-sm text-neutral-500 mt-1">PNG, JPG, JPEG, or PDF (max. 10MB)</p>
                    </div>
                  </div>
                </div>

                {/* Selected File */}
                {selectedFile && (
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-10 w-10 rounded-lg bg-[#292929] flex items-center justify-center flex-shrink-0">
                          <FileIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#292929] truncate">{selectedFile.name}</p>
                          <p className="text-xs text-neutral-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button onClick={clearFile} className="p-2 hover:bg-neutral-200 rounded-full transition-colors" disabled={uploading || processing}>
                        <X className="w-5 h-5 text-neutral-500" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Google Vision API Toggle */}
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-[#292929]">Use Google Vision API</span>
                  </div>
                  <button
                    onClick={() => setUseGoogleVision(!useGoogleVision)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      useGoogleVision ? 'bg-blue-600' : 'bg-neutral-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        useGoogleVision ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Process Button */}
                <button 
                  onClick={handleOCRProcess} 
                  disabled={!selectedFile || uploading || processing}
                  className="w-full py-3 px-4 bg-[#292929] hover:bg-[#404040] text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                  ) : processing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing OCR...</>
                  ) : (
                    <><ScanLine className="w-5 h-5" /> Start OCR Processing</>
                  )}
                </button>

                {/* Supported Info */}
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="text-sm font-semibold text-[#292929] mb-3">Supported Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Urdu', 'Hindi', 'English', 'Kashmiri'].map((lang) => (
                      <span key={lang} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">{lang}</span>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Zap className="w-4 h-4" /> Fast processing (~3 seconds)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Shield className="w-4 h-4" /> Secure & encrypted
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {/* Error */}
                {ocrError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900">Error</p>
                      <p className="text-sm text-red-700 mt-1">{ocrError}</p>
                    </div>
                  </motion.div>
                )}

                {/* OCR Result */}
                {ocrResult && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                      <h2 className="font-semibold text-[#292929] flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Extracted Text
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          {ocrResult.language || 'Detected'}
                        </span>
                        {ocrResult.confidence && (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                            {ocrResult.confidence}% confidence
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="bg-neutral-50 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto border border-neutral-200 text-right" dir="rtl">
                        {ocrResult.text}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => copyToClipboard(ocrResult.text)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          {copied ? 'Copied!' : 'Copy Text'}
                        </button>
                        <button
                          onClick={useOcrForTranslation}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#292929] text-white hover:bg-[#404040] transition-colors"
                        >
                          <Languages className="w-4 h-4" />
                          Translate
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {ocrResult.processingTime && (
                      <div className="px-4 pb-4">
                        <p className="text-xs text-neutral-500">
                          Processed in {ocrResult.processingTime}ms • Document ID: {ocrResult.documentId}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Empty State */}
                {!ocrResult && !ocrError && !processing && !uploading && (
                  <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-2xl flex items-center justify-center">
                      <ScanLine className="w-10 h-10 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-bold text-[#292929] mb-2">Ready to Scan</h3>
                    <p className="text-neutral-500 max-w-md mx-auto">
                      Upload a land record document to extract text using our AI-powered OCR system.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Translation Tab */}
          {activeTab === 'translation' && (
            <motion.div
              key="translation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Input Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-[#292929] mb-4 flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  PDF Document Translation
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                  Upload PDF land records (100+ pages supported) for translation with domain-specific terminology.
                </p>

                {/* Language Selection */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">From</label>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:border-[#292929] focus:ring-1 focus:ring-[#292929] outline-none"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">To</label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:border-[#292929] focus:ring-1 focus:ring-[#292929] outline-none"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PDF Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer mb-4 ${
                    dragActiveTranslation 
                      ? "border-[#292929] bg-neutral-50" 
                      : "border-neutral-300 hover:border-neutral-400"
                  }`}
                  onDragEnter={handleTranslationDrag}
                  onDragLeave={handleTranslationDrag}
                  onDragOver={handleTranslationDrag}
                  onDrop={handleTranslationDrop}
                  onClick={() => translationFileInputRef.current?.click()}
                >
                  <input 
                    ref={translationFileInputRef}
                    type="file" 
                    onChange={handleTranslationFileChange} 
                    className="hidden" 
                    accept=".pdf"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-neutral-100 flex items-center justify-center">
                      <FileUp className="w-7 h-7 text-[#292929]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#292929]">Upload PDF Document</p>
                      <p className="text-sm text-neutral-500 mt-1">PDF files only (100+ pages supported)</p>
                    </div>
                  </div>
                </div>

                {/* Selected File */}
                {translationFile && (
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#292929] truncate">{translationFile.name}</p>
                          <p className="text-xs text-neutral-500">{(translationFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button onClick={clearTranslationFile} className="p-2 hover:bg-neutral-200 rounded-full transition-colors" disabled={translating}>
                        <X className="w-5 h-5 text-neutral-500" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Translate Button */}
                <button 
                  onClick={handleTranslateDocument} 
                  disabled={!translationFile || translating}
                  className="w-full py-3 px-4 bg-[#292929] hover:bg-[#404040] text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {translating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing Document...</>
                  ) : (
                    <><Languages className="w-5 h-5" /> Translate PDF</>
                  )}
                </button>

                {/* Info */}
                <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
                  <h3 className="text-sm font-semibold text-[#292929]">Domain-Specific Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Jamabandi', 'Khasra', 'Kanal', 'Marla', 'Tehsil', 'Mauza'].map((term) => (
                      <span key={term} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{term}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <BookOpen className="w-4 h-4" />
                    <span>Land record terminology handled correctly</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Globe className="w-4 h-4" />
                    <span>Powered by AI4Bharat IndicTrans2</span>
                  </div>
                </div>
              </div>

              {/* Output Section */}
              <div className="space-y-6">
                {/* Error */}
                {translationError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900">Translation Error</p>
                      <p className="text-sm text-red-700 mt-1">{translationError}</p>
                    </div>
                  </motion.div>
                )}

                {/* Translation Result */}
                {translationResult && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                      <h2 className="font-semibold text-[#292929] flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Translation Complete
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                          {translationResult.pages_processed || 1} page(s)
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          {languages.find(l => l.code === targetLang)?.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div 
                        className="bg-neutral-50 rounded-xl p-4 font-serif text-base leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto border border-neutral-200"
                        dir={targetLang === 'ur' || targetLang === 'ks' ? 'rtl' : 'ltr'}
                      >
                        {translationResult.translated_text || translationResult.translated}
                      </div>
                      
                      {/* Domain Terms Found */}
                      {translationResult.domain_terms_applied && translationResult.domain_terms_applied.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-blue-800 mb-2">Domain Terms Detected:</p>
                          <div className="flex flex-wrap gap-2">
                            {translationResult.domain_terms_applied.map((term, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white text-blue-700 text-xs rounded border border-blue-200">{term}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => copyToClipboard(translationResult.translated_text || translationResult.translated)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#292929] text-white hover:bg-[#404040] transition-colors">
                          <Download className="w-4 h-4" />
                          Export PDF
                        </button>
                      </div>
                    </div>
                    {translationResult.processing_time_ms && (
                      <div className="px-4 pb-4">
                        <p className="text-xs text-neutral-500">
                          Processed in {(translationResult.processing_time_ms / 1000).toFixed(2)}s
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Empty State */}
                {!translationResult && !translationError && !translating && (
                  <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-2xl flex items-center justify-center">
                      <Languages className="w-10 h-10 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-bold text-[#292929] mb-2">Ready to Translate</h3>
                    <p className="text-neutral-500 max-w-md mx-auto">
                      Upload a PDF land record document to translate with domain-specific terminology handling.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">Jamabandi Records</span>
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">Fard Documents</span>
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">Mutation Orders</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Registry Tab */}
          {activeTab === 'registry' && (
            <motion.div
              key="registry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by Khasra No., Farmer Name, or Document..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-[#292929] outline-none transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white hover:border-[#292929] transition-all">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Documents Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                  <h2 className="font-semibold text-[#292929] flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Processed Land Records
                  </h2>
                  <span className="text-sm text-neutral-500">{recentDocuments.length} documents</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-600">Document</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-600">Khasra No.</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-600">Farmer</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-600">Language</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-600">Status</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-600">Date</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDocuments.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-4 py-12 text-center text-neutral-500">
                            <div className="flex flex-col items-center gap-3">
                              <FileText className="w-12 h-12 text-neutral-300" />
                              <p className="text-lg font-medium">No documents yet</p>
                              <p className="text-sm">Upload your first land record to get started</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        recentDocuments.map((doc) => (
                          <tr key={doc.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-[#292929]" />
                                </div>
                                <span className="font-medium text-sm text-[#292929]">{doc.filename || '--'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">{doc.khasra_number || '--'}</span>
                            </td>
                            <td className="px-4 py-4 text-sm text-neutral-600">{doc.farmer_name || '--'}</td>
                            <td className="px-4 py-4">
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{doc.detected_language || '--'}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                                doc.processing_status === 'processed' ? 'bg-green-50 text-green-700' :
                                doc.processing_status === 'failed' ? 'bg-red-50 text-red-700' :
                                'bg-neutral-100 text-neutral-600'
                              }`}>
                                {doc.processing_status === 'processed' && <CheckCircle className="w-3 h-3" />}
                                {doc.processing_status === 'failed' && <AlertCircle className="w-3 h-3" />}
                                {doc.processing_status || 'Pending'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-neutral-500">
                              {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '--'}
                            </td>
                            <td className="px-4 py-4">
                              <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                                <Eye className="w-4 h-4 text-neutral-600" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* District Progress */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#292929] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    District-wise Digitization Progress
                  </h2>
                  <span className="text-sm text-neutral-500">J&K Land Records</span>
                </div>
                <div className="space-y-4">
                  {districtProgress.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                      <p className="text-lg font-medium">No district data yet</p>
                      <p className="text-sm">Process documents to see district-wise progress</p>
                    </div>
                  ) : (
                    districtProgress.map((district, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-[#292929]">{district.name}</span>
                          <span className="text-neutral-500">{district.completed.toLocaleString()} / {district.total.toLocaleString()}</span>
                        </div>
                        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${district.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-[#292929] rounded-full"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Language Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Urdu Documents</p>
                      <p className="text-2xl font-bold text-[#292929]">{stats.languageDistribution?.urdu || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Hindi Documents</p>
                      <p className="text-2xl font-bold text-[#292929]">{stats.languageDistribution?.hindi || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">English Documents</p>
                      <p className="text-2xl font-bold text-[#292929]">{stats.languageDistribution?.english || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AgriStack Pipeline */}
              <div className="bg-[#292929] rounded-2xl p-6 text-white">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AgriStack Pipeline Status
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Land Records', value: stats.documentsProcessed || 0, status: 'active' },
                    { label: 'Farmer IDs', value: stats.farmersRegistered || 0, status: 'active' },
                    { label: 'Farm IDs', value: stats.parcelsLinked || 0, status: 'active' },
                    { label: 'Scheme Linkage', value: 'Ready', status: 'pending' },
                  ].map((item, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-4">
                      <p className="text-sm text-white/70 mb-1">{item.label}</p>
                      <p className="text-xl font-bold">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                        <span className="text-xs text-white/60">{item.status === 'active' ? 'Connected' : 'Pending'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPage;
