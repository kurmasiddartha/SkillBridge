import axios from "axios";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  if (url.endsWith("/api") || url.endsWith("/api/")) {
    return url;
  }
  return url.endsWith("/") ? `${url}api` : `${url}/api`;
};

const api = axios.create({
  baseURL: getBaseURL()
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillbridgeToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
