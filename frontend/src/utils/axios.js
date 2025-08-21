import axios from "axios";
//import { logoutUser, setSessionExpired } from "../store/authSlice";

const API = axios.create({
  baseURL: "http://localhost:4000",
});

// ✅ Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // <-- use localStorage instead of store
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Response interceptor
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect
    }
    return Promise.reject(err);
  }
);

export default API;
