import React, { useState } from "react";
import reviewServices from "../services/reviewServices";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewForm = ({ onSubmit }) => {
  const { vehicle_id: vehicleId } = useParams(); // Get vehicle ID from URL
  const [user, setUser] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      vehicleId,
      user,
      rating,
      comment,
    };
          toast.success("Review submitted successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        navigate("/user-dashboard"); 
    try {
      const response = await reviewServices.createReview(formData);

      if (response.status === 200) {
        toast.success("Review submitted successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        navigate("/user-dashboard"); // Redirect to user dashboard
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.message;
        toast.error(`review submmited: ${errorMessage}`, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("review submitted , some error occur", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <ToastContainer /> {/* ToastContainer to render the toasts */}
      <motion.div
        className="p-6 w-full max-w-md mx-auto mt-16 bg-gray-900 shadow-lg rounded-lg "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit}>
          <motion.h1
            className="text-2xl font-bold text-gray-200 text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Submit Your Review
          </motion.h1>

          {/* User Field */}
          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-gray-300 font-medium mb-2">User</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              placeholder="Enter your name or ID"
              className="w-full p-2 text-sm rounded-lg bg-gray-600 text-gray-200 placeholder-gray-350 focus:outline-none focus:ring focus:ring-yellow-500"
            />
          </motion.div>

          {/* Rating Field */}
          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <label className="block text-gray-300 font-medium mb-2">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              placeholder="Rate out of 5"
              className="w-full p-2 text-sm rounded-lg bg-gray-600 text-gray-200 placeholder-gray-350 focus:outline-none focus:ring focus:ring-yellow-500"
            />
          </motion.div>

          {/* Comment Field */}
          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label className="block text-gray-300 font-medium mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Write your comments here"
              className="w-full p-2 text-sm rounded-lg bg-gray-600 text-gray-200 placeholder-gray-350 focus:outline-none focus:ring focus:ring-yellow-500"
              rows="3"
            ></textarea>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="flex justify-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              type="submit"
              className="bg-yellow-500 text-gray-950 font-bold py-1 px-6 text-sm rounded-lg hover:bg-yellow-600 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ReviewForm;