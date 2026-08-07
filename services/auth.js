import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api";

// 1. Login API
export const loginAPI = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 2. Student Register API
export const registerStudentAPI = async (studentData) => {
  try {
    const response = await API.post("/auth/register/student", studentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 3. Business Register API
export const registerBusinessAPI = async (businessData) => {
  try {
    const response = await API.post("/auth/register/business", businessData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 4. Logout API
export const logoutAPI = async () => {
  try {
    const response = await API.post("/auth/logout");
    await AsyncStorage.multiRemove(["userToken", "userRole"]);
    return response.data;
  } catch (error) {
    await AsyncStorage.multiRemove(["userToken", "userRole"]);
    throw error.response?.data || error;
  }
};

// 5. Get User Profile API
export const getUserProfileAPI = async () => {
  try {
    const response = await API.get("/users/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
