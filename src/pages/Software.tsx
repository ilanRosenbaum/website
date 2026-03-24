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
import SierpinskiHexagon, { HexagonConfig } from "../components/SierpinskiHexagon";
import { performTransitionAndRedirect } from "../App";
import { appConfig as RoomsConfig } from "./software/Rooms";

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
    left: 0,
    topLeft: 0,
    topRight: 0
  }
};

const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/software";
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
appConfig.title = "Software";
appConfig.titleSize = "max(1.4vw, 1.4vh)";

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    5: "roōms",
    3: "Open Source"
  },
  title: "Software",
  backButton: {
    exists: true,
    to: "/",
    textColor: "#4c0013"
  },
  config: {
    topLeft: RoomsConfig,
  }
};

const Software: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    topLeft: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/software/rooms", navigate);
    },
    left: () => {
      navigate("/software/headphonesNoHeadphones");
    },
    bottomLeft: () => {
      navigate("/software/openSource");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Software;
