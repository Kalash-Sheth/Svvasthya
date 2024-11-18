import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminDash from '../components/AdminComponent/AdminDash';

function AdminDashboard() {
    const adminToken = localStorage.getItem('adminToken');

    // Redirect to login if no token
    if (!adminToken) {
        return <Navigate to="/admin" replace />;
    }

    return <AdminDash />;
}

export default AdminDashboard; 