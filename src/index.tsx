import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MarkdownPage from "./components/MarkdownPage";
import Rooms from "./Pages/Rooms";
import Misc from "./Pages/Misc";
import Lists from "./Pages/Lists";
import Photography from "./Pages/Photography";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/test" element={<MarkdownPage source={"content/Test.md"} />} />
        <Route path="/" element={<App />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/misc" element={<Misc />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/photography" element={<Photography />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
