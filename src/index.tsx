import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MarkdownPage from "./components/MarkdownPage";
import Rooms from "./pages/Rooms";
import Misc from "./pages/Misc";
import Lists from "./pages/Lists";
import Photography from "./pages/photography/Photography";
import UnitedStates from "./pages/photography/UnitedStates";
import TiledPlane from "./components/TiledPlane";
import Africa from "./pages/photography/Africa";
import Mexico from "./pages/photography/Mexico";
import California from "./pages/photography/California";
import Europe from "./pages/photography/Europe";
import TiledPlaneFolders from "./components/TiledPlaneFolders";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/what" element={<MarkdownPage source={"/content/RoomsWhat.md"} backTo="/rooms" />} />
        <Route path="/rooms/why" element={<MarkdownPage source={"/content/RoomsWhy.md"} backTo="/rooms" />} />
        <Route path="/rooms/how" element={<MarkdownPage source={"/content/RoomsHow.md"} backTo="/rooms" />} />

        <Route path="/misc" element={<Misc />} />
        <Route path="/misc/openSource" element={<MarkdownPage source={"/content/MiscOpenSource.md"} backTo="/misc" />} />
        <Route path="/misc/headphonesNoHeadphones" element={<MarkdownPage source={"/content/MiscHeadphonesNoHeadphones.md"} backTo="/misc" />} />

        <Route path="/lists" element={<Lists />} />
        <Route path="/cooking" element={<TiledPlane photoPath={"/Cooking"} backTo="/" />} />
        <Route path="/about" element={<MarkdownPage source={"/content/AboutMe.md"} backTo="/" />} />
        <Route
          path="/art"
          element={
            <TiledPlaneFolders
              folders={[
                "/Ceramics/Concentric Bowls",
                "/Ceramics/Cool Cylinder",
                "/Ceramics/Garlic Holder",
                "/Ceramics/Green Onion",
                "/Ceramics/Katrina's Bowl & Dad's Mug",
                "/Ceramics/Mug & Saucer",
                "/Ceramics/Reid's Cup",
                "/Ceramics/Some Green Bowls",
                "/Ceramics/Spoon Rest",
                "/Ceramics/Too Small :(",
                "/Ceramics/Assignment 1",
                "/Ceramics/Small Blue Plate",
              ]}
              backTo="/" // Adjust this to the correct back path
            />
          }
        />

        <Route path="/photography" element={<Photography />} />
        <Route path="/photography/usa" element={<UnitedStates />} />
        <Route path="/photography/info" element={<MarkdownPage source={"/content/PhotographyInfo.md"} backTo="/photography" />} />
        <Route path="/photography/inBetween" element={<TiledPlane photoPath={"/Photography/Travel"} backTo={"/photography"} />} />
        <Route path="/photography/africa" element={<Africa />} />
        <Route path="/photography/africa/morocco" element={<TiledPlane photoPath={"/Photography/Africa/Morocco"} backTo={"/photography/africa"} />} />
        <Route path="/photography/mexico" element={<Mexico />} />
        <Route path="/photography/mexico/puertoVallarta" element={<TiledPlane photoPath={"/Photography/Mexico"} backTo={"/photography/mexico"} />} />
        <Route path="/photography/usa/illinois" element={<TiledPlane photoPath={"/Photography/UnitedStates/Illinois/Chicago"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/hawaii" element={<TiledPlane photoPath={"/Photography/UnitedStates/Hawaii"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/minnesota" element={<TiledPlane photoPath={"/Photography/UnitedStates/Minnesota/Minneapolis"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/northCarolina" element={<TiledPlane photoPath={"/Photography/UnitedStates/NorthCarolina/Charlotte"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/wisconsin" element={<TiledPlane photoPath={"/Photography/UnitedStates/Wisconsin/Madison"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/california" element={<California />} />
        <Route path="/photography/usa/california/bayArea" element={<TiledPlane photoPath={"/Photography/UnitedStates/California/Bayarea"} backTo={"/photography/usa/california"} />} />
        <Route path="/photography/usa/california/sacramento" element={<TiledPlane photoPath={"/Photography/UnitedStates/California/Sacramento"} backTo={"/photography/usa/california"} />} />
        <Route path="/photography/usa/california/sequoia" element={<TiledPlane photoPath={"/Photography/UnitedStates/California/Sequoia"} backTo={"/photography/usa/california"} />} />
        <Route path="/photography/usa/california/tahoe" element={<TiledPlane photoPath={"/Photography/UnitedStates/California/Tahoe"} backTo={"/photography/usa/california"} />} />
        <Route path="/photography/usa/california/yosemite" element={<TiledPlane photoPath={"/Photography/UnitedStates/California/Yosemite"} backTo={"/photography/usa/california"} />} />
        <Route path="/photography/europe" element={<Europe />} />
        <Route path="/photography/europe/netherlands" element={<TiledPlane photoPath={"/Photography/Europe/Amsterdam"} backTo={"/photography/europe"} />} />
        <Route path="/photography/europe/spain" element={<TiledPlane photoPath={"/Photography/Europe/Girona"} backTo={"/photography/europe"} />} />
        <Route path="/photography/europe/denmark" element={<TiledPlane photoPath={"/Photography/Europe/Copenhagen"} backTo={"/photography/europe"} />} />
        <Route path="/photography/europe/france" element={<TiledPlane photoPath={"/Photography/Europe/Lyon"} backTo={"/photography/europe"} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
