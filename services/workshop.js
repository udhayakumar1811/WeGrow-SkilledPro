import API from "./api";

// 1. Fetch All Events/Workshops from API
export const getAllEventsAPI = async (page = 1, limit = 10) => {
  try {
    const response = await API.get(
      `/events/all-event?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 2. Fetch Event By ID
export const getEventByIdAPI = async (eventId) => {
  try {
    const response = await API.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 3. Create Booking
export const createBookingAPI = async (eventId) => {
  try {
    const response = await API.post("/bookings/create-booking", {
      event: eventId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 4. Get User My-Bookings
export const getMyBookingsAPI = async (page = 1, limit = 10) => {
  try {
    const response = await API.get(
      `/bookings/my-bookings?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 5. Cancel Booking
export const cancelBookingAPI = async (bookingId) => {
  try {
    const response = await API.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
