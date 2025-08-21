import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/axios"; // use centralized axios

const API_URL = "/auth"; // baseURL already in axios.js

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ fullName, email, password }, { rejectWithValue }) => {
    try {
      const res = await API.post(`${API_URL}/register`, { fullName, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await API.post(`${API_URL}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await API.post("/auth/logout");  // ✅ call backend
  } catch (err) {
    console.error("Logout API failed", err);
    // we still want to clear local data even if API fails
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    sessionExpired: false, // ✅ add
  },
  reducers: {
    setSessionExpired: (state) => {
      state.sessionExpired = true;
    },
    clearSessionExpired: (state) => {
      state.sessionExpired = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { setSessionExpired, clearSessionExpired } = authSlice.actions;
export default authSlice.reducer;
