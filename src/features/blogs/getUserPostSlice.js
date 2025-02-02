import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BaseURL = import.meta.env.VITE_BASE_URL;

// Define the async thunk for fetching user posts
export const userPostAPI = createAsyncThunk(
  "user/getPost", // Unique action type string
  async ({ id, isUser }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from localStorage

    // console.log("id", id, "isUser", isUser);

    try {
      let response;
      if (isUser) {
        if (!accessToken) {
          throw new Error("Access token is missing");
        }

        response = await axios.get(`${BaseURL}/api/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Ensure token is properly formatted
          },
        });
      } else {
        response = await axios.get(`${BaseURL}/api/all-blog/${id}`);
      }

      // console.log('Get user single post response:', response.data);
      return { data: response.data, isUser }; // Return both data and `isUser` state
    } catch (error) {
      // console.log('Get user single post error:', error);

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
const userPostAPISlice = createSlice({
  name: "blog",
  initialState: {
    blog: [],
    loading: false,
    error: null,
    isUser: false, // Initialize `isUser` in the state
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userPostAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userPostAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload.data; // Update the blog data
        state.isUser = action.payload.isUser; // Update `isUser` state
      })
      .addCase(userPostAPI.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload.message || JSON.stringify("Something went wrong"); // Update error message
      });
  },
});

export const { clearError } = userPostAPISlice.actions; // Export the clearError action
export default userPostAPISlice.reducer;
