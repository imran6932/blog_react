import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;

// Define the async thunk for fetching user profile
export const userProfileAPI = createAsyncThunk(
  "user/getProfile", // Unique action type string
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from localStorage

    try {
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await axios.get(`${BaseURL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Ensure token is properly formatted
        },
      });
      // console.log('Get user profile response:', response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      // console.log('Get user profile error:', error);

      if (error.response) {
        // Handle server-side errors
        return rejectWithValue({
          data: error.response.data,
          status: error.response.status,
        });
      }

      // Handle network errors
      return rejectWithValue("Network error");
    }
  }
);

// Create the slice
const userProfileAPISlice = createSlice({
  name: "getProfile",
  initialState: {
    user: [],
    loading: false,
    error: null,
    status: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userProfileAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userProfileAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data; // Update the blog data
        state.status = action.payload.status;
      })
      .addCase(userProfileAPI.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload.message || JSON.stringify("Something went wrong"); // Update error message
        state.status = action.payload.status;
      });
  },
});

export const { clearError } = userProfileAPISlice.actions; // Export the clearError action
export default userProfileAPISlice.reducer;
