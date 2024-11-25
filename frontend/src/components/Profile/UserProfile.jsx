import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../BackButton";
import {
  FaCamera,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
} from "react-icons/fa";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobileNumber: "",
    address: "",
    city: "",
    state: "",
    profilePicture: "https://via.placeholder.com/150",
    dob: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/customer/profile",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setProfile(response.data.customer);
        setOriginalProfile(response.data.customer);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/api/customer/profile",
        profile,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setProfile(response.data.customer);
        setOriginalProfile(response.data.customer);
        setIsEditing(false);
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-purple-800">
                User Profile
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your personal information
              </p>
            </div>
            <BackButton />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Profile Picture Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
                />
                {isEditing && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-all"
                  >
                    <FaCamera className="text-lg" />
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="relative">
                  <FaUser className="absolute top-3 left-4 text-purple-500" />
                  <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={profile.firstname || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg outline-none ${
                      isEditing
                        ? "bg-white border border-purple-200 focus:border-purple-400"
                        : "bg-gray-50"
                    }`}
                  />
                </div>

                <div className="relative">
                  <FaUser className="absolute top-3 left-4 text-purple-500" />
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={profile.lastname || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg outline-none ${
                      isEditing
                        ? "bg-white border border-purple-200 focus:border-purple-400"
                        : "bg-gray-50"
                    }`}
                  />
                </div>

                <div className="relative">
                  <FaEnvelope className="absolute top-3 left-4 text-purple-500" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={profile.email || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg outline-none ${
                      isEditing
                        ? "bg-white border border-purple-200 focus:border-purple-400"
                        : "bg-gray-50"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <FaPhone className="absolute top-3 left-4 text-purple-500" />
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    value={profile.mobileNumber || ""}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-lg outline-none bg-gray-50"
                  />
                </div>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute top-3 left-4 text-purple-500" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={profile.address || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg outline-none ${
                      isEditing
                        ? "bg-white border border-purple-200 focus:border-purple-400"
                        : "bg-gray-50"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <FaCity className="absolute top-3 left-4 text-purple-500" />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={profile.city || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 rounded-lg outline-none ${
                        isEditing
                          ? "bg-white border border-purple-200 focus:border-purple-400"
                          : "bg-gray-50"
                      }`}
                    />
                  </div>

                  <div className="relative">
                    <FaGlobe className="absolute top-3 left-4 text-purple-500" />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={profile.state || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 rounded-lg outline-none ${
                        isEditing
                          ? "bg-white border border-purple-200 focus:border-purple-400"
                          : "bg-gray-50"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
