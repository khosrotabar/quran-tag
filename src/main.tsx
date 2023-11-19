import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ReservedWordsProvider } from "@/context";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReservedWordsProvider>
      <App />
    </ReservedWordsProvider>
  </React.StrictMode>,
);
