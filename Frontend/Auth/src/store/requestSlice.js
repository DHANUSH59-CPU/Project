import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequest: (state, action) => {
      const newArray = state.filter((r) => r._id !== action.payload);
      return newArray;
    },
    clearRequests: () => null,
  },
});

export const { addRequests, removeRequest, clearRequests } =
  requestSlice.actions;
export default requestSlice.reducer;
