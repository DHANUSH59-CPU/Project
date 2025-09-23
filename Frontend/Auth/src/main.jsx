import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";

// Initialize theme immediately to prevent flash
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import ClickSpark from "./ui/ClickSpark";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={appStore}>
      <ThemeProvider>
        <ClickSpark
          sparkColor="#fff"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ClickSpark>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
