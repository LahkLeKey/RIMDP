import axios from 'axios';

const resolveBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_URL;
  if (!configuredBaseUrl) {
    return 'http://localhost:4000';
  }

  try {
    const parsedUrl = new URL(configuredBaseUrl);
    if (parsedUrl.hostname === 'host.docker.internal' &&
        window.location.hostname === 'localhost') {
      parsedUrl.hostname = 'localhost';
      return parsedUrl.toString();
    }
    return configuredBaseUrl;
  } catch {
    return configuredBaseUrl;
  }
};

const baseURL = resolveBaseUrl();

export const api = axios.create({baseURL});

export const setAuthToken = (token: string|null) => {
  if (!token) {
    delete api.defaults.headers.common.Authorization;
    return;
  }

  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};