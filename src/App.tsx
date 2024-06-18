import React from "react";
import SierpinskiHexagon from "./components/SierpinskiHexagon";

const RoomsConfig = {
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
  actions: {
    default: () => {
      window.location.href = "/rooms";
    }
  },
  images: {},
  text: {},
  title: "roōms",
  textColor: "#F2EFDE",
  dropShadow: "#F2EFDE",
  backButton: {
    exists: false,
  }
};

const AppConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 2,
    left: 3,
    topLeft: 0,
    topRight: 2
  },
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  actions: {
    bottomRight: () => {
      window.location.href = "/test";
    },
    topLeft: () => {
      window.location.href = "/rooms";
    },
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    }
  },
  images: {
    bottomRight: "./assets/ceramics/garlic.jpg",
    right: "./assets/photography/bird.jpg",
    left: "./assets/cooking/chicken_pasta.jpg"
  },
  text: {
    1: "Photography",
    2: "Ceramics",
    3: "Misc",
    4: "Cooking",
    6: "Lists"
  },
  title: "Ilan Rosenbaum",
  backButton: {
    exists: false
  },
  config: {
    "topLeft": RoomsConfig
  }
};

const App: React.FC = () => {
  return <SierpinskiHexagon config={AppConfig} />;
};

export default App;
