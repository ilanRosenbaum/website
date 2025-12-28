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
import SierpinskiHexagon, { HexagonConfig, minConfig } from "../components/SierpinskiHexagon";
import { performTransitionAndRedirect } from "../App";
import { appConfig as RoomsConfig } from "./projects/Rooms";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 0.6
    }
  },
  images: {},
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 3,
    left: 3,
    topLeft: 0,
    topRight: 0
  }
};

const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/projects";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: {
    topLeft: RoomsConfig
  }
};
appConfig.title = "Projects";
appConfig.titleSize = "max(1vw, 1vh)";

export { appConfig };

const headphonesNoHeadphonesConfig = structuredClone(minConfig);
headphonesNoHeadphonesConfig.title = "Headphones, No Headphones";
headphonesNoHeadphonesConfig.titleSize = "max(0.8vw, 0.8vh)";

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    5: "roōms",
    3: "Open Source"
  },
  title: "Projects",
  backButton: {
    exists: true,
    to: "/",
    textColor: "#4c0013"
  },
  config: {
    topLeft: RoomsConfig,
    left: headphonesNoHeadphonesConfig
  }
};

const Projects: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    topLeft: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/projects/rooms", navigate);
    },
    left: () => {
      navigate("/projects/headphonesNoHeadphones");
    },
    bottomLeft: () => {
      navigate("/projects/openSource");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Projects;
