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
import SierpinskiHexagon, { HexagonConfig } from "../../components/SierpinskiHexagon";
import { COLORS } from "../../Constants";

const sharedConfig = {
  styles: {
    default: {
      fill: COLORS.BACK_BUTTON_PURPLE,
      opacity: 0.6
    }
  },
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 0,
    left: 3,
    topLeft: 0,
    topRight: 0
  },
  images: {
    left: "/Covers/recipetsplitterVertical.png",
    right: "/Covers/ribozoneVertical.png",
    bottomRight: "/Covers/17776Vertical.jpg"
  }
};

const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/links/cool";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  }
};
appConfig.title = "Cool";

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    4: "Receipt Splitter",
    2: "17776",
    1: "Ribo.zone"
  },
  title: "Cool Websites",
  backButton: {
    exists: true,
    to: "/links",
    textColor: COLORS.DARK_MAROON
  },
  confusedButton: {
    link: "/about/links/cool"
  }
};

const CoolWebsites: React.FC = () => {
  pageConfig.actions = {
    left: () => {
      window.open("https://receiptsplitter.org/", "_blank");
    },
    right: () => {
      window.open("https://ribo.zone/", "_blank");
    },
    bottomRight: () => {
      window.open("https://www.sbnation.com/a/17776-football/chapter-1", "_blank");
    },
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default CoolWebsites;
