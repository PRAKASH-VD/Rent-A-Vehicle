import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import reviewServices from "../services/reviewServices";

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("adminToken");
  const id = JSON.parse(localStorage.getItem("vehicle"));

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewServices.getVehicleReviews(id, token);
        console.log("API Response:", data);
        setReviews(data);
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black mt-15">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-gray-200"
        >
          Loading reviews...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-red-500 text-lg"
        >
          {error}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-extrabold text-white">Vehicle Reviews</h1>
        <p className="text-gray-700 text-lg mt-2">Discover what our customers are saying!</p>
      </motion.div>

      {reviews.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {reviews.map((review) => (
            <motion.div
              key={review._id || review.id}
              className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transform transition-all hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">{review.user?.name || "Anonymous"}</h3>
                <span className="text-yellow-400 text-lg font-bold">{review.rating} ★</span>
              </div>
              <p className="text-gray-300 mb-4">{review.comment || "No comment provided."}</p>
              <span className="text-sm text-gray-500">{review.date}</span>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center h-64 bg-gray-800 rounded-lg shadow-xl"
        >
          <p className="text-gray-400 text-lg font-medium">No reviews found.</p>
        </motion.div>
      )}
    </div>
  );
};

export default AdminReview;