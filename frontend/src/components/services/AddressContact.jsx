import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useBookingContext } from "./BookingContext";
import { FaMapMarkerAlt, FaHome, FaMapPin, FaUser } from "react-icons/fa";

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
      <Icon className="w-5 h-5" />
    </div>
    <input
      {...props}
      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#282261] focus:outline-none focus:ring-2 focus:ring-[#282261]/20 transition-all"
    />
  </div>
);

function AddressContact() {
  const navigate = useNavigate();
  const { setBookingData } = useBookingContext();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressForm, setAddressForm] = useState({
    flatNumber: "",
    landmark: "",
    name: "",
  });
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const fetchAutocompleteSuggestions = async (input) => {
    if (!input) return;
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete`,
        {
          params: {
            input,
            api_key: process.env.REACT_APP_OLA_API_KEY,
          },
          headers: {
            "X-Request-Id": uuidv4(),
          },
        }
      );

      const suggestions = response.data.predictions?.map(prediction => ({
        mainText: prediction.structured_formatting.main_text,
        secondaryText: prediction.structured_formatting.secondary_text,
        fullAddress: `${prediction.structured_formatting.main_text}, ${prediction.structured_formatting.secondary_text}`,
      })) || [];

      setAutocompleteResults(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleAddressSearchChange = (e) => {
    const value = e.target.value;
    if (value) {
      fetchAutocompleteSuggestions(value);
    } else {
      setAutocompleteResults([]);
    }
  };

  const handleAddressSelect = async (address) => {
    setSelectedAddress(address);
    setAutocompleteResults([]);
    await fetchGeocode(address);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        
        try {
          const response = await axios.get(
            `https://api.olamaps.io/places/v1/reverse-geocode`,
            {
              params: {
                latlng: `${latitude},${longitude}`,
                api_key: process.env.REACT_APP_OLA_API_KEY,
              },
              headers: {
                "X-Request-Id": uuidv4(),
              },
            }
          );
          
          const address = response.data.results[0]?.formatted_address;
          if (address) setSelectedAddress(address);
        } catch (error) {
          console.error("Error fetching address:", error);
          alert("Failed to get address from location");
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to get your location");
      }
    );
  };

  const fetchGeocode = async (address) => {
    try {
      const response = await axios.get(
        "https://api.olamaps.io/places/v1/geocode",
        {
          params: {
            address,
            api_key: process.env.REACT_APP_OLA_API_KEY,
          },
          headers: {
            "X-Request-Id": uuidv4(),
          },
        }
      );

      const location = response.data.geocodingResults[0]?.geometry.location;
      if (location) {
        setLatitude(location.lat);
        setLongitude(location.lng);
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    
    if (!addressForm.flatNumber || !addressForm.landmark || !addressForm.name) {
      alert("Please fill in all fields");
      return;
    }

    if (!selectedAddress) {
      alert("Please select an address");
      return;
    }

    setBookingData(prev => ({
      ...prev,
      address: {
        fullAddress: selectedAddress,
        houseNumber: addressForm.flatNumber,
        landmark: addressForm.landmark,
        name: addressForm.name,
      },
      location: { latitude, longitude },
    }));

    navigate("/BookingConfirmation");
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#282261] text-center mb-8">
            Add Delivery Address
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Panel - Address Search */}
            <div className="w-full md:w-3/5">
              <div className="mb-6">
                <InputField
                  icon={FaMapMarkerAlt}
                  type="text"
                  placeholder="Search for address..."
                  onChange={handleAddressSearchChange}
                />
              </div>

              {/* Autocomplete Results */}
              {autocompleteResults.length > 0 && (
                <div className="max-h-[400px] overflow-y-auto rounded-lg border">
                  {autocompleteResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleAddressSelect(result.fullAddress)}
                      className="p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors"
                    >
                      <p className="font-medium">{result.mainText}</p>
                      <p className="text-sm text-gray-600">{result.secondaryText}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Current Location Button */}
              <button
                onClick={getCurrentLocation}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-[#282261] text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <FaMapPin />
                Use Current Location
              </button>
            </div>

            {/* Right Panel - Address Form */}
            <div className="w-full md:w-2/5">
              <form onSubmit={handleSaveAddress} className="space-y-4">
                {selectedAddress && (
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <p className="font-medium text-gray-700">{selectedAddress}</p>
                  </div>
                )}

                <InputField
                  icon={FaHome}
                  type="text"
                  name="flatNumber"
                  placeholder="House/Flat Number"
                  value={addressForm.flatNumber}
                  onChange={handleAddressFormChange}
                />

                <InputField
                  icon={FaMapMarkerAlt}
                  type="text"
                  name="landmark"
                  placeholder="Landmark"
                  value={addressForm.landmark}
                  onChange={handleAddressFormChange}
                />

                <InputField
                  icon={FaUser}
                  type="text"
                  name="name"
                  placeholder="Save Address As (e.g., Home, Office)"
                  value={addressForm.name}
                  onChange={handleAddressFormChange}
                />

                <button
                  type="submit"
                  className="w-full py-3 bg-[#282261] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Continue to Confirmation
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressContact;
