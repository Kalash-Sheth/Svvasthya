import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate unique IDs
import { useBookingContext } from "./BookingContext";

function AddressContact() {
  const [showContactDetails, setShowContactDetails] = useState(false);
  const { setBookingData } = useBookingContext();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressForm, setAddressForm] = useState({
    flatNumber: "",
    landmark: "",
    name: "",
  });
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [addressAdded, setAddressAdded] = useState(false);
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch autocomplete suggestions
  const fetchAutocompleteSuggestions = async (input) => {
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete`,
        {
          params: {
            input: input,
            api_key: process.env.REACT_APP_OLA_API_KEY, // Use the API key from the environment variable
          },
          headers: {
            "X-Request-Id": uuidv4(), // Generate a unique request ID
          },
        }
      );
      const predictions = response.data.predictions || [];

      // Extract relevant address data
      const suggestions = predictions.map((prediction) => ({
        mainText: prediction.structured_formatting.main_text,
        secondaryText: prediction.structured_formatting.secondary_text,
        fullAddress: `${prediction.structured_formatting.main_text}, ${prediction.structured_formatting.secondary_text}`,
      }));

      setAutocompleteResults(suggestions); // Store the suggestions in state
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  };

  // Handle input change for address search
  const handleAddressSearchChange = (e) => {
    const value = e.target.value;
    if (value) {
      fetchAutocompleteSuggestions(value);
    } else {
      setAutocompleteResults([]);
    }
  };

  // Handle address selection from autocomplete
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setAutocompleteResults([]);
    fetchGeocode(address);
  };

  // Get current location
  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
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
          const address = response.data.results[0]?.formatted_address; // Get formatted address
          if (address) {
            setSelectedAddress(address);
          }
        } catch (error) {
          console.error("Error fetching current location:", error);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Fetch geocode for the selected address
  const fetchGeocode = async (address) => {
    try {
      const response = await axios.get(
        "https://api.olamaps.io/places/v1/geocode",
        {
          params: {
            address: address,
            language: "hi",
            api_key: process.env.REACT_APP_OLA_API_KEY,
          },
          headers: {
            "X-Request-Id": uuidv4(),
          },
        }
      );

      const location = response.data.geocodingResults[0].geometry.location;
      if (location) {
        setLatitude(location.lat);
        setLongitude(location.lng);
      }
      console.log(location.lat, location.lng);
    } catch (error) {
      console.error("Error fetching geocode:", error);
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.flatNumber || !addressForm.landmark || !addressForm.name) {
      alert("Please fill out all fields.");
      return;
    }

    const formattedAddress = {
      fullAddress: selectedAddress,
      houseNumber: addressForm.flatNumber,
      landmark: addressForm.landmark,
      name: addressForm.name,
    };

    // setSelectedAddress(selectedAddress);
    setShowAddressModal(false);
    setAddressAdded(true);

    // Update booking data in context
    setBookingData((prev) => ({
      ...prev,
      address: formattedAddress, // Set the address in context
      location: {
        latitude: latitude, // Save latitude
        longitude: longitude, // Save longitude
      },
    }));

    setAddressForm({ flatNumber: "", landmark: "", name: "" });
    navigate("/BookingConfirmation"); // Navigate to BookingConfirmation page
  };

  return (
    <>
      {/* <Header /> */}
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl flex justify-center font-bold text-[#282261] mt-8 mb-4">
          Enter Contact Details
        </h2>
      </div>
      <div className="container mx-auto flex justify-center h-full px-4">
        <div
          className="bg-[#F7F7FB] border-dashed border-2 border-[#2F2156] rounded-lg p-6 cursor-pointer mb-4"
          onClick={() => setShowAddressModal(true)}
        >
          <p className="text-[#2F2156] text-center font-semibold">
            Tap to Select an Address
          </p>
        </div>

        {showAddressModal && (
          <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gray-100 bg-opacity-50">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-6xl mx-4">
              {/* Left side: Address Search */}
              <div className="w-full md:w-2/3 p-4">
                <input
                  type="text"
                  placeholder="Search Address"
                  onChange={handleAddressSearchChange}
                  className="w-full bg-gray-100 p-2 md:p-3 rounded-3xl mb-4"
                />
                {/* Display autocomplete suggestions */}
                <ul className="bg-white shadow-lg rounded-lg max-h-60 overflow-auto">
                  {autocompleteResults.map((result) => (
                    <li
                      key={result.reference}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleAddressSelect(result.fullAddress)}
                    >
                      {result.fullAddress}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={getCurrentLocation}
                  className="mt-4 bg-blue-500 text-white py-2 rounded-3xl"
                >
                  Or Get Current Location
                </button>
              </div>

              {/* Right side: Form */}
              <div className="w-full md:w-1/3 p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">
                  {selectedAddress || "Selected Address"}
                </h2>
                <hr className="mb-4" />
                <form onSubmit={handleSaveAddress}>
                  <input
                    type="text"
                    name="flatNumber"
                    placeholder="House/Flat Number"
                    value={addressForm.flatNumber}
                    onChange={handleAddressFormChange}
                    className="w-full bg-gray-100 p-2 md:p-3 rounded-3xl mb-4"
                  />
                  <input
                    type="text"
                    placeholder="Landmark"
                    name="landmark"
                    value={addressForm.landmark}
                    onChange={handleAddressFormChange}
                    className="w-full bg-gray-100 p-2 md:p-3 rounded-3xl mb-4"
                  />
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressFormChange}
                    className="w-full bg-gray-100 p-2 md:p-3 rounded-3xl mb-4"
                  />
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 md:py-3 rounded-3xl mt-4"
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AddressContact;
