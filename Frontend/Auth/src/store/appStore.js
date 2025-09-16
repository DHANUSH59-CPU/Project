import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./authSlice";

const appStore = configureStore({
  reducer: { authSlice: authSliceReducer },
});

export default appStore;
