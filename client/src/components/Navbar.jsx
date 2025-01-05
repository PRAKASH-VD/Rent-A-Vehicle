import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTable,  FaUtensils,FaSearch, FaClipboard, FaUserAlt, FaSignOutAlt, FaBuilding } from "react-icons/fa"; // Different icons for the navbar
import { motion } from "framer-motion"; // For animations

const Navbar = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const adminToken = localStorage.getItem("adminToken");

  const handleLogout = () => {
    if (userToken) {
      localStorage.removeItem("userToken");
    } else if (adminToken) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("vehicle");
    }
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-600 text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <NavLink to="/" className="text-3xl font-bold text-yellow-600 hover:text-yellow-700 transition duration-300">
         {/* < FaUtensils className="inline-block mr-2 text-blue-500" />  */}
         <link rel="icon" href="./key-card.pgn" />
          Rentel `Vehicle` Master
        </NavLink>

        <ul className="flex space-x-6">
          {userToken && (
            <>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <NavLink
                  to="/vehicles"
                  className="text-lg hover:text-yellow-500 transition duration-300 relative group"
                  activeClassName="text-yellow-500"
                >
                  <FaSearch className="inline-block mr-2" />
                  Explore Vehicles
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <NavLink
                  to="/recommendations"
                  className="text-lg hover:text-yellow-500 transition duration-300 relative group"
                  activeClassName="text-yellow-500"
                >
                  <FaClipboard className="inline-block mr-2" />
                  Recommendations
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <NavLink
                  to="/reservations"
                  className="text-lg hover:text-yellow-500 transition duration-300 relative group"
                  activeClassName="text-yellow-500"
                >
                  <FaClipboard className="inline-block mr-2" />
                  Booking
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <NavLink
                  to="/user-dashboard"
                  className="text-lg hover:text-yellow-500 transition duration-300 relative group"
                  activeClassName="text-yellow-500"
                >
                  <FaUserAlt className="inline-block mr-2" />
                  User Dashboard
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <button
                  onClick={handleLogout}
                  className="text-lg hover:text-yellow-500 transition duration-300"
                >
                  <FaSignOutAlt className="inline-block mr-2" />
                  Logout
                </button>
              </motion.li>
            </>
          )}

          {adminToken && (
            <>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <NavLink
                  to="/create-restaurant"
                  className="text-lg hover:text-yellow-500 transition duration-300 relative group"
                  activeClassName="text-yellow-500"
                >
                  <FaBuilding className="inline-block mr-2" />
                  Create Restaurant
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <NavLink
                  to="/admin-reservations"
                  className="text-lg hover:text-yellow-500 transition duration-300 relative group"
                  activeClassName="text-yellow-500"
                >
                  <FaClipboard className="inline-block mr-2" />
                  Admin Reservations
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <NavLink
                  to="/admin-dashboard"
                  className="text-lg hover:text-yellow-500 transition duration-300 relative group"
                  activeClassName="text-yellow-500"
                >
                  <FaUserAlt className="inline-block mr-2" />
                  Admin Dashboard
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <NavLink
                  to="/admin-reviews"
                  className="text-lg hover:text-yellow-500 transition duration-300 relative group"
                  activeClassName="text-yellow-500"
                >
                  <FaUserAlt className="inline-block mr-2" />
                  Admin Reviews
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </NavLink>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <button
                  onClick={handleLogout}
                  className="text-lg hover:text-yellow-500 transition duration-300"
                >
                  <FaSignOutAlt className="inline-block mr-2" />
                  Logout
                </button>
              </motion.li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;