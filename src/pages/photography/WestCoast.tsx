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
import { useNavigate } from "react-router-dom";
import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";
import { appConfig as californiaConfig } from "./California";
import { performTransitionAndRedirect } from "../../App";

const appConfig: HexagonConfig = structuredClone(minConfig);
appConfig.targetLevels = {
  right: 3,
  bottomRight: 0,
  bottomLeft: 0,
  left: 0,
  topLeft: 0,
  topRight: 0
};
appConfig.title = "West Coast";

appConfig.images = {
  right: "/Covers/seattleVertical.jpg"
};
appConfig.imageId = "WestCoast";
appConfig.config = {};
appConfig.config.topLeft = structuredClone(californiaConfig);
appConfig.config.topLeft.title = "";

export { appConfig };

const pageConfig = structuredClone(appConfig);

pageConfig.backButton = {
  exists: true,
  to: "/photography/usa"
};

pageConfig.text = {
  1: "Washington"
};
pageConfig.config = {};
pageConfig.config.topLeft = structuredClone(californiaConfig);
pageConfig.config.topLeft.titleSize = "max(0.8vw, 0.7vh)";

const WestCoast: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    topLeft: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/photography/usa/westCoast/california", navigate);
    },
    right: () => {
      navigate("/photography/usa/westCoast/washington");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default WestCoast;
