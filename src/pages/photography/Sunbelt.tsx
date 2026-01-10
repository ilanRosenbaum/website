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
appConfig.title = "Sunbelt";

appConfig.images = {
  left: "/Covers/sedonaVertical.jpeg"
};
appConfig.imageId = "Sunbelt";

export { appConfig };

const pageConfig = structuredClone(appConfig);

pageConfig.backButton = {
  exists: true,
  to: "/photography/usa"
};

pageConfig.text = {
  4: "Arizona"
};

const Sunbelt: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    left: () => {
      navigate("/photography/usa/sunbelt/arizona");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Sunbelt;
