import API from "./api";

// 1. Get All Events / Workshops (with Pagination)
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

// 2. Get Event Details By ID
export const getEventByIdAPI = async (eventId) => {
  try {
    const response = await API.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 3. Create New Event / Workshop
export const createEventAPI = async (eventData) => {
  try {
    const response = await API.post("/events/create-event", eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 4. Update Event / Workshop By ID
export const updateEventAPI = async (eventId, updatedData) => {
  try {
    const response = await API.put(`/events/${eventId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
