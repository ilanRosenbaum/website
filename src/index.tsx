import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MarkdownPage from "./components/MarkdownPage";
import Rooms from "./Pages/Rooms";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/test" element={<MarkdownPage source={"content/Test.md"} />} />
        <Route path="/" element={<App />} />
        <Route path="/rooms" element={<Rooms />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
