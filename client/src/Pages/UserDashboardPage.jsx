import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import userService from "../services/userServices"; // Service for user-related API calls
import reviewService from "../services/reviewServices"; // Service for review-related API calls
import { FaTrash } from "react-icons/fa"; // Import delete icon

const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const userData = await userService.getUserProfile();
        if (userData) {
          console.log("Fetched User Data:", userData);
          setUserDetails(userData);
        } else {
          toast.warn("User profile not found.");
        }

        // Fetch user reviews
        const response = await userService.getUserReviews();
        if (response?.reviews?.length > 0) {
          console.log("Fetched User Reviews:", response.reviews);
          setReviews(response.reviews); // Set reviews correctly
        } else {
          toast.info("No reviews found.");
          setReviews([]);
        }

        // Fetch user bookings
        const userBookings = await userService.getUserBooking();
        if (userBookings?.bookings?.length > 0) {
          console.log("Fetched User Bookings:", userBookings.bookings);
          setBookings(userBookings.bookings);
        } else {
          toast.info("No bookings found.");
          setBookings([]);
        }
      } catch (error) {
        toast.error("Failed to fetch user data. Please try again later.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );
      toast.success("Review deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete review.");
      console.error("Error deleting review:", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center font-bold text-xl bg-gray-950 text-gray-300 animate-pulse pt-80 h-screen">
        Loading...
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-950 p-10 text-gray-300 mt-10"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-8 text-center text-yellow-300 drop-shadow-lg glow-effect"
      >
        User Dashboard
      </motion.h1>

      {userDetails && (
        <div className="mb-8 bg-gray-900 text-gray-300 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-2xl font-bold mb-4 text-yellow-300">
            Profile Information
          </h2>
          <p className="mb-2">
            <strong>Name:</strong> {userDetails.name}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Role:</strong> {userDetails.role}
          </p>
        </div>
      )}

      <div className="mb-8">
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold mb-4 text-yellow-300"
        >
          Review History
        </motion.h2>
        {reviews.length > 0 ? (
          <div className="space-y-4 relative">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3 className="text-lg font-semibold text-yellow-300">
                  {review.vehicle?.name || "Unknown Vehicle"}
                </h3>
                <p className="text-gray-300 mt-2">{review.comment}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 font-bold">{review.rating}⭐️</span>
                </div>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="flex items-center absolute right-3 top-14 text-xs bg-red-500 text-white pl-1 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 group"
                >
                  <FaTrash className="mr-2 group-hover:animate-bounce" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-200">You have not posted any reviews yet.</p>
        )}
      </div>

      <div>
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold mb-4 text-yellow-300"
        >
          Booking History
        </motion.h2>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking._id}
                className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3 className="text-lg font-semibold text-yellow-300">
                  {booking.vehicle?.name || "Unknown Vehicle"}
                </h3>
                <p className="text-gray-300 mt-2">
                  <strong>Date:</strong>{" "}
                  {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="text-gray-300">
                  <strong>Slot:</strong> {booking.time}
                </p>
                <p className="text-gray-300">
                  <strong>Party Size:</strong> {booking.partySize}
                </p>
                <p className="text-gray-300">
                  <strong>Status:</strong>{" "}
                  <span className="font-semibold text-green-500">
                    Confirmed
                  </span>
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-200">You have no bookings yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default UserDashboard;