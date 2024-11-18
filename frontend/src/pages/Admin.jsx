import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/AdminComponent/Login";

function Admin() {
    const navigate = useNavigate();
    const adminToken = localStorage.getItem("adminToken");

    useEffect(() => {
        if (adminToken) {
            navigate("/admin/dashboard");
        }
    }, [adminToken, navigate]);

    return <Login />;
}

export default Admin;
