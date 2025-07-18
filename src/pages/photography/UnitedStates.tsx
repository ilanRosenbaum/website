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

import SierpinskiHexagon, {
  HexagonConfig,
  minConfig
} from "../../components/SierpinskiHexagon";
import { appConfig as californiaConfig } from "./California";
import { appConfig as midwestConfig } from "./Midwest";
import { performTransitionAndRedirect } from "../../App";

const sharedConfig: HexagonConfig = structuredClone(minConfig);
sharedConfig.images = {
  bottomLeft: "/Covers/hawaiiVertical.jpg",
  topLeft: "/Covers/charlotteVertical.jpg",
  left: "/Covers/sedonaVertical.jpeg",
  topRight: "/Covers/seattleVertical.jpg",
};
const appConfig: HexagonConfig = structuredClone(minConfig);
appConfig.title = "United States";
appConfig.imageId = "United States";
appConfig.titleSize = "max(0.5vw, 0.5vh)";
appConfig.targetLevels = {
  right: 0,
  bottomRight: 0,
  bottomLeft: 3,
  left: 3,
  topLeft: 3,
  topRight: 3
};
appConfig.config = {};
appConfig.config.bottomRight = structuredClone(californiaConfig);
appConfig.config.bottomRight.title = "";
appConfig.config.right = structuredClone(midwestConfig);
appConfig.config.right.title = "";
const pageConfig: HexagonConfig = structuredClone(appConfig);
pageConfig.backButton = {
  exists: true,
  to: "/photography"
};
appConfig.images = sharedConfig.images;

pageConfig.actions = {
  right: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/usa/midwest");
  },
  bottomRight: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/usa/california");
  },
  bottomLeft: () => {
    window.location.href = "/photography/usa/hawaii";
  },
  left: () => {
    window.location.href = "/photography/usa/arizona";
  },
  topLeft: () => {
    window.location.href = "/photography/usa/northCarolina";
  },
  topRight: () => {
    window.location.href = "/photography/usa/washington";
  }
};
pageConfig.titleSize = "2vw";
pageConfig.text = {
  3: "Hawaii",
  5: "North Carolina",
  4: "Sedona",
  6: "Washington",
};
pageConfig.images = sharedConfig.images;

pageConfig.config = {};
pageConfig.config.bottomRight = structuredClone(californiaConfig);
pageConfig.config.bottomRight.titleSize = "max(0.8vw, 0.7vh)";
pageConfig.config.right = structuredClone(midwestConfig);
pageConfig.config.right.titleSize = "max(0.9vw, 0.8vh)";

const UnitedStates: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default UnitedStates;
export { appConfig };
