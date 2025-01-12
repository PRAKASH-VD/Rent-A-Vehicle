import axios from 'axios';

const API_URL = 'https://rent-a-vehicle.onrender.com/api/reviews'; 

// Function to create a review
const createReview = async (formData) => {
  try {
    const token = localStorage.getItem ('userToken','authToken'); 
    // Sending a POST request with reviewData and Authorization token
    const response = await axios.post(`${API_URL}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the JWT token for authorization
      },
    });

    // Return the response data (review created)
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error; // Rethrow the error to be handled in the calling function
  }
};

const updateReview = async (reviewId, reviewData, token) => {
  const response = await axios.put(`${API_URL}/${reviewId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteReview = async (reviewId) => {
  const token = localStorage.getItem('userToken');
  const response = await axios.delete(`${API_URL}/${reviewId}`, {
  headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getVehicleReviews = async (id,token) => {
  const response = await axios.get(`${API_URL}/vehicle/${id}`);
  return response.data;
  console.log("function called")
};

export default {
  createReview,
  updateReview,
  deleteReview,
  getVehicleReviews,
};