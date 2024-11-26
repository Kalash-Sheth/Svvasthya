import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../BackButton";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaBirthdayCake, FaCamera } from "react-icons/fa";

const InputField = ({ icon: Icon, label, error, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <input
        {...props}
        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all`}
      />
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/customer/profile",
        { withCredentials: true }
      );

      if (response.data.success) {
        setProfile(response.data.customer);
        setOriginalProfile(response.data.customer);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profile.firstname) newErrors.firstname = "First name is required";
    if (!profile.lastname) newErrors.lastname = "Last name is required";
    if (!profile.email) newErrors.email = "Email is required";
    if (!profile.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing || !validateForm()) return;

    try {
      setIsLoading(true);
      const response = await axios.put(
        "http://localhost:5000/api/customer/profile",
        profile,
        { withCredentials: true }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#282261]">
                User Profile
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your personal information
              </p>
            </div>
            <BackButton />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-purple-100"
                />
                {isEditing && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-all"
                  >
                    <FaCamera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                icon={FaUser}
                label="First Name"
                name="firstname"
                placeholder="First Name"
                value={profile.firstname || ""}
                onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
                disabled={!isEditing}
                error={errors.firstname}
              />

              <InputField
                icon={FaUser}
                label="Last Name"
                name="lastname"
                placeholder="Last Name"
                value={profile.lastname || ""}
                onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
                disabled={!isEditing}
                error={errors.lastname}
              />

              <InputField
                icon={FaEnvelope}
                label="Email"
                name="email"
                type="email"
                placeholder="Email"
                value={profile.email || ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
                error={errors.email}
              />

              <InputField
                icon={FaPhone}
                label="Mobile Number"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={profile.mobileNumber || ""}
                onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                disabled={!isEditing}
                error={errors.mobileNumber}
              />

              <InputField
                icon={FaMapMarkerAlt}
                label="Address"
                name="address"
                placeholder="Address"
                value={profile.address || ""}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                disabled={!isEditing}
              />

              <InputField
                icon={FaCity}
                label="City"
                name="city"
                placeholder="City"
                value={profile.city || ""}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                disabled={!isEditing}
              />

              <InputField
                icon={FaGlobe}
                label="State"
                name="state"
                placeholder="State"
                value={profile.state || ""}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                disabled={!isEditing}
              />

              <InputField
                icon={FaBirthdayCake}
                label="Date of Birth"
                name="dob"
                type="date"
                value={profile.dob || ""}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setProfile(originalProfile);
                      setIsEditing(false);
                      setErrors({});
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#282261] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-[#282261] text-white rounded-lg hover:bg-opacity-90 transition-colors"
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
