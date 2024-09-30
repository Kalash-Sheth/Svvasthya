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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/ContactDetails" element={<ContactDetails />} />
          <Route path="/CustomDatePicker" element={<CustomDatePicker />} />
          <Route path="/nursingservices" element={<NursingServices />}></Route>
          <Route path="/BookingConfirmation" element={<BookingConfirmation />}></Route>
          <Route path="/Admin" element={<Admin />}></Route>
          <Route path="/Attendant" element={<Attendant />}></Route>
          <Route path='/Dashboard' element={<Dashboard />}></Route>
          <Route path='/Time' element={<Time />}></Route>





          {/* <Route path="/services" element={<ServiceDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otpverification" element={<OtpVerification />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
