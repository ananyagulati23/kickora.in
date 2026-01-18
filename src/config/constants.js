// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8002/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'Kickora',
  APP_URL: process.env.REACT_APP_URL || 'https://kickora.com',
  ADMIN_PASSWORD: 'Kickora@102938', // Move to env in production
  ADMIN_USERNAMES: ['admin', 'kickora_admin'],
  ADMIN_EMAILS: ['support@kickora.in']
};

// SEO Configuration
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Kickora - Book Your Football Match',
  DEFAULT_DESCRIPTION: 'Discover and book football matches in your city. Equipment, turf, and everything provided!',
  DEFAULT_KEYWORDS: 'football booking, soccer matches, sports booking, kickora',
  DEFAULT_IMAGE: '/og-image.jpg',
  TWITTER_HANDLE: '@kickora',
};

const CONFIG = {
  API_CONFIG,
  APP_CONFIG,
  SEO_CONFIG,
};

export default CONFIG;
