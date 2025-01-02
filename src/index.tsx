import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MarkdownPage from "./components/MarkdownPage";
import Rooms from "./pages/Rooms";

import Misc from "./pages/misc/Misc";
import ThisWebsite from "./pages/misc/ThisWebsite";
import Places from "./pages/misc/Places";

import Photography from "./pages/photography/Photography";
import UnitedStates from "./pages/photography/UnitedStates";
import TiledPlane from "./components/TiledPlane";
import Africa from "./pages/photography/Africa";
import Mexico from "./pages/photography/Mexico";
import California from "./pages/photography/California";
import Europe from "./pages/photography/Europe";

import TiledPlaneFolders from "./components/TiledPlaneFolders";
import Midwest from "./pages/photography/Midwest";

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
        <Route path="/misc/books" element={<MarkdownPage source={"/content/Books.md"} backTo="/misc" />} />
        <Route path="/misc/openSource" element={<MarkdownPage source={"/content/MiscOpenSource.md"} backTo="/misc" />} />
        <Route path="/misc/headphonesNoHeadphones" element={<MarkdownPage source={"/content/MiscHeadphonesNoHeadphones.md"} backTo="/misc" />} />
        <Route path="/misc/thisWebsite" element={<ThisWebsite />} />
        <Route path="/misc/thisWebsite/what" element={<MarkdownPage source={"/content/MiscThisWebsiteWhat.md"} backTo="/misc/thisWebsite" />} />
        <Route path="/misc/thisWebsite/why" element={<MarkdownPage source={"/content/MiscThisWebsiteWhy.md"} backTo="/misc/thisWebsite" />} />
        <Route path="/misc/thisWebsite/how" element={<MarkdownPage source={"/content/MiscThisWebsiteHow.md"} backTo="/misc/thisWebsite" />} />
        <Route path="/misc/places/toLive" element={<MarkdownPage useWideContainer={true} source={"/content/MiscPlacesToLive.md"} backTo="/misc/places" />} />
        <Route path="/misc/places/lived" element={<MarkdownPage source={"/content/MiscPlacesLived.md"} backTo="/misc/places" />} />
        <Route path="/misc/places/toVisit" element={<MarkdownPage source={"/content/MiscPlacesToVisit.md"} backTo="/misc/places" />} />
        <Route path="/misc/places/visited" element={<MarkdownPage useWideContainer={true} source={"/content/MiscPlacesVisited.md"} backTo="/misc/places" />} />
        <Route
          path="/misc/restaurants"
          element={
            <MarkdownPage
              source="/content/MiscRestaurants.md"
              backTo="/misc"
              googleSheetId="1q0LWe6wJalAIB0cciybzVOgQxYCs48Jv0zhhim3iwGw"
              googleSheetGids={["0", "1055759508"]}
              useWideContainer={true}
            />
          }
        />
        <Route path="/misc/places" element={<Places />} />

        <Route path="/cooking" element={<TiledPlane photoPath={"/Cooking"} backTo="/" />} />
        <Route path="/about" element={<MarkdownPage source={"/content/AboutMe.md"} backTo="/" />} />
        <Route
          path="/art"
          element={
            <TiledPlaneFolders
              parentFolder={"Ceramics"}
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
        <Route path="/photography/usa/hawaii" element={<TiledPlane photoPath={"/Photography/UnitedStates/Hawaii"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/arizona" element={<TiledPlane photoPath={"/Photography/UnitedStates/Arizona/Sedona"} backTo={"/photography/usa"} />} />

        <Route path="/photography/usa/midwest" element={<Midwest />} />
        <Route path="/photography/usa/midwest/minnesota" element={<TiledPlane photoPath={"/Photography/UnitedStates/Minnesota/Minneapolis"} backTo={"/photography/usa/midwest"} />} />
        <Route path="/photography/usa/midwest/wisconsin" element={<TiledPlane photoPath={"/Photography/UnitedStates/Wisconsin/Madison"} backTo={"/photography/usa/midwest"} />} />
        <Route path="/photography/usa/midwest/illinois" element={<TiledPlane photoPath={"/Photography/UnitedStates/Illinois/Chicago"} backTo={"/photography/usa/midwest"} />} />
        
        <Route path="/photography/usa/northCarolina" element={<TiledPlane photoPath={"/Photography/UnitedStates/NorthCarolina/Charlotte"} backTo={"/photography/usa"} />} />
        <Route path="/photography/usa/california" element={<California />} />
        <Route path="/photography/usa/california/bayArea" element={<TiledPlane photoPath={"/Photography/UnitedStates/California/BayArea"} backTo={"/photography/usa/california"} />} />
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
