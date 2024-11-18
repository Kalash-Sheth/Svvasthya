import React, { useState, useEffect } from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log("Fetching customers..."); // Debug log
        const response = await axios.get(
          "http://localhost:5000/api/admin/customers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response:", response.data); // Debug log
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(err.response?.data?.message || "Failed to fetch customers");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (customers.length === 0)
    return <div className="text-center py-4">No customers found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Customers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div key={customer._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {customer.firstname} {customer.lastname}
                </h3>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-2">
                  Customer
                </span>
                <span className="text-sm text-gray-600">
                  Rating: {customer.rating || "N/A"}⭐
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Mobile:</span>{" "}
                {customer.mobileNumber || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">DOB:</span>{" "}
                {customer.dob
                  ? new Date(customer.dob).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Joined:</span>{" "}
                {customer.created_at
                  ? new Date(customer.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Total Appointments:</span>{" "}
                {customer.appointments?.length || 0}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">Address Details:</p>
              <p>{customer.address || "N/A"}</p>
              <p>{customer.city || "N/A"}</p>
              <p>{customer.state || "N/A"}</p>
            </div>

            {customer.CurrentLocation && (
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-semibold mb-1">Current Location:</p>
                <p>
                  Lat: {customer.CurrentLocation.latitude}, Long:{" "}
                  {customer.CurrentLocation.longitude}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers; 