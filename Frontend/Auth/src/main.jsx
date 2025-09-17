import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";

// Initialize theme immediately to prevent flash
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import { Provider } from "react-redux";
import appStore from "./store/appStore";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={appStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
