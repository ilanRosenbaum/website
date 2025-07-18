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

const appConfig: HexagonConfig = structuredClone(minConfig);
appConfig.targetLevels = {
  right: 0,
  bottomRight: 3,
  bottomLeft: 3,
  left: 3,
  topLeft: 3,
  topRight: 3
};
appConfig.title = "California";

appConfig.images = {
  topLeft: "/Covers/yosemiteVertical.jpg",
  topRight: "/Covers/tahoeVertical.jpg",
  left: "/Covers/bayAreaVertical.jpg",
  bottomLeft: "/Covers/sacramentoVertical.jpg",
  bottomRight: "/Covers/sequoiaVertical.jpg"
};
appConfig.imageId = "California";

export { appConfig };

const pageConfig = structuredClone(appConfig);
pageConfig.backButton = {
  exists: true,
  to: "/photography/unitedStates"
};

pageConfig.actions = {
  left: () => {
    window.location.href = "/photography/usa/california/bayArea";
  },
  bottomLeft: () => {
    window.location.href = "/photography/usa/california/sacramento";
  },
  topRight: () => {
    window.location.href = "/photography/usa/california/tahoe";
  },
  topLeft: () => {
    window.location.href = "/photography/usa/california/yosemite";
  },
  bottomRight: () => {
    window.location.href = "/photography/usa/california/sequoia";
  }
};

pageConfig.images = {
  topLeft: "/Covers/yosemiteVertical.jpg",
  topRight: "/Covers/tahoeVertical.jpg",
  left: "/Covers/bayAreaVertical.jpg",
  bottomLeft: "/Covers/sacramentoVertical.jpg",
  bottomRight: "/Covers/sequoiaVertical.jpg"
};

pageConfig.text = {
  2: "Sequoia",
  3: "Sacramento",
  4: "Bay Area",
  5: "Yosemite",
  6: "Tahoe"
};

pageConfig.backButton = {
  exists: true,
  to: "/photography/usa"
};

const California: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default California;
