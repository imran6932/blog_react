import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;

// Define the async thunk for login
export const loginAPI = createAsyncThunk(
  "api/login", // Unique action type string
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BaseURL}/api/login`, data);
      // console.log('login response', response.data);

      return response.data; // This is the payload for the `fulfilled` action
    } catch (error) {
      if (error.response) {
        // console.log('login error', error.response.data);

        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);

// Define the async thunk for OTP generation
export const generateOTPAPI = createAsyncThunk(
  "api/generate-otp", // Unique action type string
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BaseURL}/api/generate-otp?email=${data.email}`
      );
      // console.log('generate otp response', response.data);

      return response.data; // This is the payload for the `fulfilled` action
    } catch (error) {
      if (error.response) {
        // console.log('generate otp error', error.response.data);

        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Network error");
    }
  }
);

// Create the slice
const loginSlice = createSlice({
  name: "login",
  initialState: {
    data: [],
    loginUserEmail: null,
    loading: false,
    error: null,
    isVerifyError: false,
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false, // Parse localStorage as boolean
    accessToken: localStorage.getItem("accessToken") || null, // Store accessToken if available
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.data = [];
      localStorage.removeItem("accessToken");
      localStorage.setItem("isLoggedIn", false);
    },
    getToken: (state) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        state.accessToken = token;
        state.isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
      }
    },
    isLoggedIn: (state) => {
      const isLoggedIn_ = localStorage.getItem("isLoggedIn");
      if (isLoggedIn_) {
        state.isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.isLoggedIn = true;
        state.accessToken = action.payload.data.access_token;
        localStorage.setItem("accessToken", action.payload.data.access_token); // Save token to localStorage
        localStorage.setItem("isLoggedIn", true); // Save login state
      })
      .addCase(loginAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.loginUserEmail = action.payload.email;
        state.isLoggedIn = false;

        if (action.payload.message === "user is not verified") {
          state.isVerifyError = true;
        } else {
          state.isVerifyError = false;
        }
      });
  },
});

export const { clearError, logOut, isLoggedIn, getToken } = loginSlice.actions; // Export the clearError and logout actions
export default loginSlice.reducer;
