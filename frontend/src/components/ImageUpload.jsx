import React, { useState, useRef } from 'react';
import { uploadFile } from '../services/ocrService';
import { Upload, X, File as FileIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      const result = await uploadFile(file);
      if (result.success) {
        onUploadSuccess(result.data);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              dragActive 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" 
                : "border-neutral-300 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-600"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input 
              ref={inputRef}
              type="file" 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,.pdf"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Click to upload or drag and drop</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                  <FileIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-neutral-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={clearFile}
                className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-neutral-500 transition-colors"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Start Processing"
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;
