import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminDash from './components/AdminComponent/AdminDash';
import Dashboard from './components/AttendantComponent/Dashboard';
import Header from './components/Header';
import BookingDetails from './components/Profile/BookingDetails';
import BookingHistory from './components/Profile/BookingHistory';
import UpcomingBooking from './components/Profile/UpcomingBooking';
import UserProfile from './components/Profile/UserProfile';
import AddressContact from './components/services/AddressContact';
import BookingConfirmation from './components/services/BookingConfirmation';
import { BookingProvider } from "./components/services/BookingContext";
import ContactDetails from './components/services/ContactDetails';
import CustomDatePicker from './components/services/CustomDatePicker';
import NursingServices from './components/services/NursingServices';
import SelectOffer from './components/services/SelectOffer';
import AttendantDetails from './components/AttendantDetails';
import PaymentModal from './components/PaymentModal';
import Admin from './pages/Admin';
import Attendant from "./pages/Attendant";
import Home from './pages/Home';
import Profile from './pages/Profile';
import Services from "./pages/Services";
import Time from './pages/Time';

function App() {
  return (
    <Router>
      <div className="App">
        <BookingProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/SelectOffer" element={<SelectOffer />} />
            <Route path="/AddressContact" element={<AddressContact />} />
            <Route path="/ContactDetails" element={<ContactDetails />} />
            <Route path="/AttendatDetails" element={<AttendantDetails />} />
            <Route path="/CustomDatePicker" element={<CustomDatePicker />} />
            <Route path="/nursingservices" element={<NursingServices />}></Route>
            <Route path="/BookingConfirmation" element={<BookingConfirmation />}></Route>
            <Route path="/Admin" element={<Admin />}></Route>
            <Route path="/AdminDash" element={<AdminDash />}></Route>
            <Route path="/Attendant" element={<Attendant />}></Route>
            <Route path='/Dashboard' element={<Dashboard />}></Route>
            <Route path='/Time' element={<Time />}></Route>
            <Route path='/Profile' element={<Profile />}></Route>
            <Route path='/BookingHistory' element={<BookingHistory />}></Route>
            <Route path='/UpcomingBooking' element={<UpcomingBooking />}></Route>
            <Route path='/BookingDetails' element={<BookingDetails />}></Route>
            <Route path='/UserProfile' element={<UserProfile />}></Route>
            <Route path='/PaymentModal' element={<PaymentModal />}></Route>


          </Routes>
        </BookingProvider>
      </div >
    </Router >
  );
}

export default App;
