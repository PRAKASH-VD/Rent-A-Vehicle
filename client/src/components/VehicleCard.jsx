import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <img
        src={vehicle.images[0] || '/placeholder.jpg'}
        alt={vehicle.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{vehicle.name}</h3>
        <p className="text-sm text-gray-600">{vehicle.cuisine} • {vehicle.priceRange}</p>
        <Link
          to={`/vehicles/${vehicle._id}`}
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;