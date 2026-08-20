import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// AWS EC2 Deployed Live Backend Base URL
export const BASE_URL = "https://wegrow-connect-backend-1.onrender.com/api/v1";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 Seconds Timeout for slower mobile networks
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach JWT Bearer Token automatically
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error attaching token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Uniform Error Handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data || error);
  },
);

export default API;
