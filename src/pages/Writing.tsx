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
import { appConfig as AboutConfig } from "./writing/About";
import { COLORS } from "../Constants";

const sharedConfig = {
  styles: {
    default: {
      fill: COLORS.BACK_BUTTON_PURPLE,
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

// The SierpinskiHexagon config to be used for the Writing sub hexagon on the home page
const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/writing";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: {
    topRight: AboutConfig,
  }
};
appConfig.title = "Writing";
appConfig.titleSize = "max(1.2vw, 1.2vh)";

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    4: "Blog",
    3: "Research",
    6: "About"
  },
  title: "Writing",
  backButton: {
    exists: true,
    to: "/",
    textColor: COLORS.DARK_MAROON
  },
  config: {
    topRight: AboutConfig,
  }
};

const Writing: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    topRight: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/writing/about", navigate);
    },
    left: () => {
      navigate("/writing/blog");
    },
    bottomLeft: () => {
      navigate("/writing/research");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Writing;
