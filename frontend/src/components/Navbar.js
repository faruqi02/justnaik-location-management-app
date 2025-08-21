import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  if (!token) return null; // Hide navbar if not logged in

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4">
      <div className="container-fluid d-flex justify-content-between">
        {/* Burger button triggers offcanvas */}
        <button
          className="btn d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        <span className="navbar-brand">Location Management System</span>

        <div>
          <span className="me-3">Welcome, {user?.fullName || "User"}</span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
