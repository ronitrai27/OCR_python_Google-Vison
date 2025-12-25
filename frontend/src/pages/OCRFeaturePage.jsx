import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ScanText, CheckCircle, Zap, Shield, ArrowRight, BookOpen } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const OCRFeaturePage = () => {
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
              <ScanText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Advanced OCR Technology
            </h1>
            <p className="text-xl text-[#292929] max-w-3xl mx-auto">
              Extract text from scanned Urdu and Hindi documents with industry-leading accuracy using Google Vision API
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <CheckCircle className="w-12 h-12 text-[#292929] mb-4" />
              <h3 className="text-2xl font-bold mb-4">High Accuracy</h3>
              <p className="text-[#292929]">
                Our Google Vision API-powered OCR engine delivers precise text extraction on complex Urdu and Hindi scripts, handling both handwritten documents and various scan qualities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <Zap className="w-12 h-12 text-[#292929] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-[#292929]">
                Process documents in seconds, not hours. Our optimized pipeline handles multiple pages simultaneously for maximum efficiency.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <Shield className="w-12 h-12 text-[#292929] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Secure Processing</h3>
              <p className="text-[#292929]">
                All documents are encrypted during processing and automatically deleted after extraction. Your data never leaves our secure servers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <BookOpen className="w-12 h-12 text-[#292929] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Multi-Script Support</h3>
              <p className="text-[#292929]">
                Handles Urdu Nastaliq, Hindi Devanagari, and mixed-script documents with equal proficiency.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How OCR Extraction Works</h2>
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#292929] text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Upload Document</h3>
                <p className="text-[#292929]">
                  Upload your scanned land record in PDF, JPEG, or PNG format. Our system accepts documents up to 50MB.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#292929] text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI Processing</h3>
                <p className="text-[#292929]">
                  Google Vision API analyzes the document, identifies text regions, and extracts content with confidence scores.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#292929] text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Quality Verification</h3>
                <p className="text-[#292929]">
                  Our confidence scoring system flags low-quality extractions for manual review, ensuring data accuracy.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#292929] text-white flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Get Results</h3>
                <p className="text-[#292929]">
                  Extracted text is available instantly for download, translation, or direct database storage.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#292929]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Extract Your Documents?
          </h2>
          <p className="text-xl text-neutral-300 mb-8">
            Start digitizing land records today with our advanced OCR technology
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#292929] rounded-full font-bold hover:scale-105 transition-transform"
          >
            Try OCR Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OCRFeaturePage;
