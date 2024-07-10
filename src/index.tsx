import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MarkdownPage from "./components/MarkdownPage";
import Rooms from "./Pages/Rooms";
import Misc from "./Pages/Misc";
import Lists from "./Pages/Lists";
import Photography from "./Pages/Photography/Photography";
import UnitedStates from "./Pages/Photography/UnitedStates";
import DisplayPhotos from "./components/DisplayPhotos";
import Africa from "./Pages/Photography/Africa";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/misc" element={<Misc />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/photography/usa" element={<UnitedStates />} />
        <Route path="/photography/info" element={<MarkdownPage source={"/content/PhotographyInfo.md"} />} />
        <Route path="/photography/inBetween" element={<DisplayPhotos source={"/Photography/Travel"} backTo={"/photography"}/>} />
        <Route path="/photography/africa" element={<Africa />} />
        <Route path="/photography/africa/morocco" element={<DisplayPhotos source={"/Photography/Africa/Morocco"} backTo={"/photography/africa"} />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
