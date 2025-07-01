import axios from "axios";

/**
 * Central API utility for configuring axios and base URL for backend requests.
 * 
 * Usage: import { api, API_BASE } from "./api";
 * - api: preconfigured Axios instance with Authorization attached if token is present.
 * - API_BASE: the base URL string for ad-hoc (non-instance) requests.
 */
export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://your-prod-backend-url.com");

const api = axios.create({
  baseURL: API_BASE,
});

// PUBLIC_INTERFACE
/** 
 * Attach token (if present in localStorage) to requests.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api };
