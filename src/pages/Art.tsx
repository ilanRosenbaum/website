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
import { useNavigate } from "react-router-dom";
import SierpinskiHexagon, { HexagonConfig } from "../components/SierpinskiHexagon";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 0,
    left: 3,
    topLeft: 3,
    topRight: 0
  },
  images: {
    right: "/Covers/garlicVertical.jpg",
    bottomRight: "/Covers/RichAndFrankVertical.jpg",
    left: "/Covers/chickenPastaVertical.jpg",
    topLeft: "/Covers/woodVertical.jpg"
  }
};

const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/art";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: {}
};

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    5: "Wood",
    4: "Cooking",
    1: "Pottery",
    2: "Rich & Frank"
  },
  title: "Art",
  backButton: {
    exists: true,
    to: "/",
    textColor: "#4c0013"
  }
};

const About: React.FC = () => {
  const navigate = useNavigate();
  pageConfig.actions = {
    right: () => {
      navigate("/art/pottery");
    },
    bottomRight: () => {
      navigate("/art/RichAndFrank");
    },
    left: () => {
      navigate("/art/cooking");
    },
    topLeft: () => {
      navigate("/art/wood");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default About;
