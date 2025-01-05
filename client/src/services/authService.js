import axios from 'axios';

const API_URL = 'https://table-reservation-m21o.onrender.com/api/auth';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  

};

export default { login, register, logout };