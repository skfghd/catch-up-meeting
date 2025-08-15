// Firebase configuration for client-side
// This file handles API calls to Firebase Functions

const FIREBASE_FUNCTION_URL = import.meta.env.PROD 
  ? `https://${import.meta.env.VITE_FIREBASE_REGION || 'asia-northeast3'}-${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'kindtool-ai'}.cloudfunctions.net/app`
  : 'http://localhost:5001/kindtool-ai/asia-northeast3/app';

// Custom fetch wrapper for Firebase Functions
export async function firebaseApiRequest(url: string, options: RequestInit = {}) {
  const fullUrl = url.startsWith('/api/') ? `${FIREBASE_FUNCTION_URL}${url}` : url;
  
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status}: ${errorText}`);
  }

  return response.json();
}

// Health check function
export async function checkFirebaseHealth() {
  try {
    const result = await firebaseApiRequest('/api/health');
    return result;
  } catch (error) {
    console.error('Firebase health check failed:', error);
    throw error;
  }
}

// Configuration object for easy access
export const firebaseConfig = {
  functionsUrl: FIREBASE_FUNCTION_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'kindtool-ai',
  region: import.meta.env.VITE_FIREBASE_REGION || 'asia-northeast3'
};