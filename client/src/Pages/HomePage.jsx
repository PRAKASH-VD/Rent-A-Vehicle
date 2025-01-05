// src/components/Home.js  
import React from "react";  
import { Link } from "react-router-dom";  
import { motion } from "framer-motion";   

const Home = () => {  
  return (  
    <div  
      className="min-h-screen flex items-center justify-center bg-gray-900 relative"  
      style={{  
        backgroundImage: "url('/pexels-alteredsnaps-15240691.jpg')",  
        backgroundSize: "cover", // Ensure the image covers the screen  
        backgroundPosition: "center",  
        backgroundRepeat: "no-repeat",  
      }}  
    >  
      <div className="absolute inset-0 bg-black bg-opacity-60"></div> {/* Dark overlay for better text contrast */}  
      <motion.div  
        initial={{ opacity: 0, y: -100 }}  
        animate={{ opacity: 1, y: 0 }}  
        transition={{ duration: 1.5, ease: "easeInOut" }}  
        className="relative text-center z-10"  
      >  
        <h1  
          className="text-6xl font-extrabold mb-6 text-white drop-shadow-lg bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 animate-pulse"  
        >  
          Welcome to Our Service  
        </h1>  
        <p className="text-xl text-gray-300 mb-10">  
          Join us to unlock exclusive features and tailored experiences just for you!  
        </p>  

        <motion.div  
          initial={{ opacity: 0, y: 100 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}  
          className="flex justify-center gap-8 mb-6"  
        >  
          <Link  
            to="/user-login"  
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-green-400/50 hover:scale-110 transition transform duration-500"  
          >  
            Login as User  
          </Link>  
          <Link  
            to="/admin-login"  
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-pink-400/50 hover:scale-110 transition transform duration-500"  
          >  
            Login as Admin 
          </Link>  
        </motion.div>  

        <motion.div  
          initial={{ opacity: 0, y: 100 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}  
        >  
          <Link  
            to="/vehicles"  
            className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-indigo-400/50 hover:scale-110 transition transform duration-500"  
          >  
            Browse Vehicles  
          </Link>  
        </motion.div>  
      </motion.div>  
    </div>  
  );  
};  

export default Home;