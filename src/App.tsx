import React from "react";
import SierpinskiHexagon, { HexagonConfig } from "./components/SierpinskiHexagon";
import { appConfig as RoomsConfig } from "./Pages/Rooms";
import { appConfig as MiscConfig } from "./Pages/Misc";
import { appConfig as PhotographyConfig } from "./Pages/Photography/Photography";

const AppConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 3,
    bottomLeft: 0,
    left: 3,
    topLeft: 0,
    topRight: 3
  },
  styles: {
    default: {
      fill: "#603b61",
      opacity: 0.6
    }
  },
  actions: {
    bottomLeft: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/misc");
    },
    topLeft: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/rooms");
    },
    right: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/photography");
    },
    left: () => {
      window.location.href = "/cooking";
    },
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    }
  },
  images: {
    bottomRight: "./assets/covers/garlicVertical.jpg",
    right: "./assets/covers/birdVertical.jpg",
    left: "./assets/covers/chickenPastaVertical.jpg",
    topRight: "./assets/covers/meVertical.jpg"
  },
  text: {
    2: "Ceramics",
    3: "Misc",
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
    "bottomLeft": MiscConfig,
    "right": PhotographyConfig,
  }
};

export const performTransitionAndRedirect = (hexagonId: number, url: string) => {
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

    svg.style.transition = "transform 1s ease-in-out";
    svg.style.transformOrigin = "center center";

    // First, center the hexagon while maintaining current zoom
    svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;

    // After centering, zoom in further
    setTimeout(() => {
      const zoomScale = 2.66;
      const adjustedTranslateX = translateX * zoomScale;
      const adjustedTranslateY = translateY * zoomScale;
      svg.style.transform = `translate(${adjustedTranslateX}px, ${adjustedTranslateY}px) scale(${currentScale * zoomScale})`;

      // Wait for the animation to complete before redirecting
      setTimeout(() => {
        window.location.href = url;
      }, 1500);
    }, 1500);
  } else {
    // Fallback if SVG or hexagon is not found
    window.location.href = url;
  }
};

const App: React.FC = () => {
  return <SierpinskiHexagon config={AppConfig} />;
};

export default App;
