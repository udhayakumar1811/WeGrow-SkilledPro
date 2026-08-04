import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api";

// 1. Login
export const loginAPI = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    const data = response.data;
    if (data?.data?.accessToken || data?.accessToken) {
      const token = data?.data?.accessToken || data?.accessToken;
      const user = data?.data?.user || data?.user;
      await AsyncStorage.setItem("accessToken", token);
      if (user?.role) {
        await AsyncStorage.setItem("userRole", user.role);
      }
    }
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 2. Student Register
export const registerStudentAPI = async (studentData) => {
  try {
    const response = await API.post("/auth/register/student", studentData);
    const data = response.data;
    if (data?.data?.accessToken || data?.accessToken) {
      const token = data?.data?.accessToken || data?.accessToken;
      await AsyncStorage.setItem("accessToken", token);
      await AsyncStorage.setItem("userRole", "STUDENT");
    }
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 3. Business Register
export const registerBusinessAPI = async (businessData) => {
  try {
    const response = await API.post("/auth/register/business", businessData);
    const data = response.data;
    if (data?.data?.accessToken || data?.accessToken) {
      const token = data?.data?.accessToken || data?.accessToken;
      await AsyncStorage.setItem("accessToken", token);
      await AsyncStorage.setItem("userRole", "BUSINESS");
    }
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 4. Get Current Logged-in User Profile
export const getUserProfileAPI = async () => {
  try {
    const response = await API.get("/users/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 5. Logout
export const logoutAPI = async () => {
  try {
    await API.post("/auth/logout");
  } catch (error) {
    console.log("Logout API error:", error);
  } finally {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("userRole");
  }
};
