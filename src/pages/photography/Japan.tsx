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
  bottomLeft: 3,
  left: 3,
  topLeft: 3,
  topRight: 3
};
appConfig.title = "Japan";
appConfig.imageId = "Japan";
appConfig.titleSize = "max(1.2vw, 1.2vh)";
appConfig.images = {
  left: "/Covers/kyotoVertical.JPG",
  topLeft: "/Covers/mtFujiVertical.JPG",
  bottomLeft: "/Covers/tokyoVertical.JPG",
  topRight: "/Covers/osakaVertical.JPG"
};

const pageConfig: HexagonConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  actions: {},
  targetLevels: appConfig.targetLevels,
  images: appConfig.images,
  text: {
    4: "Kyoto",
    5: "Mt. Fuji",
    3: "Tokyo",
    6: "Osaka"
  },
  title: "Japan",
  titleSize: "2vw",
  backButton: {
    exists: true,
    to: "/photography"
  }
};

const Japan: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    left: () => {
      navigate("/photography/japan/kyoto");
    },
    topLeft: () => {
      navigate("/photography/japan/mountFuji");
    },
    bottomLeft: () => {
      navigate("/photography/japan/tokyo");
    },
    topRight: () => {
      navigate("/photography/japan/osaka");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Japan;

export { appConfig };
