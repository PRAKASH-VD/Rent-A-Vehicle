import axios from 'axios';

const API_URL = 'https://rent-a-vehicle.onrender.com/api/vehicles';//need rendor link

const getAllVehicles = async (query = "") => {
  const response = await axios.get(`${API_URL}${query}`);
  console.log(`${API_URL}${query}`);
  
  return response.data;
  
};

const getVehicleDetails = async (vehicleId) => {
  const response = await axios.get(`${API_URL}/${vehicleId}`);
  console.log(vehicleId);
  return response.data;
 
};

const createVehicle = async (vehicleData) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.post(`${API_URL}`, vehicleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("createVehicle called with token:", token);
    return response.data;
  } catch (error) {
    console.error("Error creating vehicle:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.put(`${API_URL}/${vehicleId}`, vehicleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating vehicle:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

const deleteVehicle = async (vehicleId) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.delete(`${API_URL}/${vehicleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting vehicle:", error.response?.data || error);
    throw error.response?.data || error;
  }
};


export default {
  getAllVehicles,
  getVehicleDetails,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};