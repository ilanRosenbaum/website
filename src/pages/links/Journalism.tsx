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

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
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
    right: "/Covers/goodgoodgoodVertical.jpg",
    left: "/Covers/slowjournalismVertical.jpg",
    bottomRight: "/Covers/cherrybonesVertical.jpg"
  }
};

const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/links/journalism";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  }
};
appConfig.title = "Journalism";
appConfig.titleSize = "max(0.7vw, 0.7vh)";

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    1: "GoodGoodGood",
    4: "Slow Journalism",
    2: "Cherry Bones"
  },
  title: "Journalism",
  backButton: {
    exists: true,
    to: "/links",
    textColor: "#4c0013"
  },
  confusedButton: {
    link: "/about/links/journalism"
  }
};

const Journalism: React.FC = () => {
  pageConfig.actions = {
    right: () => {
      window.open("https://www.goodgoodgood.co/", "_blank");
    },
    left: () => {
      window.open("https://www.slow-journalism.com/", "_blank");
    },
    bottomRight: () => {
      window.open("https://cherrybonesmag.com/", "_blank");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Journalism;
