import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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

export const translateText = async (text, sourceLang, targetLang) => {
  const response = await axios.post(`${API_URL}/translate/text`, {
    text,
    source_lang: sourceLang,
    target_lang: targetLang,
  });
  return response.data;
};
