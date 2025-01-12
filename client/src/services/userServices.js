import axios from "axios";

const API_URL = "https://rent-a-vehicle.onrender.com/api/users";

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Intercept requests to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// User API functions
const getUserProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};
const getUserBooking = async () => {
  const response = await api.get("/bookings");
  return response.data;
};


const updateUserProfile = async (userData) => {
  const response = await api.put("/profile", userData);
  return response.data;
};

const getUserReviews = async()=>{
  const response = await api.get("/Reviews");
  return response.data;

}

const getUserFavorites = async () => {
  const response = await api.get("/favorites");
  return response.data;
};

const toggleFavoriteVehicle = async (vehicleId) => {
  const response = await api.post(`/favorites/${vehicleId}`);
  return response.data;
};

export default {
  getUserProfile,
  getUserReviews,
  updateUserProfile,
  getUserBooking,
  getUserFavorites,
  toggleFavoriteVehicle,
};