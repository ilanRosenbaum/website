/*
Ilan's Website
Copyright (C) 2024-2026 ILAN ROSENBAUM

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MarkdownPage from "./components/MarkdownPage";

// Top right
import About from "./pages/About";
import ThisWebsite from "./pages/about/ThisWebsite";

// Bottom Left
import Leaderboards from "./pages/Leaderboards";
import Books from "./pages/leaderboards/Books";
import Places, { Lived, ToVisit, Visited } from "./pages/leaderboards/Places";
import ToLive from "./pages/leaderboards/places/ToLive";

// Top right
import Projects from "./pages/Projects";
import Rooms from "./pages/projects/Rooms";

// Bottom left
import Art from "./pages/Art";

import Photography from "./pages/Photography";
import UnitedStates from "./pages/photography/UnitedStates";
import TiledPlane from "./components/TiledPlane";
import Africa from "./pages/photography/Africa";
import Mexico from "./pages/photography/Mexico";
import California from "./pages/photography/California";
import Europe from "./pages/photography/Europe";
import NorthEast from "./pages/photography/NorthEast";
import WestCoast from "./pages/photography/WestCoast";
import South from "./pages/photography/South";
import Sunbelt from "./pages/photography/Sunbelt";

import TiledPlaneFolders from "./components/TiledPlaneFolders";
import Midwest from "./pages/photography/Midwest";
// import SierpinskiExport from "./pages/SierpinskiExport";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/blog" element={<MarkdownPage source={"/content/Blog.md"} backTo="/" />} />
        {/* <Route path="/sierpinski/export" element={<SierpinskiExport />} /> */}

        <Route path="/about" element={<About />} />
        <Route path="/about/me" element={<MarkdownPage source={"/content/Me.md"} backTo="/" />} />
        <Route path="/about/thisWebsite" element={<ThisWebsite />} />
        <Route path="/about/thisWebsite/what" element={<MarkdownPage source={"/content/ThisWebsiteWhat.md"} backTo="/about/thisWebsite" />} />
        <Route path="/about/thisWebsite/why" element={<MarkdownPage source={"/content/ThisWebsiteWhy.md"} backTo="/about/thisWebsite" />} />
        <Route path="/about/thisWebsite/how" element={<MarkdownPage source={"/content/ThisWebsiteHow.md"} backTo="/about/thisWebsite" />} />

        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/openSource" element={<MarkdownPage source={"/content/OpenSource.md"} backTo="/projects" />} />
        <Route path="/projects/headphonesNoHeadphones" element={<MarkdownPage source={"/content/HeadphonesNoHeadphones.md"} backTo="/projects" />} />
        <Route path="/projects/rooms" element={<Rooms />} />
        <Route path="/projects/rooms/what" element={<MarkdownPage source={"/content/RoomsWhat.md"} backTo="/projects/rooms" />} />
        <Route path="/projects/rooms/why" element={<MarkdownPage source={"/content/RoomsWhy.md"} backTo="/projects/rooms" />} />
        <Route path="/projects/rooms/how" element={<MarkdownPage source={"/content/RoomsHow.md"} backTo="/projects/rooms" />} />

        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/leaderboards/places" element={<Places />} />
        <Route path="/leaderboards/places/toVisit" element={<ToVisit />} />
        <Route path="/leaderboards/places/visited" element={<Visited />} />
        <Route path="/leaderboards/places/toLive" element={<ToLive />} />
        <Route path="/leaderboards/places/lived" element={<Lived />} />
        <Route
          path="/leaderboards/restaurants"
          element={
            <MarkdownPage
              source="/content/Restaurants.md"
              backTo="/leaderboards"
              googleSheetId="1q0LWe6wJalAIB0cciybzVOgQxYCs48Jv0zhhim3iwGw"
              googleSheetGids={["0", "1055759508"]}
              useWideContainer={true}
            />
          }
        />
        <Route path="/leaderboards/books" element={<Books />} />

        <Route path="/art" element={<Art />} />
        <Route path="/art/cooking" element={<TiledPlane photoPath={"/Cooking"} backTo="/art" />} />
        <Route path="/art/pottery" element={<TiledPlaneFolders parentFolder={"Ceramics"} backTo="/art" />} />
        <Route path="/art/RichAndFrank" element={<TiledPlaneFolders parentFolder={"RichAndFrank"} backTo="/art" />} />
        <Route path="/art/wood" element={<TiledPlaneFolders parentFolder={"Wood"} backTo="/art" />} />

        <Route path="/photography" element={<Photography />} />
        <Route path="/photography/usa" element={<UnitedStates />} />
        <Route path="/photography/info" element={<MarkdownPage source={"/content/PhotographyInfo.md"} backTo="/photography" />} />
        <Route path="/photography/inBetween" element={<TiledPlane photoPath={"/Photography/Travel"} backTo={"/photography"} />} />

        {/* Africa */}
        <Route path="/photography/africa" element={<Africa />} />
        <Route path="/photography/africa/morocco" element={<TiledPlane photoPath={"/Photography/Africa/Morocco"} backTo={"/photography/africa"} />} />

        {/* Mexico */}
        <Route path="/photography/mexico" element={<Mexico />} />
        <Route path="/photography/mexico/puertoVallarta" element={<TiledPlane photoPath={"/Photography/Mexico"} backTo={"/photography/mexico"} />} />

        {/* US Regions */}
        <Route path="/photography/usa/midwest" element={<Midwest />} />
        <Route path="/photography/usa/northEast" element={<NorthEast />} />
        <Route path="/photography/usa/westCoast" element={<WestCoast />} />
        <Route path="/photography/usa/south" element={<South />} />
        <Route path="/photography/usa/sunbelt" element={<Sunbelt />} />

        {/* Hawaii */}
        <Route path="/photography/usa/hawaii" element={<TiledPlane photoPath={"/Photography/UnitedStates/Hawaii"} backTo={"/photography/usa"} />} />

        {/* Midwest States */}
        <Route
          path="/photography/usa/midwest/minnesota"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/Minnesota/Minneapolis"} backTo={"/photography/usa/midwest"} />}
        />
        <Route
          path="/photography/usa/midwest/wisconsin"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/Wisconsin/Madison"} backTo={"/photography/usa/midwest"} />}
        />
        <Route
          path="/photography/usa/midwest/illinois"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/Illinois/Chicago"} backTo={"/photography/usa/midwest"} />}
        />

        {/* North East States */}
        <Route
          path="/photography/usa/northEast/newYork/nyc"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/NewYork/NYC"} backTo={"/photography/usa/northEast"} />}
        />

        {/* West Coast - California */}
        <Route path="/photography/usa/westCoast/california" element={<California />} />
        <Route
          path="/photography/usa/westCoast/california/bayArea"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/California/BayArea"} backTo={"/photography/usa/westCoast/california"} />}
        />
        <Route
          path="/photography/usa/westCoast/california/sacramento"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/California/Sacramento"} backTo={"/photography/usa/westCoast/california"} />}
        />
        <Route
          path="/photography/usa/westCoast/california/sequoia"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/California/Sequoia"} backTo={"/photography/usa/westCoast/california"} />}
        />
        <Route
          path="/photography/usa/westCoast/california/tahoe"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/California/Tahoe"} backTo={"/photography/usa/westCoast/california"} />}
        />
        <Route
          path="/photography/usa/westCoast/california/yosemite"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/California/Yosemite"} backTo={"/photography/usa/westCoast/california"} />}
        />
        <Route
          path="/photography/usa/westCoast/washington"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/Washington"} backTo={"/photography/usa/westCoast"} />}
        />

        {/* South States */}
        <Route
          path="/photography/usa/south/northCarolina"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/NorthCarolina/Charlotte"} backTo={"/photography/usa/south"} />}
        />

        {/* Sunbelt States */}
        <Route
          path="/photography/usa/sunbelt/arizona"
          element={<TiledPlane photoPath={"/Photography/UnitedStates/Arizona/Sedona"} backTo={"/photography/usa/sunbelt"} />}
        />

        {/* Europe */}
        <Route path="/photography/europe" element={<Europe />} />
        <Route
          path="/photography/europe/netherlands"
          element={<TiledPlane photoPath={"/Photography/Europe/Amsterdam"} backTo={"/photography/europe"} />}
        />
        <Route path="/photography/europe/spain" element={<TiledPlane photoPath={"/Photography/Europe/Girona"} backTo={"/photography/europe"} />} />
        <Route
          path="/photography/europe/denmark"
          element={<TiledPlane photoPath={"/Photography/Europe/Copenhagen"} backTo={"/photography/europe"} />}
        />
        <Route path="/photography/europe/france" element={<TiledPlane photoPath={"/Photography/Europe/Lyon"} backTo={"/photography/europe"} />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
