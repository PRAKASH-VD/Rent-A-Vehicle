import axios from 'axios';

const API_URL = 'https://table-reservation-m21o.onrender.com/api';

const getRecommendations = async (token) => {
  const response = await axios.get(`${API_URL}/recommendations/personalized`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default { getRecommendations };