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
import { appConfig as unitedStatesConfig } from "./photography/UnitedStates";
import { appConfig as africaConfig } from "./photography/Africa";
import { appConfig as mexicoConfig } from "./photography/Mexico";
import { appConfig as europeConfig } from "./photography/Europe";

const mexicoConfigClone: HexagonConfig = structuredClone(mexicoConfig);
mexicoConfigClone.title = "";
const africaConfigClone: HexagonConfig = structuredClone(africaConfig);
africaConfigClone.title = "";
const europeConfigClone: HexagonConfig = structuredClone(europeConfig);
europeConfigClone.title = "";
const unitedStatesConfigClone: HexagonConfig = structuredClone(unitedStatesConfig);
unitedStatesConfigClone.title = "";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {
    topLeft: "/Covers/planeVertical.jpg"
  }
};

const appConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 3,
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
    left: mexicoConfigClone,
    bottomLeft: africaConfigClone,
    bottomRight: europeConfigClone,
    right: unitedStatesConfigClone
  }
};
appConfig.titleSize = "max(1.2vw, 1.2vh)";
appConfig.title = "Photography";

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 3,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    5: "In Between",
    6: "Info"
  },
  title: "Photography",
  backButton: {
    exists: true,
    to: "/",
    textColor: "#4c0013"
  },
  config: {
    left: mexicoConfig,
    bottomLeft: africaConfig,
    bottomRight: europeConfig,
    right: unitedStatesConfig
  }
};

const Photography: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    right: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/photography/usa", navigate);
    },
    topRight: () => {
      navigate("/photography/info");
    },
    topLeft: () => {
      navigate("/photography/InBetween");
    },
    left: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/photography/mexico", navigate);
    },
    bottomLeft: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/photography/africa", navigate);
    },
    bottomRight: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/photography/europe", navigate);
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Photography;
