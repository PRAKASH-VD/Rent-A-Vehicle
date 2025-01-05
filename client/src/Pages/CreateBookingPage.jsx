import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import BookingService from "../services/BookingService";


const CreateBookingPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    vehicleId: id,
    name: "",
    date: "",
    time: "",
    partySize: "",
    specialRequests: "",
    status: "confirmed",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await BookingService.createBooking(formData);
      toast.success("Booking created successfully!"); // Success toast
      navigate("/user-dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to create booking."); // Error toast
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-yellow-400 mb-6"
      >
        Create a Booking
      </motion.h1>

      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-8 shadow-lg rounded-lg"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-600"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-300 font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="time" className="block text-gray-300 font-medium mb-2">
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="partySize" className="block text-gray-300 font-medium mb-2">
            Party Size
          </label>
          <input
            type="number"
            id="partySize"
            name="partySize"
            value={formData.partySize}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="specialRequests" className="block text-gray-300 font-medium mb-2">
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Any special requests?"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 255, 0, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="ml-24 bg-yellow-500 font-semibold text-gray-950 py-3 px-3 rounded-lg transition duration-300 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Submit Booking
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default CreateBookingPage;