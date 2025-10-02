import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: null,
  reducers: {
    addConnections: (state, action) => action.payload,
    removeConnections: () => null,
    clearConnections: () => null,
  },
});

export const { addConnections, removeConnections, clearConnections } =
  connectionSlice.actions;
export default connectionSlice.reducer;
