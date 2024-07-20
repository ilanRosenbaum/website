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
import Mexico from "./Pages/Photography/Mexico";
import California from "./Pages/Photography/California";
import Europe from "./Pages/Photography/Europe";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/misc" element={<Misc />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/cooking" element={<DisplayPhotos source={"/Cooking"} backTo="/" />} />
        <Route path="/art" element={<DisplayPhotos source={"/Ceramics"} backTo="/" />} />

        <Route path="/photography" element={<Photography />} />
        <Route path="/photography/usa" element={<UnitedStates />} />
        <Route path="/photography/info" element={<MarkdownPage source={"/content/PhotographyInfo.md"} backTo="/photography" />} />
        <Route path="/photography/inBetween" element={<DisplayPhotos source={"/Photography/Travel"} backTo={"/photography"} />} />
        <Route path="/photography/africa" element={<Africa />} />
        <Route path="/photography/africa/morocco" element={<DisplayPhotos source={"/Photography/Africa/Morocco"} backTo={"/photography/africa"} />} />
        <Route path="/photography/mexico" element={<Mexico />} />
        <Route path="/photography/mexico/puertoVallarta" element={<DisplayPhotos source={"/Photography/Mexico"} backTo={"/photography/mexico"} />} />
        <Route path="/photography/usa/illinois" element={<DisplayPhotos source={"/Photography/Unitedstates/Illinois/Chicago"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/hawaii" element={<DisplayPhotos source={"/Photography/Unitedstates/Hawaii"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/minnesota" element={<DisplayPhotos source={"/Photography/Unitedstates/Minnesota/Minneapolis"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/northCarolina" element={<DisplayPhotos source={"/Photography/Unitedstates/Northcarolina/Charlotte"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/wisconsin" element={<DisplayPhotos source={"/Photography/Unitedstates/Wisconsin/Madison"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/california" element={<California />} />
        <Route path="/photography/usa/california/bayArea" element={<DisplayPhotos source={"/Photography/Unitedstates/California/Bayarea"} backTo={"/photography/usa/california"} />} />
        <Route path="/photography/usa/california/sacramento" element={<DisplayPhotos source={"/Photography/Unitedstates/California/Sacramento"} backTo={"/photography/usa/california"} />} />
        <Route path="/photography/usa/california/sequoia" element={<DisplayPhotos source={"/Photography/Unitedstates/California/Sequoia"} backTo={"/photography/usa/california"} />} />
        <Route path="/photography/usa/california/tahoe" element={<DisplayPhotos source={"/Photography/Unitedstates/California/Tahoe"} backTo={"/photography/usa/california"} />} />
        <Route path="/photography/usa/california/yosemite" element={<DisplayPhotos source={"/Photography/Unitedstates/California/Yosemite"} backTo={"/photography/usa/california"} />} />
        <Route path="/photography/europe" element={<Europe />} />
        <Route path="/photography/europe/netherlands" element={<DisplayPhotos source={"/Photography/Europe/Amsterdam"} backTo={"/photography/europe"} />} />
        <Route path="/photography/europe/spain" element={<DisplayPhotos source={"/Photography/Europe/Girona"} backTo={"/photography/europe"} />} />
        <Route path="/photography/europe/denmark" element={<DisplayPhotos source={"/Photography/Europe/Copenhagen"} backTo={"/photography/europe"} />} />
        <Route path="/photography/europe/france" element={<DisplayPhotos source={"/Photography/Europe/Lyon"} backTo={"/photography/europe"} />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
