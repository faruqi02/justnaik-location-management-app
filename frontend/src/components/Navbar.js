import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSessionExpired } from "../store/authSlice";

function Navbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const { user, token, sessionExpired } = useSelector((state) => state.auth);


  // ✅ Auto-hide session expired alert after 5s
  useEffect(() => {
    if (sessionExpired) {
      const timer = setTimeout(() => {
        dispatch(clearSessionExpired());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sessionExpired, dispatch]);

  return (
    <>
      {sessionExpired && (
        <div
          className="alert alert-danger text-center mb-0 d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>⚠️ Session expired. Please log in again.</span>
          <button
            type="button"
            className="btn-close ms-2"
            onClick={() => dispatch(clearSessionExpired())}
            aria-label="Close"
          ></button>
        </div>
      )}

      <nav className="navbar navbar-light bg-white border-bottom px-4">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Hamburger button */}
          <button
            className="btn btn-light"
            onClick={toggleSidebar}
            style={{ fontSize: "1.5rem" }}
          >
            ☰
          </button>

          {/* Always centered */}
          <span className="navbar-brand mx-auto">Location Management System</span>

          {token && (
            <div>
              <span className="me-3">Welcome, {user?.fullName || "User"}</span>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
