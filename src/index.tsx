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
import MarkdownPage from "./components/Markdown";
import SierpinskiPage from "./components/SierpinskiPage";

import Books from "./pages/leaderboards/Books";
import { Lived, ToVisit, Visited } from "./pages/leaderboards/Places";
import ToLive from "./pages/leaderboards/places/ToLive";
import GlazeRecipe from "./pages/trades/glazes/Recipe";

// Blog
import Blog from "./pages/writing/Blog";
import Research from "./pages/writing/Research";
import TiledPlane from "./components/TiledPlane";
// import SierpinskiExport from "./pages/SierpinskiExport";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/writing/blog" element={<Blog />} />
        <Route path="/writing/blog/:articleId" element={<Blog />} />

        <Route path="/writing" element={<SierpinskiPage pageId="writing" />} />

        <Route path="/writing/research" element={<Research />} />
        <Route path="/writing/research/:paperId" element={<Research />} />
        {/* <Route path="/sierpinski/export" element={<SierpinskiExport />} /> */}

        <Route path="/writing/about" element={<SierpinskiPage pageId="writing/about" />} />
        <Route path="/writing/about/me" element={<MarkdownPage source={"/content/Me.md"} backTo="/writing/about" />} />
        <Route path="/writing/about/thisWebsite" element={<SierpinskiPage pageId="writing/about/thisWebsite" />} />
        <Route path="/writing/about/thisWebsite/what" element={<MarkdownPage source={"/content/ThisWebsiteWhat.md"} backTo="/writing/about/thisWebsite" />} />
        <Route path="/writing/about/thisWebsite/why" element={<MarkdownPage source={"/content/ThisWebsiteWhy.md"} backTo="/writing/about/thisWebsite" />} />
        <Route path="/writing/about/thisWebsite/how" element={<MarkdownPage source={"/content/ThisWebsiteHow.md"} backTo="/writing/about/thisWebsite" />} />
        <Route path="/writing/about/thisWebsite/versioning" element={<MarkdownPage source={"/content/Versioning.md"} backTo="/writing/about/thisWebsite"  />} />
        <Route path="/writing/about/photography" element={<MarkdownPage source={"/content/PhotographyInfo.md"} backTo="/writing/about" />} />
        <Route path="/writing/about/leaderboards" element={<MarkdownPage source={"/content/Leaderboards.md"} backTo="/writing/about" />} />
        <Route path="/writing/about/links" element={<SierpinskiPage pageId="writing/about/links" />} />
        <Route path="/writing/about/links/aggregators" element={<MarkdownPage source={"/content/LinksAggregators.md"} backTo="/writing/about/links" />} />
        <Route path="/writing/about/links/journalism" element={<MarkdownPage source={"/content/LinksJournalism.md"} backTo="/writing/about/links" />} />
        <Route path="/writing/about/links/products" element={<MarkdownPage source={"/content/LinksProducts.md"} backTo="/writing/about/links" />} />
        <Route path="/writing/about/links/cool" element={<MarkdownPage source={"/content/LinksCool.md"} backTo="/writing/about/links" />} />

        <Route path="/software" element={<SierpinskiPage pageId="software" />} />
        <Route path="/software/openSource" element={<MarkdownPage source={"/content/OpenSource.md"} backTo="/software" />} />
        <Route path="/software/rooms" element={<SierpinskiPage pageId="software/rooms" />} />
        <Route path="/software/rooms/what" element={<MarkdownPage source={"/content/RoomsWhat.md"} backTo="/software/rooms" />} />
        <Route path="/software/rooms/why" element={<MarkdownPage source={"/content/RoomsWhy.md"} backTo="/software/rooms" />} />
        <Route path="/software/rooms/how" element={<MarkdownPage source={"/content/RoomsHow.md"} backTo="/software/rooms" />} />

        <Route path="/links" element={<SierpinskiPage pageId="links" />} />
        <Route path="/links/aggregators" element={<SierpinskiPage pageId="links/aggregators" />} />
        <Route path="/links/journalism" element={<SierpinskiPage pageId="links/journalism" />} />
        <Route path="/links/cool" element={<SierpinskiPage pageId="links/cool" />} />

        <Route path="/leaderboards" element={<SierpinskiPage pageId="leaderboards" />} />
        <Route path="/leaderboards/places" element={<SierpinskiPage pageId="leaderboards/places" />} />
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

        <Route path="/trades" element={<SierpinskiPage pageId="trades" />} />
        <Route path="/trades/cooking" element={<TiledPlane photoPath={"Cooking"} backTo="/trades" />} />
        <Route path="/trades/ceramics" element={<SierpinskiPage pageId="trades/ceramics" />} />
        <Route path="/trades/ceramics/works" element={<TiledPlane parentFolders={"Ceramics"} backTo="/trades/ceramics" />} />
        <Route path="/trades/ceramics/glazes" element={<MarkdownPage source="/content/glazes/Spreadsheet.md" backTo="/trades/ceramics" />} />
        <Route path="/trades/ceramics/glazes/:glazeId" element={<GlazeRecipe />} />
        <Route path="/trades/richAndFrank" element={<TiledPlane parentFolders={"RichAndFrank"} backTo="/trades" />} />
        <Route path="/trades/misc" element={<SierpinskiPage pageId="trades/misc" />} />
        <Route path="/trades/misc/wood" element={<TiledPlane parentFolders={"Wood"} backTo="/trades/misc" />} />
        <Route path="/trades/misc/leather" element={<TiledPlane parentFolders={"Leather"} backTo="/trades/misc" />} />
        <Route path="/trades/misc/jewelry" element={<TiledPlane parentFolders={"Jewelry"} backTo="/trades/misc" />} />
        <Route
          path="/trades/favorites"
          element={
            <TiledPlane
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

        <Route path="/photography" element={<SierpinskiPage pageId="photography" />} />
        <Route path="/photography/usa" element={<SierpinskiPage pageId="photography/usa" />} />
        <Route path="/photography/inBetween" element={<TiledPlane photoPath={"/Photography/Travel"} backTo={"/photography"} />} />

        {/* Africa */}
        <Route path="/photography/africa" element={<SierpinskiPage pageId="photography/africa" />} />
        <Route path="/photography/africa/morocco" element={<TiledPlane photoPath={"/Photography/Africa/Morocco"} backTo={"/photography/africa"} />} />

        {/* Mexico */}
        <Route path="/photography/mexico" element={<SierpinskiPage pageId="photography/mexico" />} />
        <Route path="/photography/mexico/puertoVallarta" element={<TiledPlane photoPath={"/Photography/Mexico"} backTo={"/photography/mexico"} />} />
        <Route path="/photography/mexico/cancun" element={<TiledPlane photoPath={"/Photography/Mexico/Cancun"} backTo={"/photography/mexico"} />} />

        {/* US Regions */}
        <Route path="/photography/usa/midwest" element={<SierpinskiPage pageId="photography/usa/midwest" />} />
        <Route path="/photography/usa/northEast" element={<SierpinskiPage pageId="photography/usa/northEast" />} />
        <Route path="/photography/usa/westCoast" element={<SierpinskiPage pageId="photography/usa/westCoast" />} />
        <Route path="/photography/usa/south" element={<SierpinskiPage pageId="photography/usa/south" />} />
        <Route path="/photography/usa/sunbelt" element={<SierpinskiPage pageId="photography/usa/sunbelt" />} />

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
        <Route path="/photography/usa/westCoast/california" element={<SierpinskiPage pageId="photography/usa/westCoast/california" />} />
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
        <Route path="/photography/europe" element={<SierpinskiPage pageId="photography/europe" />} />
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
        <Route path="/photography/japan" element={<SierpinskiPage pageId="photography/japan" />} />
        <Route path="/photography/japan/kyoto" element={<TiledPlane photoPath={"/Photography/Japan/Kyoto"} backTo={"/photography/japan"} />} />
        <Route path="/photography/japan/mountFuji" element={<TiledPlane photoPath={"/Photography/Japan/MtFuji"} backTo={"/photography/japan"} />} />
        <Route path="/photography/japan/tokyo" element={<TiledPlane photoPath={"/Photography/Japan/Tokyo"} backTo={"/photography/japan"} />} />
        <Route path="/photography/japan/osaka" element={<TiledPlane photoPath={"/Photography/Japan/Osaka"} backTo={"/photography/japan"} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
