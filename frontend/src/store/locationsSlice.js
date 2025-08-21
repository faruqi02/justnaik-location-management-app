import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/axios";

const API_URL = "/locations";

// Fetch user locations
export const fetchLocations = createAsyncThunk(
  "locations/fetchLocations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get(API_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to load locations");
    }
  }
);

// Add location
export const addLocation = createAsyncThunk(
  "locations/addLocation",
  async ({ name, lat, lng }, { rejectWithValue }) => {
    try {
      const res = await API.post(API_URL, { name, lat, lng });
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to add location");
    }
  }
);

// Update location
export const updateLocation = createAsyncThunk(
  "locations/updateLocation",
  async ({ id, name, lat, lng }, { rejectWithValue }) => {
    try {
      const res = await API.put(`${API_URL}/${id}`, { name, lat, lng });
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to update location");
    }
  }
);

// Delete location
export const deleteLocation = createAsyncThunk(
  "locations/deleteLocation",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue("Failed to delete location");
    }
  }
);

const locationsSlice = createSlice({
  name: "locations",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addLocation.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        const idx = state.items.findIndex((loc) => loc.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.items = state.items.filter((loc) => loc.id !== action.payload);
      });
  },
});

export default locationsSlice.reducer;
