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
import { appConfig as miscConfig } from "./trades/Misc";
import { appConfig as ceramicsConfig } from "./trades/Ceramics";
import { COLORS } from "../Constants";

const ceramicsConfigClone: HexagonConfig = structuredClone(ceramicsConfig);
ceramicsConfigClone.title = "Ceramics";
ceramicsConfigClone.titleSize = "max(1vw, 1vh)";

const sharedConfig = {
  styles: {
    default: {
      fill: COLORS.BACK_BUTTON_PURPLE,
      opacity: 0.6
    }
  },
  targetLevels: {
    right: 0,
    bottomRight: 3,
    bottomLeft: 0,
    left: 3,
    topLeft: 0,
    topRight: 3
  },
  images: {
    bottomRight: "/Covers/RichAndFrankVertical.jpg",
    left: "/Covers/chickenPastaVertical.jpg",
    topRight: "/Covers/mugVertical.jpg"
  },
  config: {
    "bottomLeft": miscConfig,
    "right": ceramicsConfig
  }
};

const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/trades";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: {
    "bottomLeft": miscConfig,
    "right": ceramicsConfig
  }};

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    4: "Cooking",
    2: "Rich & Frank",
    3: "Misc",
    6: "Favorites"
  },
  title: "Trades",
  backButton: {
    exists: true,
    to: "/",
    textColor: COLORS.DARK_MAROON
  },
  config: {
    "bottomLeft": miscConfig,
    "right": ceramicsConfigClone
  }};

const About: React.FC = () => {
  const navigate = useNavigate();
  pageConfig.actions = {
    right: () => {
      navigate("/trades/ceramics");
    },
    bottomRight: () => {
      navigate("/trades/richAndFrank");
    },
    left: () => {
      navigate("/trades/cooking");
    },
    bottomLeft: () => {
      navigate("/trades/misc");
    },
    topRight: () => {
      navigate("/trades/favorites");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default About;
