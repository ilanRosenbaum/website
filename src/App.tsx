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
import SierpinskiHexagon, {
  HexagonConfig
} from "./components/SierpinskiHexagon";
import { appConfig as RoomsConfig } from "./pages/Rooms";
import { appConfig as LeaderboardsConfig } from "./pages/leaderboards/Leaderboards";
import { appConfig as PhotographyConfig } from "./pages/photography/Photography";
import { appConfig as AboutConfig } from "./pages/about/About";

const ClonedPhotographyConfig: HexagonConfig =
  structuredClone(PhotographyConfig);
ClonedPhotographyConfig.titleSize = "max(0.7vw, 0.6vh)";

const AppConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 3,
    bottomLeft: 0,
    left: 3,
    topLeft: 0,
    topRight: 0
  },
  styles: {
    default: {
      fill: "#603b61",
      opacity: 0.6
    }
  },
  actions: {
    bottomLeft: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/leaderboards");
    },
    topLeft: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/rooms");
    },
    right: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/photography");
    },
    topRight: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/about");
    },
    left: () => {
      window.location.href = "/cooking";
    },
    bottomRight: () => {
      window.location.href = "/art";
    }
  },
  images: {
    bottomRight: "/Covers/garlicVertical.jpg",
    right: "/Covers/birdVertical.jpg",
    left: "/Covers/chickenPastaVertical.jpg"
  },
  text: {
    2: "Ceramics",
    4: "Cooking",
    5: "roōms",
    6: "About"
  },
  title: "Ilan Rosenbaum",
  backButton: {
    exists: false
  },
  config: {
    "topLeft": RoomsConfig,
    "bottomLeft": LeaderboardsConfig,
    "right": ClonedPhotographyConfig,
    "topRight": AboutConfig
  },
  titleSize: "max(1.8vw, 1.6vh)"
};

export const performTransitionAndRedirect = (
  hexagonId: number,
  url: string
) => {
  const svg = document.querySelector("svg");
  const hexagon = document.querySelector(`#hexagon-${hexagonId}`);

  if (svg && hexagon) {
    // Disable hover effects
    svg.classList.add("transitioning");

    const svgRect = svg.getBoundingClientRect();
    const hexRect = hexagon.getBoundingClientRect();

    const centerX = svgRect.width / 2;
    const centerY = svgRect.height / 2;

    const hexCenterX = hexRect.left + hexRect.width / 2 - svgRect.left;
    const hexCenterY = hexRect.top + hexRect.height / 2 - svgRect.top;

    const translateX = centerX - hexCenterX;
    const translateY = centerY - hexCenterY;

    // Get current transform
    const currentTransform = window.getComputedStyle(svg).transform;
    const matrix = new DOMMatrix(currentTransform);
    const currentScale = matrix.a; // Assuming uniform scaling

    svg.style.transition = "transform 2s ease-in-out";
    svg.style.transformOrigin = "center center";

    // First, center the hexagon while maintaining current zoom
    svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;

    // After centering, zoom in further
    setTimeout(() => {
      const zoomScale = 3;
      const adjustedTranslateX = translateX * zoomScale;
      const adjustedTranslateY = translateY * zoomScale;
      svg.style.transform = `translate(${adjustedTranslateX}px, ${adjustedTranslateY}px) scale(${
        currentScale * zoomScale
      })`;

      // Wait for the animation to complete before redirecting
      setTimeout(() => {
        window.location.href = url;
      }, 2300);
    }, 2300);
  } else {
    // Fallback if SVG or hexagon is not found
    window.location.href = url;
  }
};

const App: React.FC = () => {
  return <SierpinskiHexagon config={AppConfig} />;
};

export default App;
