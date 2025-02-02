import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;

// Define the async thunk for signup
export const changePasswordAPI = createAsyncThunk(
  "api/change-password", // Unique action type string
  async (data, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.login.accessToken || state.verifyotp.accessToken;

      const response = await axios.post(
        `${BaseURL}/api/change-password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("change-password response", response.data)

      return response.data; // This is the payload for the `fulfilled` action
    } catch (error) {
      if (error.response) {
        // Check for specific status codes and handle accordingly
        // const status = error.response.status;
        // console.log('change-password error', error.response.data)

        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);

// Create the slice
const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState: {
    data: [],
    loading: false,
    error: null,
    isSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.isSuccess= false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePasswordAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isSuccess = true;
      })
      .addCase(changePasswordAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError } = changePasswordSlice.actions; // Export the clearError action
export default changePasswordSlice.reducer;
