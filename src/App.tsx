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
import SierpinskiHexagon, {
  HexagonConfig
} from "./components/SierpinskiHexagon";
import { appConfig as ProjectsConfig } from "./pages/Projects";
import { appConfig as LeaderboardsConfig } from "./pages/Leaderboards";
import { appConfig as PhotographyConfig } from "./pages/Photography";
import { appConfig as AboutConfig } from "./pages/About";
import { appConfig as ArtConfig } from "./pages/Art";

const ClonedPhotographyConfig: HexagonConfig =
  structuredClone(PhotographyConfig);
ClonedPhotographyConfig.titleSize = "max(0.7vw, 0.6vh)";

const AppConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
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
      performTransitionAndRedirect(hexagonId, "/projects");
    },
    right: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/photography");
    },
    topRight: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/about");
    },
    left: () => {
      window.location.href = "/blog";
    },
    bottomRight: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/art");
    },
  },
  images: {
    right: "/Covers/birdVertical.jpg",
  },
  text: {
    4: "Blog",
    6: "About",
    3: "Art"
  },
  title: "Ilan Rosenbaum",
  backButton: {
    exists: false
  },
  config: {
    "topLeft": ProjectsConfig,
    "bottomLeft": ArtConfig,
    "right": ClonedPhotographyConfig,
    "topRight": AboutConfig,
    "bottomRight": LeaderboardsConfig
  },
  titleSize: "max(1.8vw, 1.6vh)"
};

export const performTransitionAndRedirect = (
  hexagonId: number,
  url: string,
  navigate?: (url: string) => void
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
        if (navigate) {
          navigate(url);
        } else {
          window.location.href = url;
        }
      }, 2300);
    }, 2300);
  } else {
    // Fallback if SVG or hexagon is not found
    if (navigate) {
      navigate(url);
    } else {
      window.location.href = url;
    }
  }
};

const App: React.FC = () => {
  const navigate = useNavigate();
  
  const configWithNavigate = React.useMemo(() => {
    const config = { ...AppConfig };
    config.actions = {
      bottomLeft: (hexagonId: number) => {
        performTransitionAndRedirect(hexagonId, "/art", navigate);
      },
      topLeft: (hexagonId: number) => {
        performTransitionAndRedirect(hexagonId, "/projects", navigate);
      },
      right: (hexagonId: number) => {
        performTransitionAndRedirect(hexagonId, "/photography", navigate);
      },
      topRight: (hexagonId: number) => {
        performTransitionAndRedirect(hexagonId, "/about", navigate);
      },
      left: () => {
        navigate("/blog");
      },
      bottomRight: (hexagonId: number) => {
        performTransitionAndRedirect(hexagonId, "/leaderboards", navigate);
      },
    };
    return config;
  }, [navigate]);

  return <SierpinskiHexagon config={configWithNavigate} />;
};

export default App;
