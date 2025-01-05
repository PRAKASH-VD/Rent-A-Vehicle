import { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      localStorage.setItem('userToken', data.token);
      toast.success('Login as user successful');
      navigate('/restaurants');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950">
      <ToastContainer position="top-center" theme='dark' autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <motion.div
        className="p-8 bg-gray-900 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-300 mb-6">
          User Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-6 bg-yellow-500 text-gray-950 font-semibold rounded-lg hover:bg-yellow-600 hover:shadow-lg transition duration-300"
            whileHover={!loading ? { scale: 1.05, boxShadow: "0px 0px 8px rgba(255, 223, 0, 0.8)" } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <span
            className="text-yellow-500 cursor-pointer hover:underline"
            onClick={() => navigate("/user-register")}
          >
            Register
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;