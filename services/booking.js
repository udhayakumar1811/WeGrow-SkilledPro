import API from "./api";

// 1. Create Booking API (POST)
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

// 2. Get My Bookings API (GET)
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

// 3. Cancel Booking API (DELETE)
export const cancelBookingAPI = async (bookingId) => {
  try {
    const response = await API.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 4. Update Booking Status API (PUT)
export const updateBookingStatusAPI = async (
  bookingId,
  status = "CONFIRMED",
) => {
  try {
    const response = await API.put(`/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 5. Get Booking Details By ID API (GET)
export const getBookingByIdAPI = async (bookingId) => {
  try {
    const response = await API.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 6. Get All Bookings API (Admin Purpose)
export const getAllBookingsAPI = async (page = 1, limit = 10) => {
  try {
    const response = await API.get(
      `/bookings/all-bookings?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
