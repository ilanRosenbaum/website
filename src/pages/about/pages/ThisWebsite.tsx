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
import SierpinskiHexagon from "../../../components/SierpinskiHexagon";

const sharedConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 3,
    topRight: 3
  },
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {}
};

export const appConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/misc/thisWebsite";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  }
};

const pageConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    topLeft: () => {
      window.location.href = "/misc/thisWebsite/what";
    },
    topRight: () => {
      window.location.href = "/misc/thisWebsite/why";
    },
    right: () => {
      window.location.href = "/misc/thisWebsite/how";
    }
  },
  images: sharedConfig.images,
  text: {
    1: "How",
    2: "",
    3: "",
    4: "",
    5: "What",
    6: "Why"
  },
  title: "This Website",
  titleSize: "2vw",
  backButton: {
    exists: true,
    to: "/misc",
    fill: "#603b61"
  }
};

const Rooms: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Rooms;
