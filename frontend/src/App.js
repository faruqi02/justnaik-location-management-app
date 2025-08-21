import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Map from "./pages/MapPage";
import Upload from "./pages/Upload";
import Layout from "./components/Layout";
import { useSelector } from "react-redux";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

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
  return (
    <Router>
      <Routes>
        {/* Public routes (no Layout) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Private routes (with Layout) */}
        <Route
          path="/map"
          element={
            <PrivateRoute>
              <Layout>
                <Map />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Layout>
                <Upload />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
