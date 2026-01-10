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
  const navigate = useNavigate();

  pageConfig.actions = {
    left: () => {
      navigate("/photography/usa/westCoast/california/bayArea");
    },
    bottomLeft: () => {
      navigate("/photography/usa/westCoast/california/sacramento");
    },
    topRight: () => {
      navigate("/photography/usa/westCoast/california/tahoe");
    },
    topLeft: () => {
      navigate("/photography/usa/westCoast/california/yosemite");
    },
    bottomRight: () => {
      navigate("/photography/usa/westCoast/california/sequoia");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default California;
