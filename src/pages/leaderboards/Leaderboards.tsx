/*
Ilan's Website
Copyright (C) 2024-2025 ILAN ROSENBAUM

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";
import { performTransitionAndRedirect } from "../../App";
import { appConfig as PlacesConfig } from "./pages/Places";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {}
};

const appConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 3,
    left: 0,
    topLeft: 0,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/leaderboards";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: {
    bottomRight: structuredClone(minConfig),
    left: structuredClone(minConfig),
    bottomLeft: structuredClone(minConfig)
  }
};

appConfig.titleSize = "max(0.7vw, 0.7vh)";
appConfig.title = "Leaderboards";
// If statement exists so TS doesn't get mad. Literally should never matter.
if (appConfig.config !== undefined) {
  appConfig.config.left.targetLevels = PlacesConfig.targetLevels;
}

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 3,
    left: 0,
    topLeft: 0,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {
    left: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/leaderboards/places");
    },
    bottomLeft: () => {
      window.location.href = "/leaderboards/restaurants";
    },
    topRight: () => {
      window.location.href = "/leaderboards/books";
    }
  },
  images: sharedConfig.images,
  text: {
    3: "Restaurants",
    6: "Books"
  },
  title: "Leaderboards",
  backButton: {
    exists: true,
    to: "/",
    textColor: "#4c0013"
  }
};

const leftConfig = structuredClone(minConfig);
leftConfig.targetLevels = PlacesConfig.targetLevels;
leftConfig.titleSize = "0.9vw";
leftConfig.title = "Places";

pageConfig.config = { left: leftConfig };

const Leaderboards: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Leaderboards;
