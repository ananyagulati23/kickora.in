import { API_CONFIG } from '../config/constants';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  login: async (username, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setAuthToken(response.access_token);
    return response;
  },

  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setAuthToken(response.access_token);
    return response;
  },

  googleAuth: async (code) => {
    const response = await apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    setAuthToken(response.access_token);
    return response;
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  logout: () => {
    removeAuthToken();
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Matches API calls
export const matchesAPI = {
  getAll: async () => {
    return await apiRequest('/matches');
  },

  getById: async (id) => {
    return await apiRequest(`/matches/${id}`);
  },

  book: async (matchId) => {
    return await apiRequest(`/matches/${matchId}/book`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  cancel: async (matchId) => {
    return await apiRequest(`/matches/${matchId}/cancel`, {
      method: 'POST',
    });
  },

  getUserBookings: async () => {
    return await apiRequest('/matches/user/bookings');
  },
};

// Testimonials API calls
export const testimonialsAPI = {
  getAll: async () => {
    return await apiRequest('/testimonials');
  },

  create: async (testimonialData) => {
    return await apiRequest('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  },

  update: async (id, testimonialData) => {
    return await apiRequest(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  },
};

// Gallery API calls
export const galleryAPI = {
  getAll: async (category = null) => {
    const params = category ? `?category=${category}` : '';
    return await apiRequest(`/gallery${params}`);
  },

  getCategories: async () => {
    return await apiRequest('/gallery/categories/list');
  },
};

// Payment API calls
export const paymentAPI = {
  create: async (paymentData) => {
    return await apiRequest('/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  process: async (paymentId) => {
    return await apiRequest(`/payment/${paymentId}/process`, {
      method: 'POST',
    });
  },

  getUserPayments: async () => {
    return await apiRequest('/payment/user/payments');
  },
};

const api = {
  auth: authAPI,
  matches: matchesAPI,
  testimonials: testimonialsAPI,
  gallery: galleryAPI,
  payment: paymentAPI,
};

export default api; 