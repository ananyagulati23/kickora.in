// Performance Monitoring Utility
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

export default reportWebVitals;

// Log to console in development
export const logPerformanceMetrics = () => {
  reportWebVitals((metric) => {
    console.log(`[Performance] ${metric.name}:`, metric.value);
  });
};

// Send to analytics (implement with your analytics service)
export const sendToAnalytics = (metric) => {
  const body = JSON.stringify(metric);
  const url = '/api/analytics'; // Replace with your analytics endpoint
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
};
