// AI API Configuration
// Add your free API keys here

export const AI_CONFIG = {
  // Google Gemini API (Primary - Excellent for Islamic content)
  // Using provided API key
  GEMINI_API_KEY: 'AIzaSyAMVDhnWWXDWeRVfF-Crq-HkTYdMB5oCVo',

  // Groq API (Backup - Free tier: 14,400 requests/day)
  // Get free API key from: https://console.groq.com/
  GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',

  // Hugging Face API (Backup - Free tier: 1000 requests/month)
  // Get free API key from: https://huggingface.co/settings/tokens
  HUGGING_FACE_TOKEN: process.env.NEXT_PUBLIC_HF_TOKEN || '',

  // Fallback to local responses if no API keys
  USE_LOCAL_FALLBACK: true,

  // API endpoints
  ENDPOINTS: {
    GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    GROQ: 'https://api.groq.com/openai/v1/chat/completions',
    HUGGING_FACE: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
  },

  // Model configurations
  MODELS: {
    GEMINI: 'gemini-1.5-flash-latest', // Excellent for Islamic content and fast
    GROQ: 'llama3-8b-8192', // Fast and good for Islamic content
    HUGGING_FACE: 'microsoft/DialoGPT-medium',
  }
};

// Instructions for getting free API keys:
/*
1. GROQ API (Recommended - Fast and Free):
   - Visit: https://console.groq.com/
   - Sign up for free account
   - Go to API Keys section
   - Create new API key
   - Add to .env.local: NEXT_PUBLIC_GROQ_API_KEY=gsk_your_key_here

2. Hugging Face API (Backup):
   - Visit: https://huggingface.co/settings/tokens
   - Sign up for free account
   - Create new token with "Read" permission
   - Add to .env.local: NEXT_PUBLIC_HF_TOKEN=hf_your_token_here

3. Create .env.local file in project root with:
   NEXT_PUBLIC_GROQ_API_KEY=gsk_your_groq_key_here
   NEXT_PUBLIC_HF_TOKEN=hf_your_huggingface_token_here

Note: The app will work with local Islamic responses even without API keys!
*/
