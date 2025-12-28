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
import SierpinskiHexagon, { HexagonConfig } from "../components/SierpinskiHexagon";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  targetLevels: {
    right: 3,
    bottomRight: 0,
    bottomLeft: 0,
    left: 3,
    topLeft: 0,
    topRight: 0
  },
  images: {
    right: "/Covers/garlicVertical.jpg",
    left: "/Covers/chickenPastaVertical.jpg"
  }
};

const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/art";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: {}
};

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    right: () => {
      window.location.href = "/art/pottery";
    },
    left: () => {
      window.location.href = "/art/cooking";
    }
  },
  images: sharedConfig.images,
  text: {
    1: "Cooking",
    4: "Pottery"
  },
  title: "Art",
  backButton: {
    exists: true,
    to: "/",
    textColor: "#4c0013"
  }
};

const About: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default About;
