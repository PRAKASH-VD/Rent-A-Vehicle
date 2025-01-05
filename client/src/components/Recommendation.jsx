import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import recommendationService from "../services/recommendationService";

const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await recommendationService.getRecommendations(token);
        setRecommendations(data);
      } catch (err) {
        setError("Your details like reviews, ratings, and bookings are not enough to generate recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-semibold text-gray-200"
        >
          Loading recommendations...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Recommended Vehicles</h1>
        <p className="text-gray-400">Based on your preferences</p>
      </motion.div>

      {recommendations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-400"
        >
          No recommendations available.
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
          {recommendations.map((rec) => (
            <motion.div
              key={rec.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h3 className="text-lg font-bold text-yellow-500 mb-2">{rec.name}</h3>
              <p className="text-gray-400 mb-3">{rec.description}</p>
              <span className="text-sm text-gray-500">Rating: {rec.rating} ★</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Recommendation;