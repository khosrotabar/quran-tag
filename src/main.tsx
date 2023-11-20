import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./App.tsx";
import { ReservedWordsProvider } from "@/context";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReservedWordsProvider>
      <App />
      <ToastContainer />
    </ReservedWordsProvider>
  </React.StrictMode>,
);
