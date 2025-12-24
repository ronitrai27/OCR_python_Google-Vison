import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Languages, Upload, ArrowRight, FileText, CheckCircle, Loader2, Download } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import axios from 'axios';

const TranslationFeaturePage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleTranslate = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/translate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Translation failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const blob = new Blob([result.translated_text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-[#292929]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#292929] mb-6">
              <Languages className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI-Powered Translation
            </h1>
            <p className="text-xl text-[#292929] max-w-3xl mx-auto">
              Translate Urdu and Hindi land records to English instantly with AI4Bharat's state-of-the-art models
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload & Translation Section */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Try Translation Now</h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            {/* Upload Area */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-4">Upload Document</label>
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center hover:border-[#292929] transition-colors cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
                  <p className="text-lg font-semibold mb-2">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-neutral-500">
                    PDF, JPEG, PNG, or TXT (Max 50MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={!file || uploading}
              className="w-full py-4 bg-[#292929] text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="w-5 h-5" />
                  Translate to English
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 space-y-6"
                >
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Translation Complete!</span>
                  </div>

                  {/* Original Text */}
                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Original Text (Urdu/Hindi)
                    </h3>
                    <div className="bg-neutral-100 rounded-xl p-4 max-h-40 overflow-y-auto">
                      <p className="text-sm text-right font-urdu">{result.original_text || 'Original text extracted'}</p>
                    </div>
                  </div>

                  {/* Translated Text */}
                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <Languages className="w-5 h-5" />
                      Translated Text (English)
                    </h3>
                    <div className="bg-neutral-100 rounded-xl p-4 max-h-40 overflow-y-auto">
                      <p className="text-sm">{result.translated_text || result.translation}</p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="w-full py-3 border-2 border-[#292929] text-[#292929] rounded-xl font-semibold hover:bg-[#292929] hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Translation
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Our Translation?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#292929] mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Context-Aware</h3>
              <p className="text-[#292929]">
                Preserves legal and agricultural terminology specific to land records
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#292929] mx-auto mb-4 flex items-center justify-center">
                <Languages className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">10+ Languages</h3>
              <p className="text-[#292929]">
                Support for Urdu, Hindi, and major Indian regional languages
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#292929] mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Batch Processing</h3>
              <p className="text-[#292929]">
                Translate multiple documents simultaneously for efficiency
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#292929]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Need Full Translation Pipeline?
          </h2>
          <p className="text-xl text-neutral-300 mb-8">
            Access OCR, Translation, and Database Storage in one platform
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#292929] rounded-full font-bold hover:scale-105 transition-transform"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TranslationFeaturePage;
