import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../utils/axios";

// register user
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // making registeration request to backend
      const response = await axiosClient.post("/user/signup", userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Check if it's Google authentication
      const endpoint = credentials.isGoogleAuth ? "/user/google-auth" : "/user/login";
      
      // making login request to backend
      const response = await axiosClient.post(endpoint, credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// authenticate user
export const authenticateUser = createAsyncThunk(
  "auth/ckeck",
  async (_, { rejectWithValue }) => {
    try {
      // making authentication request to backend
      const response = await axiosClient.get("/user/check-auth");
      // console.log(response);
      return response.data.user;
    } catch (error) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// logout user
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // making logout request to backend
      await axiosClient.post("/user/logout");
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// authSlice
const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    user: null,
    loading: true,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    updateUserProfile: (state, action) => {
      const { username, fullName } = action.payload;
      state.user.username = username;
      state.user.fullName = fullName;
    },
    updateUserProfileImage: (state, action) => {
      const { profileImageUrl } = action.payload;
      state.user.profileImageUrl = profileImageUrl;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.user = null;
      })

      // login user cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.user = null;
      })

      // authenticate user cases
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.user = null;
      })

      // logout user cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { updateUserProfile, updateUserProfileImage } = authSlice.actions;
export default authSlice.reducer;
