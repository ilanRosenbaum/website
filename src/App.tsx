import React from "react";
import SierpinskiHexagon from "./components/SierpinskiHexagon";
import { appConfig as RoomsConfig } from "./Pages/Rooms";
import { appConfig as MiscConfig } from "./Pages/Misc";

const AppConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 0,
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
    bottomLeft: () => {
      window.location.href = "/misc";
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
    5: "roōms",
    6: "Lists"
  },
  title: "Ilan Rosenbaum",
  backButton: {
    exists: false
  },
  config: {
    "topLeft": RoomsConfig,
    "bottomLeft": MiscConfig
  }
};

const App: React.FC = () => {
  return <SierpinskiHexagon config={AppConfig} />;
};

export default App;
