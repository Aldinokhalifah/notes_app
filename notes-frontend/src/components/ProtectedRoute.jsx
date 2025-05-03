import React from "react";
import { Navigate } from "react-router-dom";
import { checkInactivity } from "../utils/checkInactivity";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token || checkInactivity()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
