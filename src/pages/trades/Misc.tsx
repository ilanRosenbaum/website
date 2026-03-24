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
import SierpinskiHexagon, { HexagonConfig } from "../../components/SierpinskiHexagon";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 0.6
    }
  },
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 3,
    left: 3,
    topLeft: 3,
    topRight: 0
  },
  images: {
    bottomLeft: "/Covers/leatherVertical.jpg",
    left: "/Covers/woodVertical.jpeg",
    topLeft: "/Covers/jewelryVertical.jpg"
  }
};

export const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/trades/misc";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: {}
};

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    3: "Leather",
    4: "Wood",
    5: "Jewelry"
  },
  title: "Misc",
  backButton: {
    exists: true,
    to: "/trades",
    textColor: "#4c0013"
  }
};

const Misc: React.FC = () => {
  const navigate = useNavigate();
  pageConfig.actions = {
    bottomLeft: () => {
      navigate("/trades/misc/leather");
    },
    left: () => {
      navigate("/trades/misc/wood");
    },
    topLeft: () => {
      navigate("/trades/misc/jewelry");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Misc;
