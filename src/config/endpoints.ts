export const ENDPOINTS = {
  router: {
    url: import.meta.env.VITE_ROUTER_ENDPOINT || '',
    apiKey: import.meta.env.VITE_ROUTER_API_KEY || '',
    deploymentName: import.meta.env.VITE_ROUTER_DEPLOYMENT || 'model-router',
  },
  standard: {
    url: import.meta.env.VITE_STANDARD_ENDPOINT || '',
    apiKey: import.meta.env.VITE_STANDARD_API_KEY || '',
    deploymentName: import.meta.env.VITE_STANDARD_DEPLOYMENT || 'gpt-4.1',
  },
};

export const API_VERSION = '2024-10-21';
