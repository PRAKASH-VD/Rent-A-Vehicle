import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import vehicleService from "../services/vehicleService";
import reviewService from "../services/reviewServices";
import { FaStar } from "react-icons/fa";

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const data = await vehicleService.getVehicleDetails(id);
        setVehicle({
          name: data.name || "Vehicle Name Not Found",
          description: data.description || "Description not found",
          type: data.type || " type not specified",
          priceRange: data.priceRange || "N/A",
          images: data.images.length > 0 ? data.images : [],
          rating: data.rating > 0 ? data.rating : 5,
          reviews: data.reviews.length > 0 ? data.reviews : [],
          menu: data.menu.length > 0 ? data.menu : [],
          openingHours: data.openingHours.length > 0 ? data.openingHours : [],
          features: data.features.length > 0 ? data.features : [],
          location:
            typeof data.location === "string" ? data.location : "Location not specified",
        });

        const reviewData = await reviewService.getVehicleReviews(id);
        setReviews(reviewData);

        toast.success("Vehicle details loaded successfully!");
      } catch (err) {
        setError("Failed to load vehicle details. Please try again.");
        toast.error("Error loading vehicle details!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  const handleBookVehicle = () => {
    toast.info("Navigating to Booking page...");
    navigate(`/createBooking/${id}`);
  };

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gray-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xl animate-pulse">Loading...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-10 mt-12 ">
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <motion.div
            className="h-96 bg-cover bg-center relative"
            style={{
            
              backgroundImage: `url(${
                vehicle.images[0] ||
                "https://source.unsplash.com/1200x800/?food,vehicle"
              })`,
            }}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <motion.h1
                className="text-5xl font-extrabold text-white drop-shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
              >
                {restaurant.name}
              </motion.h1>
            </div>
          </motion.div>

          <div className="p-8 flex flex-col lg:gap-8">
            <motion.div
              className="mb-6 lg:mb-0 flex justify-end"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={handleBookVehicle}
                className="bg-yellow-500 text-black py-4 px-12 font-semibold text-xl rounded-lg hover:bg-yellow-600 transition duration-200 w-full lg:w-auto"
              >
                Book Vehicle
              </button>
            </motion.div>

            <div className="lg:w-3/4">
              <p className="text-lg text-gray-300 mb-2">
                <strong>type: </strong>
                {vehicle.type}
              </p>
              <p className="text-lg text-gray-300 mb-2">
                <strong>Description: </strong>
                {vehicle.description}
              </p>

              <div className="flex items-center mb-2">
              <strong>Rating's:  </strong> 
                <FaStar className="text-yellow-400 text-xl ml-2"/>
                <span className="ml-2 text-xl font-semibold ">
                     {vehicle.rating}
                </span>
              </div>

              <p className="text-lg text-gray-300 mb-2">
                <strong>Price Range: </strong>₹{vehicle.priceRange}
              </p>

              {vehicle.features.length > 0 && (
                <div className="mb-2">
                  <strong>Features: </strong>
                  <ul className="list-disc pl-5 text-gray-300">
                    {vehicle.features.map((feature, index) => (
                      <motion.li key={index} whileHover={{ scale: 1.1 }}>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-2">
                <strong>Location: </strong>
                <p className="text-gray-300">{vehicle.location}</p>
              </div>

              <div className="mt-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold ">Reviews</h2>
                  <Link
                    to={`/vehicles/review/${id}`}
                    className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition duration-200 relative left-64"
                  >
                    Add Review
                  </Link>
                </div>
                <span className="text-gray-500"> (notes: Add your review's after the visit, else your review's not reflect...)</span>
                {reviews.length > 0 ? (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {reviews.map((review, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-700 p-4 rounded-lg shadow-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="text-lg font-semibold">
                          {review.user?.name || "Anonymous"}
                        </h3>
                        <p className="text-gray-300 mb-2">{review.comment}</p>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400" />
                          <span className="ml-2">{review.rating || 0} </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-gray-400 mt-4">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VehicleDetailsPage;