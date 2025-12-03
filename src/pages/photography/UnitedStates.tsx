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
import { appConfig as westCoastConfig } from "./WestCoast";
import { appConfig as midwestConfig } from "./Midwest";
import { appConfig as northEastConfig } from "./NorthEast";
import { appConfig as southConfig } from "./South";
import { appConfig as sunbeltConfig } from "./Sunbelt";
import { performTransitionAndRedirect } from "../../App";

const sharedConfig: HexagonConfig = structuredClone(minConfig);
sharedConfig.images = {
  bottomLeft: "/Covers/hawaiiVertical.jpg",
};
const appConfig: HexagonConfig = structuredClone(minConfig);
appConfig.title = "United States";
appConfig.imageId = "United States";
appConfig.titleSize = "max(0.9vw, 0.9vh)";
appConfig.targetLevels = {
  right: 0,
  bottomRight: 0,
  bottomLeft: 3,
  left: 0,
  topLeft: 0,
  topRight: 0
};
appConfig.config = {};
appConfig.config.bottomRight = structuredClone(westCoastConfig);
appConfig.config.bottomRight.title = "";
appConfig.config.right = structuredClone(midwestConfig);
appConfig.config.right.title = "";
appConfig.config.topRight = structuredClone(northEastConfig);
appConfig.config.topRight.title = "";
appConfig.config.topLeft = structuredClone(southConfig);
appConfig.config.topLeft.title = "";
appConfig.config.left = structuredClone(sunbeltConfig);
appConfig.config.left.title = "";
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
    performTransitionAndRedirect(hexagonId, "/photography/usa/westCoast");
  },
  bottomLeft: () => {
    window.location.href = "/photography/usa/hawaii";
  },
  left: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/usa/sunbelt");
  },
  topLeft: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/usa/south");
  },
  topRight: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/usa/northEast");
  }
};
pageConfig.titleSize = "2vw";
pageConfig.text = {
  3: "Hawaii",
};
pageConfig.images = sharedConfig.images;

pageConfig.config = {};
pageConfig.config.bottomRight = structuredClone(westCoastConfig);
pageConfig.config.bottomRight.titleSize = "max(0.8vw, 0.7vh)";
pageConfig.config.right = structuredClone(midwestConfig);
pageConfig.config.right.titleSize = "max(0.9vw, 0.8vh)";
pageConfig.config.topRight = structuredClone(northEastConfig);
pageConfig.config.topRight.titleSize = "max(0.9vw, 0.8vh)";
pageConfig.config.topLeft = structuredClone(southConfig);
pageConfig.config.topLeft.titleSize = "max(0.9vw, 0.8vh)";
pageConfig.config.left = structuredClone(sunbeltConfig);
pageConfig.config.left.titleSize = "max(0.9vw, 0.8vh)";

const UnitedStates: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default UnitedStates;
export { appConfig };
