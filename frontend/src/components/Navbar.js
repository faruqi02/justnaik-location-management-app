import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Navbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  //if (!token) return null;

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Unicode Hamburger ☰ */}
        <button
          className="btn btn-light"
          onClick={toggleSidebar}
          style={{ fontSize: "1.5rem" }}
        >
          ☰
        </button>

        {/* Center: Brand (always centered) */}
        <div className="flex-grow-1 d-flex justify-content-center">
          <span className="navbar-brand mb-0 h1">
            Location Management System
          </span>
        </div>

        {token && (
          <div>
            <span className="me-3">Welcome, {user?.fullName || "User"}</span>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
