// src/context/AdminAuthContext.jsx
import React, { createContext, useContext,  useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    localStorage.getItem("admin_authed") === "true"
  );

  const login = () => {
    localStorage.setItem("admin_authed", "true");
    setIsAdminAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("adminSession");
    navigate("/admin");
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
