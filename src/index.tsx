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

// Writing
import About from "./pages/writing/About";
import ThisWebsite from "./pages/writing/about/ThisWebsite";
import AboutLinks from "./pages/writing/about/Links";

// Bottom Left
import Leaderboards from "./pages/Leaderboards";
import Books from "./pages/leaderboards/Books";
import Places, { Lived, ToVisit, Visited } from "./pages/leaderboards/Places";
import ToLive from "./pages/leaderboards/places/ToLive";

// Top right
import Software from "./pages/Software";
import Rooms from "./pages/software/Rooms";

// Links
import Links from "./pages/Links";
import Aggregators from "./pages/links/Aggregators";
import Journalism from "./pages/links/Journalism";
import CoolWebsites from "./pages/links/Cool";

// Bottom left
import Art from "./pages/Trades";
import Misc from "./pages/trades/Misc";
import Ceramics from "./pages/trades/Ceramics";
import GlazeRecipe from "./pages/trades/glazes/Recipe";

// Blog
import Blog from "./pages/writing/Blog";
import Writing from "./pages/Writing";
import Research from "./pages/writing/Research";

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
import Japan from "./pages/photography/Japan";
// import SierpinskiExport from "./pages/SierpinskiExport";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/writing/blog" element={<Blog />} />
        <Route path="/writing/blog/:articleId" element={<Blog />} />

        <Route path="/writing" element={<Writing />} />

        <Route path="/writing/research" element={<Research />} />
        <Route path="/writing/research/:paperId" element={<Research />} />
        {/* <Route path="/sierpinski/export" element={<SierpinskiExport />} /> */}

        <Route path="/writing/about" element={<About />} />
        <Route path="/writing/about/me" element={<MarkdownPage source={"/content/Me.md"} backTo="/writing/about" />} />
        <Route path="/writing/about/thisWebsite" element={<ThisWebsite />} />
        <Route path="/writing/about/thisWebsite/what" element={<MarkdownPage source={"/content/ThisWebsiteWhat.md"} backTo="/writing/about/thisWebsite" />} />
        <Route path="/writing/about/thisWebsite/why" element={<MarkdownPage source={"/content/ThisWebsiteWhy.md"} backTo="/writing/about/thisWebsite" />} />
        <Route path="/writing/about/thisWebsite/how" element={<MarkdownPage source={"/content/ThisWebsiteHow.md"} backTo="/writing/about/thisWebsite" />} />
        <Route path="/writing/about/thisWebsite/versioning" element={<MarkdownPage source={"/content/Versioning.md"} backTo="/writing/about/thisWebsite"  />} />
        <Route path="/writing/about/photography" element={<MarkdownPage source={"/content/PhotographyInfo.md"} backTo="/writing/about" />} />
        <Route path="/writing/about/leaderboards" element={<MarkdownPage source={"/content/Leaderboards.md"} backTo="/writing/about" />} />
        <Route path="/writing/about/links" element={<AboutLinks />} />
        <Route path="/writing/about/links/aggregators" element={<MarkdownPage source={"/content/LinksAggregators.md"} backTo="/writing/about/links" />} />
        <Route path="/writing/about/links/journalism" element={<MarkdownPage source={"/content/LinksJournalism.md"} backTo="/writing/about/links" />} />
        <Route path="/writing/about/links/products" element={<MarkdownPage source={"/content/LinksProducts.md"} backTo="/writing/about/links" />} />
        <Route path="/writing/about/links/cool" element={<MarkdownPage source={"/content/LinksCool.md"} backTo="/writing/about/links" />} />

        <Route path="/software" element={<Software />} />
        <Route path="/software/openSource" element={<MarkdownPage source={"/content/OpenSource.md"} backTo="/software" />} />
        <Route path="/software/rooms" element={<Rooms />} />
        <Route path="/software/rooms/what" element={<MarkdownPage source={"/content/RoomsWhat.md"} backTo="/software/rooms" />} />
        <Route path="/software/rooms/why" element={<MarkdownPage source={"/content/RoomsWhy.md"} backTo="/software/rooms" />} />
        <Route path="/software/rooms/how" element={<MarkdownPage source={"/content/RoomsHow.md"} backTo="/software/rooms" />} />

        <Route path="/links" element={<Links />} />
        <Route path="/links/aggregators" element={<Aggregators />} />
        <Route path="/links/journalism" element={<Journalism />} />
        <Route path="/links/coolWebsites" element={<CoolWebsites />} />

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

        <Route path="/trades" element={<Art />} />
        <Route path="/trades/cooking" element={<TiledPlane photoPath={"Cooking"} backTo="/trades" />} />
        <Route path="/trades/ceramics" element={<Ceramics />} />
        <Route path="/trades/ceramics/works" element={<TiledPlaneFolders parentFolders={"Ceramics"} backTo="/trades/ceramics" />} />
        <Route path="/trades/ceramics/glazes" element={<MarkdownPage source="/content/glazes/Spreadsheet.md" backTo="/trades/ceramics" />} />
        <Route path="/trades/ceramics/glazes/:glazeId" element={<GlazeRecipe />} />
        <Route path="/trades/richAndFrank" element={<TiledPlaneFolders parentFolders={"RichAndFrank"} backTo="/trades" />} />
        <Route path="/trades/misc" element={<Misc />} />
        <Route path="/trades/misc/wood" element={<TiledPlaneFolders parentFolders={"Wood"} backTo="/trades/misc" />} />
        <Route path="/trades/misc/leather" element={<TiledPlaneFolders parentFolders={"Leather"} backTo="/trades/misc" />} />
        <Route path="/trades/misc/jewelry" element={<TiledPlaneFolders parentFolders={"Jewelry"} backTo="/trades/misc" />} />
        <Route
          path="/trades/favorites"
          element={
            <TiledPlaneFolders
              parentFolders={[
                "RichAndFrank/The Coolest Planter Ever",
                "Ceramics/Porcelain Mug?!",
                "Favorites/Tree Vase",
                "Favorites/Lydia's Mug",
                "Ceramics/Garlic Holder",
                "Ceramics/Pièce de Résistance",
                "Ceramics/Mug & Saucer",
                "Leather/Knife Drawer Patchwork Thingy",
                "Ceramics/Sheldon"
              ]}
              backTo="/trades"
            />
          }
        />

        <Route path="/photography" element={<Photography />} />
        <Route path="/photography/usa" element={<UnitedStates />} />
        <Route path="/photography/inBetween" element={<TiledPlane photoPath={"/Photography/Travel"} backTo={"/photography"} />} />

        {/* Africa */}
        <Route path="/photography/africa" element={<Africa />} />
        <Route path="/photography/africa/morocco" element={<TiledPlane photoPath={"/Photography/Africa/Morocco"} backTo={"/photography/africa"} />} />

        {/* Mexico */}
        <Route path="/photography/mexico" element={<Mexico />} />
        <Route path="/photography/mexico/puertoVallarta" element={<TiledPlane photoPath={"/Photography/Mexico"} backTo={"/photography/mexico"} />} />
        <Route path="/photography/mexico/cancun" element={<TiledPlane photoPath={"/Photography/Mexico/Cancun"} backTo={"/photography/mexico"} />} />

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

        {/* Japan */}
        <Route path="/photography/japan" element={<Japan />} />
        <Route path="/photography/japan/kyoto" element={<TiledPlane photoPath={"/Photography/Japan/Kyoto"} backTo={"/photography/japan"} />} />
        <Route path="/photography/japan/mountFuji" element={<TiledPlane photoPath={"/Photography/Japan/MtFuji"} backTo={"/photography/japan"} />} />
        <Route path="/photography/japan/tokyo" element={<TiledPlane photoPath={"/Photography/Japan/Tokyo"} backTo={"/photography/japan"} />} />
        <Route path="/photography/japan/osaka" element={<TiledPlane photoPath={"/Photography/Japan/Osaka"} backTo={"/photography/japan"} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
