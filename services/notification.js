import API from "./api";

// 1. Get Notifications List (with pagination)
export const getNotificationsAPI = async (page = 1, limit = 10) => {
  try {
    const response = await API.get(
      `/notifications?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 2. Mark Notification as Read
export const markNotificationAsReadAPI = async (notificationId) => {
  try {
    const response = await API.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
