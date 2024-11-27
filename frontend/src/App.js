import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import AdminDash from "./components/AdminComponent/AdminDash";
import Dashboard from "./components/AttendantComponent/Dashboard";
import Header from "./components/Header";
import BookingDetails from "./components/Profile/BookingDetails";
import BookingHistory from "./components/Profile/BookingHistory";
import UpcomingBooking from "./components/Profile/UpcomingBooking";
import UserProfile from "./components/Profile/UserProfile";
import AddressContact from "./components/services/AddressContact";
import BookingConfirmation from "./components/services/BookingConfirmation";
import { BookingProvider } from "./components/services/BookingContext";
import ContactDetails from "./components/services/ContactDetails";
import CustomDatePicker from "./components/services/CustomDatePicker";
import NursingServices from "./components/services/NursingServices";
import SelectOffer from "./components/services/SelectOffer";
import AttendantDetails from "./components/AttendantDetails";
import PaymentModal from "./components/PaymentModal";
import Admin from "./pages/Admin";
import Attendant from "./pages/Attendant";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import Time from "./pages/Time";
import AdminDashboard from "./pages/AdminDashboard";
import Waiting from "./components/services/Waiting";
import AssignedAttendant from './components/services/AssignedAttendant';

// Create a wrapper component to handle the conditional header rendering
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="App">
      <BookingProvider>
        {!isAdminRoute && <Header />}
        <div className="relative pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/SelectOffer" element={<SelectOffer />} />
            <Route path="/AddressContact" element={<AddressContact />} />
            <Route path="/ContactDetails" element={<ContactDetails />} />
            <Route path="/AttendatDetails" element={<AttendantDetails />} />
            <Route path="/CustomDatePicker" element={<CustomDatePicker />} />
            <Route path="/nursingservices" element={<NursingServices />} />
            <Route
              path="/BookingConfirmation"
              element={<BookingConfirmation />}
            />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/AdminDash" element={<AdminDash />} />
            <Route path="/Attendant" element={<Attendant />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Time" element={<Time />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/BookingHistory" element={<BookingHistory />} />
            <Route path="/UpcomingBooking" element={<UpcomingBooking />} />
            <Route path="/BookingDetails" element={<BookingDetails />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/PaymentModal" element={<PaymentModal />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/waiting" element={<Waiting />} />
            <Route path="/assigned-attendant" element={<AssignedAttendant />} />
          </Routes>
        </div>
      </BookingProvider>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
