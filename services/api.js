import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// AWS EC2 Deployed Live Backend API Base URL
export const BASE_URL = "http://13.211.203.21/api/v1";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 Seconds Timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Bearer Token if logged in
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error attaching auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized / Token Expired");
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default API;
