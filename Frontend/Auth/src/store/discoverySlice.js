import { createSlice } from "@reduxjs/toolkit";

const discoverySlice = createSlice({
  name: "discovery",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action) => {
      const newFeed = state.filter((user) => user._id !== action.payload);
      return newFeed;
    },
    clearFeed: () => null,
  },
});

export const { addFeed, removeUserFromFeed, clearFeed } =
  discoverySlice.actions;
export default discoverySlice.reducer;
