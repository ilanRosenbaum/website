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

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 0.6
    }
  },
  targetLevels: {
    right: 3,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 0,
    topRight: 3
  },
  images: {
    right: "/Covers/garlicVertical.jpg",
    topRight: "/Covers/glazeCoverVertical.jpg"
  }
};

const appConfig: HexagonConfig = structuredClone(minConfig);
appConfig.targetLevels = sharedConfig.targetLevels;
appConfig.styles = sharedConfig.styles;
appConfig.images = sharedConfig.images;

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    1: "Works",
    6: "Glazes"
  },
  title: "Ceramics",
  backButton: {
    exists: true,
    to: "/trades",
    textColor: "#4c0013"
  },
  config: {}
};

const Ceramics: React.FC = () => {
  const navigate = useNavigate();
  pageConfig.actions = {
    right: () => {
      navigate("/trades/ceramics/works");
    },
    topRight: () => {
      navigate("/trades/ceramics/glazes");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Ceramics;
