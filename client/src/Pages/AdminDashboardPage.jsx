import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { motion } from "framer-motion";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalBookings: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("adminToken");
  const decoded = jwtDecode(token);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://rent-a-vehicle.onrender.com/api/admin/dashboard", //need rendorline
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { stats } = response.data;
        setStats({
          totalUsers: stats.totalUsers,
          totalVehicles: stats.totalVehicles,
          totalBookings: stats.totalBookings,
          totalReviews: stats.totalReviews,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 mt-10">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Admin Dashboard
        </motion.h1>

        {loading ? (
          <motion.p
            className="text-center text-xl text-blue-400 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          >
            Loading data...
          </motion.p>
        ) : error ? (
          <motion.p
            className="text-center text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {error}
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            {/* Total Users */}
            <motion.div
              className="p-8 h-52  bg-gray-900 rounded-xl shadow-lg flex flex-col items-center justify-center"
              variants={cardVariants}
            >
              <h2 className="text-2xl font-bold text-blue-400 mb-2">Total Users</h2>
              <p className="text-5xl font-extrabold">{stats.totalUsers}</p>
            </motion.div>

            {/* Total Vehicles */}
            <motion.div
              className="p-8 h-52 bg-gray-900 rounded-xl shadow-lg flex flex-col items-center justify-center"
              variants={cardVariants}
            >
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                Total Vehicles
              </h2>
              <p className="text-5xl font-extrabold">{stats.totalVehicles}</p>
            </motion.div>

            {/* Total Bookings */}
            <motion.div
              className="p-8 h-52 bg-gray-900 rounded-xl shadow-lg flex flex-col items-center justify-center"
              variants={cardVariants}
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                Total Bookings
              </h2>
              <p className="text-5xl font-extrabold">{stats.totalBookings}</p>
            </motion.div>

            {/* Total Reviews */}
            <motion.div
              className="p-8 h-52 bg-gray-900 rounded-xl shadow-lg flex flex-col items-center justify-center"
              variants={cardVariants}
            >
              <h2 className="text-2xl font-bold text-red-400 mb-2">Total Reviews</h2>
              <p className="text-5xl font-extrabold">{stats.totalReviews}</p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};




export default AdminDashboardPage;