import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: "1px solid #f8c67a",
            background: "#fffaf2",
            color: "#2e2008",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
