import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;

// Define the async thunk for fetching user posts
export const userAllPostsAPI = createAsyncThunk(
  "user/getUserAllPosts", // Unique action type string
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from localStorage
    try {
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await axios.get(`${BaseURL}/api/blog`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Ensure token is properly formatted
        },
      });

      // console.log('Get user all posts response:', response.data);
      return response.data; // This is the payload for the `fulfilled` action
    } catch (error) {
      // console.log('Get user all posts error:', error);

      if (error.response) {
        // Handle server-side errors
        return rejectWithValue(error.response.data);
      }

      // Handle network errors
      return rejectWithValue("Network error");
    }
  }
);

// Create the slice
const userAllPostsSlice = createSlice({
  name: "userPosts",
  initialState: {
    postsData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userAllPostsAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userAllPostsAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.postsData = action.payload;
      })
      .addCase(userAllPostsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload.message || JSON.stringify("Something went wrong");
      });
  },
});

export const { clearError } = userAllPostsSlice.actions; // Export the clearError action
export default userAllPostsSlice.reducer;
