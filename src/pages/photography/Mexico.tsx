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
  bottomRight: 0,
  bottomLeft: 0,
  left: 3,
  topLeft: 0,
  topRight: 0
};
appConfig.title = "Mexico";
appConfig.imageId = "Mexico";
appConfig.titleSize = "max(1.2vw, 1.2vh)";
appConfig.images = {
  left: "/Covers/PuertoVallartaVertical.JPG"
};

const pageConfig: HexagonConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  actions: {},
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 0,
    left: 3,
    topLeft: 0,
    topRight: 0
  },
  images: {
    left: "/Covers/PuertoVallartaVertical.jpg"
  },
  text: {
    4: "Puerto Vallarta"
  },
  title: "Mexico",
  titleSize: "2vw",
  backButton: {
    exists: true,
    to: "/photography"
  }
};

const Mexico: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    left: () => {
      navigate("/photography/mexico/puertoVallarta");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Mexico;

export { appConfig };
