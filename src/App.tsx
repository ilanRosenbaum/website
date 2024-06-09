import React from "react";
import SierpinskiHexagon from "./components/SierpinskiHexagon";

const hexagonConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 3,
    left: 3,
    topLeft: 1,
    topRight: 2,
    center: 3
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
    bottomLeft: "./assets/photography/ducks.jpg",
  },
  text: {
    1: "1",
    2: "Ceramics",
    3: "photography",
    4: "4",
    5: "rooms",
    6: "6"
  },
  title: "Ilan's Works"
};

const App: React.FC = () => {
  return <SierpinskiHexagon config={hexagonConfig} />;
};

export default App;
