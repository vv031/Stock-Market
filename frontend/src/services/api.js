import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      throw new Error(error.response.data.detail || 'API request failed');
    } else if (error.request) {
      throw new Error('Network error - please check your connection');
    } else {
      throw new Error('Request configuration error');
    }
  }
);

// API functions
export const fetchCompanies = async () => {
  try {
    const response = await api.get('/companies/');
    return response;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const fetchCompany = async (symbol) => {
  try {
    const response = await api.get(`/companies/${symbol}`);
    return response;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
};

export const fetchStockData = async (symbol, days = 30) => {
  try {
    const response = await api.get(`/stocks/${symbol}/historical?days=${days}`);
    return response;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const fetchStockInfo = async (symbol) => {
  try {
    const response = await api.get(`/stocks/${symbol}/info`);
    return response;
  } catch (error) {
    console.error('Error fetching stock info:', error);
    throw error;
  }
};

export const fetchPrediction = async (symbol) => {
  try {
    const response = await api.get(`/predictions/${symbol}/predict`);
    return response;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};

export const fetchPredictionHistory = async (symbol) => {
  try {
    const response = await api.get(`/predictions/${symbol}/history`);
    return response;
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    throw error;
  }
};

// Health check
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data.status === 'healthy';
  } catch (error) {
    return false;
  }
};

export default api;
