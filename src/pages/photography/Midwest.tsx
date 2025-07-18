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
  right: 3,
  bottomRight: 3,
  bottomLeft: 0,
  left: 0,
  topLeft: 0,
  topRight: 3
};
appConfig.title = "Midwest";

appConfig.images = {
  topRight: "/Covers/chicagoVertical.jpg",
  right: "/Covers/madisonVertical.jpg",
  bottomRight: "/Covers/minneapolisVertical.jpg"
};
appConfig.imageId = "Midwest";

export { appConfig };

const pageConfig = structuredClone(appConfig);

pageConfig.actions = {
  right: () => {
    window.location.href = "/photography/usa/midwest/wisconsin";
  },
  bottomRight: () => {
    window.location.href = "/photography/usa/midwest/minnesota";
  },
  topRight: () => {
    window.location.href = "/photography/usa/midwest/illinois";
  }
};

pageConfig.backButton = {
  exists: true,
  to: "/photography/usa"
};

pageConfig.text = {
  1: "Wisconsin",
  2: "Minnesota",
  6: "Illinois"
};

const Midwest: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Midwest;
