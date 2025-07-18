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
import SierpinskiHexagon from "../components/SierpinskiHexagon";

const sharedConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 0,
    bottomLeft: 0,
    left: 3,
    topLeft: 3,
    topRight: 3
  },
  styles: {
    default: {
      fill: "#4c0013",
      opacity: 1.0
    }
  },
  images: {},
  textColor: "#F2EFDE",
  dropShadow: "#F2EFDE"
};

export const appConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/rooms";
    }
  },
  images: sharedConfig.images,
  text: {},
  textColor: sharedConfig.textColor,
  dropShadow: sharedConfig.dropShadow,
  backButton: {
    exists: false
  }
};

const pageConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    },
    left: () => {
      window.open(
        "https://innovate.wisc.edu/business-entrepreneurship-clinic-a-room-with-a-view-ilan-rosenbaums-app-helps-students-find-housing/",
        "_blank"
      );
    },
    topLeft: () => {
      window.location.href = "/rooms/what";
    },
    topRight: () => {
      window.location.href = "/rooms/why";
    },
    right: () => {
      window.location.href = "/rooms/how";
    }
  },
  images: sharedConfig.images,
  text: {
    1: "How",
    2: "",
    3: "",
    4: "Press",
    5: "What",
    6: "Why"
  },
  title: "roōms",
  titleSize: "5vw",
  textColor: sharedConfig.textColor,
  dropShadow: sharedConfig.dropShadow,
  backButton: {
    exists: true,
    to: "/",
    color: "#4c0013"
  }
};

const Rooms: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Rooms;
