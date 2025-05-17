// Determine if we're in development or production
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Use local URL for development, Vercel URL for production
const API_URL = isDevelopment 
  ? 'http://localhost:3000'
  : 'https://genimage-backend.vercel.app';

export default API_URL;