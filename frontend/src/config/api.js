/**
 * API Configuration
 * Centralized API URL management for different environments
 */

// Get API URL from environment variable or fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints prefix
export const API_PREFIX = '/api';

// Full API URL
export const API_URL = `${API_BASE_URL}${API_PREFIX}`;

// Environment detection
export const isDevelopment = import.meta.env.MODE === 'development';
export const isProduction = import.meta.env.MODE === 'production';

// Log current configuration in development
if (isDevelopment) {
  console.log('🔧 API Configuration:');
  console.log('  Base URL:', API_BASE_URL);
  console.log('  Full API URL:', API_URL);
  console.log('  Environment:', import.meta.env.MODE);
}

export default {
  API_BASE_URL,
  API_URL,
  isDevelopment,
  isProduction
};
