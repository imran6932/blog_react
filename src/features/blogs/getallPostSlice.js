import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;

// Define the async thunk for fetching user posts
export const getAllPostsAPI = createAsyncThunk(
  "getAllPosts", // Unique action type string
  async (_, { rejectWithValue }) => {
    // const accessToken = localStorage.getItem("accessToken") // Retrieve access token from localStorage
    try {
      const response = await axios.get(`${BaseURL}/api/all-blog`);

      // console.log('Get all posts response:', response.data);
      return response.data; // This is the payload for the `fulfilled` action
    } catch (error) {
      // console.log('Get all posts error:', error);

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
const AllPostsSlice = createSlice({
  name: "allPosts",
  initialState: {
    postsData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPostsAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPostsAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.postsData = action.payload;
      })
      .addCase(getAllPostsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload.message || JSON.stringify("Something went wrong");
      });
  },
});

export const { clearError } = AllPostsSlice.actions; // Export the clearError action
export default AllPostsSlice.reducer;
