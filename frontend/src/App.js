import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/AttendantComponent/Dashboard';
import BookingConfirmation from './components/services/BookingConfirmation';
import ContactDetails from './components/services/ContactDetails';
import CustomDatePicker from './components/services/CustomDatePicker';
import NursingServices from './components/services/NursingServices';
import Admin from './pages/Admin';
import Attendant from "./pages/Attendant";
import Home from './pages/Home';
import Services from "./pages/Services";
import Time from './pages/Time';
import SelectOffer from './components/services/SelectOffer';
import AddressContact from './components/services/AddressContact';
import { BookingProvider } from "./components/services/BookingContext";
import AdminDash from './components/AdminComponent/AdminDash';

function App() {
  return (
    <Router>
      <div className="App">
        <BookingProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/SelectOffer" element={<SelectOffer />} />
            <Route path="/AddressContact" element={<AddressContact />} />
            <Route path="/ContactDetails" element={<ContactDetails />} />
            <Route path="/CustomDatePicker" element={<CustomDatePicker />} />
            <Route path="/nursingservices" element={<NursingServices />}></Route>
            <Route path="/BookingConfirmation" element={<BookingConfirmation />}></Route>
            <Route path="/Admin" element={<Admin />}></Route>
            <Route path="/AdminDash" element={<AdminDash />}></Route>
            <Route path="/Attendant" element={<Attendant />}></Route>
            <Route path='/Dashboard' element={<Dashboard />}></Route>
            <Route path='/Time' element={<Time />}></Route>
          </Routes>
        </BookingProvider>
      </div >
    </Router >
  );
}

export default App;
