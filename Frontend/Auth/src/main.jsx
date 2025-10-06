import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";

// Set theme to dark mode permanently
document.documentElement.setAttribute("data-theme", "dark");

import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import ClickSpark from "./ui/ClickSpark";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={appStore}>
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
    </Provider>
  </React.StrictMode>
);
