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
import SierpinskiHexagon from "../../../components/SierpinskiHexagon";

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
      fill: "#603b61",
      opacity: 0.6
    }
  },
  images: {}
};

export const appConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/writing/about/thisWebsite";
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
  actions: {},
  images: sharedConfig.images,
  text: {
    1: "How",
    4: "Versioning",
    5: "What",
    6: "Why"
  },
  title: "This Website",
  titleSize: "2vw",
  backButton: {
    exists: true,
    to: "/writing/about",
    fill: "#603b61"
  }
};

const ThisWebsite: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    topLeft: () => {
      navigate("/writing/about/thisWebsite/what");
    },
    topRight: () => {
      navigate("/writing/about/thisWebsite/why");
    },
    right: () => {
      navigate("/writing/about/thisWebsite/how");
    },
    left: () => {
      navigate("/writing/about/thisWebsite/versioning");
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default ThisWebsite;
