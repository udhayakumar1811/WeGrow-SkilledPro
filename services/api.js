import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Smart Fallback Base URLs (Primary: Wi-Fi IP, Secondary: Localhost/10.0.2.2)
const PRIMARY_IP = "10.83.42.127";
const BASE_URL = `http://${PRIMARY_IP}:4000/api/v1`;

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 Seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error fetching token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  },
);

export default API;
