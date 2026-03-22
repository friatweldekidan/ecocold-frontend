import axios, { type AxiosRequestHeaders } from "axios";

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "https://ecocold-backend.onrender.com";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {} as AxiosRequestHeaders;
  }
  const stored = localStorage.getItem("ecocold_auth");
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as { token?: string };
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch {
      // ignore malformed storage
    }
  }
  return config;
});

export default api;
