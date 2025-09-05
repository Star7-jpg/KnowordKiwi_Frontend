import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import publicApiClient from "./publicApiClient";
import { useAuthStore } from "../store/authStore";

// Create a private API client for authenticated requests
const privateApiClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Function to refresh the access token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await publicApiClient.get("/auth/refresh-token");
    const { accessToken } = response.data.data;
    useAuthStore.getState().setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    useAuthStore.getState().clearAuth();
    return null;
  }
};

// Request interceptor to add access token to headers
privateApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 errors and token refresh
privateApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh the access token
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        // Update the authorization header with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // Retry the original request
        return privateApiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default privateApiClient;
