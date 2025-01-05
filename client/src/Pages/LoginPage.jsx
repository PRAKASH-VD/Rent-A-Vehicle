import { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      toast.success('Login successful');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <motion.div
        className="p-8 bg-gray-800 rounded shadow-md w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-500 text-center">Login</h2>
        <form onSubmit={handleLogin} className="relative">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-600 text-gray-500 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-600 text-gray-500 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <motion.button
            type="submit"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2/3 bg-yellow-400 text-gray-950 font-semibold py-2 rounded hover:shadow-lg hover:bg-yellow-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>
        <p className="text-center mt-12 text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="text-yellow-400 hover:text-yellow-300">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;