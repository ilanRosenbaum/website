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
    right: 0,
    bottomRight: 0,
    bottomLeft: 3,
    left: 0,
    topLeft: 0,
    topRight: 3
  },
  images: {
    topRight: "/Covers/neocitiesCover.png",
    bottomLeft: "/Covers/melonlandVertical.png"
  }
};

const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/links/aggregators";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  }
};
appConfig.title = "Aggregators";
appConfig.titleSize = "max(0.7vw, 0.7vh)";

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    3: "MelonLand",
    6: "Neocities"
  },
  title: "Aggregators",
  backButton: {
    exists: true,
    to: "/links",
    textColor: COLORS.DARK_MAROON
  },
  confusedButton: {
    link: "/about/links/aggregators"
  }
};

const Aggregators: React.FC = () => {
  pageConfig.actions = {
    bottomLeft: () => {
      window.open("https://melonland.net/surf-club", "_blank");
    },
    topRight: () => {
      window.open("https://neocities.org/browse", "_blank");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Aggregators;
