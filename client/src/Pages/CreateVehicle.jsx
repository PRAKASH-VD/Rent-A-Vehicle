import React, { useState } from 'react';  
import { motion } from 'framer-motion';  
import { toast, ToastContainer } from 'react-toastify'; // Importing ToastContainer and toast  
import vehicleService from '../services/vehicleService'; // Adjust path if necessary  
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles  

const CreateVehicle = () => {  
  const [name, setName] = useState('');  
  const [description, setDescription] = useState('');  
  const [type, setType] = useState('');  
  const [priceRange, setPriceRange] = useState('');  
  const [city, setCity] = useState('');  
  const [features, setFeatures] = useState([]);  

  const handleSubmit = async (e) => {  
    e.preventDefault();  

    if (!name || !description || !type || !priceRange || !city) {  
      toast.error('All fi+elds are required');  
      return;  
    }  

    const newVehicle = {  
      name,  
      description,  
      type,  
      priceRange,  
      location: city,  
      features,  
    };  
    console.log('newVehicle:', newVehicle);
    console.log('city' , city)

    try {  
      await vehicleService.createVehicle(newVehicle);  
      toast.success('Vehicle created successfully!');  
      // Reset form fields after successful creation  
      setName('');  
      setDescription('');  
      setType('');  
      setPriceRange('');  
      setCity('');  
      setFeatures([]);  
    } catch (error) {  
      toast.error('Failed to create vehicle');  
      console.error('Error creating vehicle:', error);  
    }  
  };  

  return (  
    <div className="min-h-screen bg-black flex items-center justify-center">  
      <motion.div  
        initial={{ opacity: 0 }}  
        animate={{ opacity: 1 }}  
        transition={{ duration: 0.5 }}  
        className="max-w-4xl w-full p-6 bg-gray-950 text-white shadow-lg rounded-lg"  
      >  
        <h2 className="text-2xl font-bold text-center mb-6">Create a Vehicle</h2>  

        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick={true} rtl={false} pauseOnFocusLoss draggable pauseOnHover />  

        <form onSubmit={handleSubmit}>  
          <div className="mb-4">  
            <label htmlFor="name" className="block text-sm font-semibold">Vehicle Name</label>  
            <input  
              type="text"  
              id="name"  
              value={name}  
              onChange={(e) => setName(e.target.value)}  
              className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"  
              placeholder="Enter vehicle name"  
              required  
            />  
          </div>  

          <div className="mb-4">  
            <label htmlFor="description" className="block text-sm font-semibold">Description</label>  
            <textarea  
              id="description"  
              value={description}  
              onChange={(e) => setDescription(e.target.value)}  
              className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"  
              placeholder="Enter vehicle description"  
              required  
            />  
          </div>  

          <div className="mb-4">  
            <label htmlFor="type" className="block text-sm font-semibold">Type</label>  
            <input  
              type="text"  
              id="cuisine"  
              value={cuisine}  
              onChange={(e) => setType(e.target.value)}  
              className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"  
              placeholder="Enter  type"  
              required  
            />  
          </div>  

          <div className="mb-4">  
            <label htmlFor="priceRange" className="block text-sm font-semibold">Price Range</label>  
            <input  
              type="number"  
              id="priceRange"  
              value={priceRange}  
              onChange={(e) => setPriceRange(e.target.value)}  
              className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"  
              placeholder="Enter price range"  
              required  
            />  
          </div>  

          <div className="mb-4">  
            <label htmlFor="city" className="block text-sm font-semibold">City</label>  
            <input  
              type="text"  
              id="city"  
              value={city}  
              onChange={(e) => setCity(e.target.value)}  
              className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"  
              placeholder="Enter city (e.g., Trichy, Chennai, Madurai)"  
              required  
            />  
          </div>  

          <div className="mb-4">  
            <label htmlFor="features" className="block text-sm font-semibold">Features</label>  
            <select  
              id="features"  
              multiple  
              value={features}  
              onChange={(e) => setFeatures(Array.from(e.target.selectedOptions, option => option.value))}  
              className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"  
            >  
              <option value="Open Type">Open Type</option>  
              <option value="With-Out Driver">With-Out Driver</option>  
              <option value="with Driver">with Driver</option>  
              <option value="Wheelchair Accessible">Wheelchair Accessible</option>  
              <option value="Wi-Fi">Wi-Fi</option>  
            </select>  
          </div>  

          <div className="text-center">  
            <button  
              type="submit"  
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-900"  
            >  
              Create Vehicle  
            </button>  
          </div>  
        </form>  
      </motion.div>  
    </div>  
  );  
};  

export default CreateVehicle;