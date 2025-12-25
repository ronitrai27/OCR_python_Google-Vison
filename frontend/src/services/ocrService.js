import axios from 'axios';
import { API_URL } from '../config/api';

// API_URL is now imported from centralized config

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_URL}/ocr/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const processOCR = async (filepath) => {
  const response = await axios.post(`${API_URL}/ocr/process`, { filepath });
  return response.data;
};

export const processOCRWithVision = async (filepath, languageHints = ['ur', 'hi', 'en', 'pa']) => {
  const response = await axios.post(`${API_URL}/ocr/process-vision`, { 
    filepath,
    language_hints: languageHints 
  });
  return response.data;
};

export const translateText = async (text, sourceLang, targetLang) => {
  const response = await axios.post(`${API_URL}/translate/text`, {
    text,
    source_lang: sourceLang,
    target_lang: targetLang,
  });
  return response.data;
};

// Translate PDF document with domain-specific terms
export const translateDocument = async (file, sourceLang, targetLang) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('source_lang', sourceLang);
  formData.append('target_lang', targetLang);
  
  const response = await axios.post(`${API_URL}/translate/document`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 300000, // 5 minute timeout for large documents
  });
  return response.data;
};

// Get real-time stats from backend
export const getStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/ocr/stats`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return {
      success: false,
      data: {
        total_processed: 0,
        success_rate: 0,
        avg_processing_time: 0,
        accuracy_rate: 0,
        farmers_registered: 0,
        parcels_linked: 0,
        pending_records: 0,
        language_distribution: { urdu: 0, hindi: 0, english: 0 }
      }
    };
  }
};

// Get list of documents
export const getDocuments = async (page = 1, perPage = 10, status = null) => {
  try {
    const params = new URLSearchParams({ page, per_page: perPage });
    if (status) params.append('status', status);
    
    const response = await axios.get(`${API_URL}/ocr/documents?${params}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    return { success: false, data: { documents: [], total: 0 } };
  }
};

// Get single document details
export const getDocument = async (docId) => {
  try {
    const response = await axios.get(`${API_URL}/ocr/documents/${docId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch document:', error);
    return { success: false, error: 'Failed to fetch document' };
  }
};

// Get district progress
export const getDistrictProgress = async () => {
  try {
    const response = await axios.get(`${API_URL}/ocr/district-progress`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch district progress:', error);
    return { success: false, data: [] };
  }
};

// New endpoints for PDF and AI features

export const generatePDF = async (documentId) => {
  try {
    const response = await axios.post(`${API_URL}/ocr/generate-pdf/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const downloadPDF = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/ocr/download-pdf/${documentId}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `document_${documentId}_ocr.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to download PDF:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const summarizeDocument = async (documentId, summaryType = 'general') => {
  try {
    const response = await axios.post(`${API_URL}/ocr/summarize/${documentId}`, {
      type: summaryType
    });
    return response.data;
  } catch (error) {
    console.error('Failed to summarize document:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const askQuestionAboutDocument = async (documentId, question) => {
  try {
    const response = await axios.post(`${API_URL}/ocr/ask-question/${documentId}`, {
      question
    });
    return response.data;
  } catch (error) {
    console.error('Failed to ask question:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export const saveDocumentToDatabase = async (documentId, metadata = {}) => {
  try {
    const response = await axios.post(`${API_URL}/ocr/save-to-database/${documentId}`, metadata);
    return response.data;
  } catch (error) {
    console.error('Failed to save document:', error);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// Check backend health
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { status: 'unhealthy' };
  }
};
