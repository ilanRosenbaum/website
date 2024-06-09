import React from "react";
import SierpinskiHexagon from "./components/SierpinskiHexagon";

const hexagonConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 2,
    left: 3,
    topLeft: 1,
    topRight: 2,
  },
  styles: {
    bottomRight: {
      fill: "url(#image-fill-bottomRight)",
      opacity: 0.5
    },
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  actions: {
    bottomRight: () => {
      window.location.href = "/test";
    },
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    }
  },
  images: {
    bottomRight: "./assets/ceramics/garlic.jpg",
    right: "./assets/photography/bird.jpg",
    left: "./assets/cooking/chicken_pasta.jpg",
  },
  text: {
    1: "Photography",
    2: "Ceramics",
    3: "Misc",
    4: "Cooking",
    5: "roōms",
    6: "Lists"
  },
  title: "Ilan Rosenbaum"
};

const App: React.FC = () => {
  return <SierpinskiHexagon config={hexagonConfig} />;
};

export default App;
