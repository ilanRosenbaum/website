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
import { performTransitionAndRedirect } from "../../App";
import { appConfig as WebsiteConfig } from "./about/ThisWebsite";
import { appConfig as AboutLinksConfig } from "./about/Links";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 0.6
    }
  },
  images: {
    topRight: "/Covers/meVertical.jpg"
  }
};

// The SierpinskiHexagon config to be used for the About sub hexagon on the Writing page
const appConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 3,
    left: 3,
    topLeft: 0,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: {
    right: WebsiteConfig,
    topLeft: AboutLinksConfig
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
    bottomLeft: 3,
    left: 3,
    topLeft: 0,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    5: "Links",
    6: "Me",
    4: "Photography",
    3: "Leaderboards"
  },
  title: "About",
  backButton: {
    exists: true,
    to: "/writing",
    textColor: "#4c0013"
  }
};

const rightConfig = structuredClone(minConfig);
rightConfig.targetLevels = WebsiteConfig.targetLevels;
rightConfig.titleSize = "0.65vw";
rightConfig.title = "This Website";

const linksConfig = structuredClone(minConfig);
linksConfig.targetLevels = AboutLinksConfig.targetLevels;


pageConfig.config = {};
pageConfig.config.right = rightConfig;
pageConfig.config.topLeft = linksConfig;

const About: React.FC = () => {
  const navigate = useNavigate();
  pageConfig.actions = {
    right: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/writing/about/thisWebsite", navigate);
    },
    topLeft: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/writing/about/links", navigate);
    },
    topRight: () => {
      navigate("/writing/about/me");
    },
    left: () => {
      navigate("/writing/about/photography");
    },
    bottomLeft: () => {
      navigate("/writing/about/leaderboards");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};
export default About;
