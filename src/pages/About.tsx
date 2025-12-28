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
import SierpinskiHexagon, {
  HexagonConfig,
  minConfig
} from "../components/SierpinskiHexagon";
import { performTransitionAndRedirect } from "../App";
import { appConfig as WebsiteConfig } from "./about/ThisWebsite";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {
    topRight: "/Covers/meVertical.jpg"
  }
};

// The SierpinskiHexagon config to be used for the About sub hexagon on the home page
const appConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 0,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {
    right: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/about/thisWebsite");
    },
    topRight: () => {
      window.location.href = "/about/me";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: {
    right: WebsiteConfig
  }
};

// If statement exists so TS doesn't get mad. Literally should never matter.
if (appConfig.config !== undefined) {
  appConfig.config.right.targetLevels = WebsiteConfig.targetLevels;
}

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 0,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {
    right: () => {
      window.location.href = "/about/thisWebsite";
    },
    topRight: () => {
      window.location.href = "/about/me";
    }
  },
  images: sharedConfig.images,
  text: {
    6: "Me",
  },
  title: "About",
  backButton: {
    exists: true,
    to: "/",
    textColor: "#4c0013"
  }
};

const rightConfig = structuredClone(minConfig);
rightConfig.targetLevels = WebsiteConfig.targetLevels;
rightConfig.titleSize = "0.65vw";
rightConfig.title = "This Website";

pageConfig.config = {};
pageConfig.config.right = rightConfig;

const About: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default About;
