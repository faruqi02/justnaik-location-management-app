import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Map from "./pages/MapPage";
import Upload from "./pages/Upload";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// PrivateRoute wrapper
function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" />;
}

// PublicRoute wrapper
function PublicRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  return token ? <Navigate to="/map" /> : children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main content */}
        <div className="flex-grow-1">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="p-4">
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/map" element={<PrivateRoute><Map /></PrivateRoute>} />
              <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
