import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from './Pages/HomePage';
import VehicleListPage from './Pages/VehicleListPage';
import VehicleDetailsPage from './Pages/VehicleDetailsPage';
import ReviewForm from './Pages/ReviewForm';
import AdminReview from './Pages/AdminReview';
import Recommendation from './components/Recommendation';
import LoginPage from './Pages/LoginPage';
import LoginRegister from './Pages/LoginRegister';
import RegisterPage from './Pages/RegisterPage';
import UserLogin from './Pages/UserLogin';
import AdminLogin from './Pages/AdminLogin';
import CreateBookingPage from './Pages/CreateBookingPage';
import UserDashboardPage from './Pages/UserDashboardPage';
import CreateVehicles from './Pages/CreateVehicle';
import AdminBookingPage from './Pages/AdminBooking';
import UserBookingPage from './Pages/UserBookingPage';
import AdminDashboardPage from './Pages/AdminDashboardPage';


function App() {

  
  return ( 
    <Router> 
      <Navbar/>
      <div className="min-h-screen">
        <Routes>
{/* Common */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recommendations" element={<Recommendation />} />

{/* User */}
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-register" element={<LoginRegister />} />
          <Route path ="/user-dashboard" element={<UserDashboardPage />} />
          <Route path="/bookings" element={<UserBookingPage />} />

{/* Admin */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-bookings" element={<AdminBookingPage />} />
          <Route path="/admin-reviews" element={<AdminReview />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

{/* vehicles  */}
          <Route path="/vehicles" element={<VehicleListPage />} />
          <Route path="/createBooking/:id" element={<CreateBookingPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
          <Route path="/vehicles/review/:id" element={<ReviewForm />} />
          <Route path="/create-vehicle" element={<CreateVehicles />} />
        </Routes>
      </div>

         <ToastContainer
                  position="top-center"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                  transition={Slide}
         />      
    </Router>
  );
}

export default App;