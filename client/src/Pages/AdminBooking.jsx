import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AdminBookingPage = ({ currentUser }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all vehicles owned by the admin on Amount
  const token = localStorage.getItem("adminToken");
  const decoded = jwtDecode(token); 
  console.log(token);
  
  console.log(decoded);
  console.log(decoded.id);
const adminId = decoded.id;
  useEffect(() => {
    const fetchOwnedRestaurants = async () => {
      try {
        const response = await axios.get("https://table-reservation-m21o.onrender.com/api/restaurants",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include auth token
            },
          }
        );
        setVehicles(response.data);
        const ownedVehicles = response.data.filter(
          (vehicle) => vehicle.owner?._id === adminId
        );

        setVehicles(ownedVehicles);

      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to load your vehicles.");
      }
    };

    fetchOwnedVehicles();
  }, [currentUser]);
  localStorage.setItem("vehicle", JSON.stringify(selectedVehicle));
  // Fetch bookings when a vehicle is selected
  useEffect(() => {
    if (!selectedVehicle) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://table-reservation-m21o.onrender.com/api/reservations/restaurant/${selectedVehicle}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include auth token
            },
          }
        );
        setBookings(response.data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedVehicle, currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-10 mt-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Admin Booking Dashboard
        </h1>

        {/* Vehicle Selector */}
        <div className="mb-8">
          <label htmlFor="vehicle-select" className="block text-lg mb-2">
            Select a Vehicle that Created by You :
          </label>
          <select
            id="vehicle-select"
            className="w-full p-3 bg-gray-800 text-white rounded-lg"
            value={selectedVehicle || ""}
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            <option value="" disabled>
              -- Select a Vehicle --
            </option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle booking */}
        {loading ? (
          <p className="text-center text-xl text-blue-400 animate-pulse">
            Loading Bookings...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : bookings.length > 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700 text-gray-300">
                  <th className="px-4 py-3 border-b border-gray-600">Name</th>
                  <th className="px-4 py-3 border-b border-gray-600">Email</th>
                  <th className="px-4 py-3 border-b border-gray-600">
                    Booking Date
                  </th>
                  <th className="px-4 py-3 border-b border-gray-600">
                    Booking Time
                  </th>
                  <th className="px-4 py-3 border-b border-gray-600">Guests</th>
                  <th className="px-4 py-3 border-b border-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                    } hover:bg-gray-700 transition duration-200`}
                  >
                    <td className="px-4 py-3 border-b border-gray-600">
                      {booking.user?.name || "Anonymous"}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-600">
                      {booking.user?.email || "Not provided"}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-600">
                      {new Date(booking.date).toLocaleDateString() || "N/A"}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-600">
                      {booking.time || "N/A"}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-600">
                      {booking.PartySize || "N/A"}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-600">
                      { "Conformed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          selectedVehicle && (
            <p className="text-center text-gray-400">
              No bookings found for this Vehicle.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default AdminBookingPage;