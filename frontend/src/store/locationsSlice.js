import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/locations";

// ✅ Fetch user locations
export const fetchLocations = createAsyncThunk(
    "locations/fetchLocations",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue("Failed to load locations");
        }
    }
);

// ✅ Add new location
export const addLocation = createAsyncThunk(
    "locations/addLocation",
    async ({ name, lat, lng }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                API_URL,
                { name, lat, lng },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (err) {
            return rejectWithValue("Failed to add location");
        }
    }
);

// ✅ Update location
export const updateLocation = createAsyncThunk(
    "locations/updateLocation",
    async ({ id, name, lat, lng }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                `${API_URL}/${id}`,
                { name, lat, lng },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (err) {
            return rejectWithValue("Failed to update location");
        }
    }
);

// ✅ Delete location
export const deleteLocation = createAsyncThunk(
    "locations/deleteLocation",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id; // return id so reducer can filter it out
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
            // Fetch
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
            // Add
            .addCase(addLocation.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            //updatelocation
            .addCase(updateLocation.fulfilled, (state, action) => {
                const idx = state.items.findIndex((loc) => loc.id === action.payload.id);
                if (idx !== -1) {
                    state.items[idx] = action.payload;
                }
            })

            // Delete
            .addCase(deleteLocation.fulfilled, (state, action) => {
                state.items = state.items.filter((loc) => loc.id !== action.payload);
            });
    },
});

export default locationsSlice.reducer;
