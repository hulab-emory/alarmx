import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.main.user);
  return !user ? <Navigate to="/signin" replace /> : children;
};

export default ProtectedRoute;
