import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app.tsx";
import DocumentData from "./pages/documentData/index.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path=":collection">
          <Route path=":id" element={<DocumentData />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
