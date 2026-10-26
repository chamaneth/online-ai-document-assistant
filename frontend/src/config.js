// Centralized Application Configuration & API Environment Settings
const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

// Auto-correct to your live Render primary URL if missing or using the old URL without '-1'
export const API_BASE_URL = 
  (!envUrl || envUrl === 'https://online-ai-document-assistant.onrender.com' || envUrl === 'http://127.0.0.1:8000')
    ? 'https://online-ai-document-assistant-1.onrender.com'
    : envUrl;

export const API_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY || 'YOUR_API_SECRET_KEY';

