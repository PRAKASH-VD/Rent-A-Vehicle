import axios from "axios";

const API_URL = "https://rent-a-vehicle.onrender.com/api/bookings";

const createBooking = async (bookingData) => {
  try {   
    const token = localStorage.getItem("userToken" ,"adminToken");
    const response = await axios.post(`${API_URL}`, bookingData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error.response?.data || error);
    throw error.response?.data || error;
  }
};



const updateBooking = async (bookingId, bookingData, token) => {
  const response = await axios.put(`${API_URL}/${bookingId}`, bookingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteBooking = async (bookingId, token) => {
  const response = await axios.delete(`${API_URL}/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getVehicleBookings = async (vehicleId, token) => {
  const response = await axios.get(`${API_URL}/vehicle/${vehicleId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default {
  createBooking,
  updateBooking,
  getVehicleBookings,
  deleteBooking,
};