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
import { useNavigate } from "react-router-dom";
import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";

const appConfig: HexagonConfig = structuredClone(minConfig);
appConfig.targetLevels = {
  right: 3,
  bottomRight: 0,
  bottomLeft: 3,
  left: 3,
  topLeft: 3,
  topRight: 0
};
appConfig.titleSize = "max(1.2vw, 1.2vh)";
appConfig.title = "Europe";
appConfig.imageId = "Europe";
appConfig.images = {
  left: "/Covers/amsterdamVertical.jpg",
  bottomLeft: "/Covers/lyonVertical.jpg",
  topLeft: "/Covers/gironaVertical.jpg",
  right: "/Covers/copenhagenVertical.jpg"
};

export { appConfig };

const pageConfig = structuredClone(appConfig);
pageConfig.backButton = {
  exists: true,
  to: "/photography"
};

pageConfig.images = {
  left: "/Covers/amsterdamVertical.jpg",
  bottomLeft: "/Covers/lyonVertical.jpg",
  topLeft: "/Covers/gironaVertical.jpg",
  right: "/Covers/copenhagenVertical.jpg"
};

pageConfig.text = {
  1: "Denmark",
  3: "France",
  4: "Netherlands",
  5: "Spain"
};

pageConfig.backButton = {
  exists: true,
  to: "/photography"
};

const California: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    left: () => {
      navigate("/photography/europe/netherlands");
    },
    bottomLeft: () => {
      navigate("/photography/europe/france");
    },
    topLeft: () => {
      navigate("/photography/europe/spain");
    },
    right: () => {
      navigate("/photography/europe/denmark");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default California;
