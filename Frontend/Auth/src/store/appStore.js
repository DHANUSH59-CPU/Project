import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./authSlice";
import discoverySliceReducer from "./discoverySlice";
import requestSliceReducer from "./requestSlice";
import connectionSliceReducer from "./connectionSlice";

const appStore = configureStore({
  reducer: {
    authSlice: authSliceReducer,
    discovery: discoverySliceReducer,
    requests: requestSliceReducer,
    connections: connectionSliceReducer,
  },
});

export default appStore;
