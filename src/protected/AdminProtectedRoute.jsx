import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import React from "react";
export default function AdminProtectedRoute({ children }) {
  const session = Cookies.get("adminSession");

  // If no session cookie → redirect to login
  if (!session) {
    return <Navigate to="/admin/home-page" />;
  }

  return children;
}
