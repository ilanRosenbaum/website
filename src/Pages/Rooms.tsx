import React from "react";
import SierpinskiHexagon from "./../components/SierpinskiHexagon";

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
      fill: "#4c0013",
      opacity: 1.0
    }
  },
  images: {},
  textColor: "#F2EFDE",
  dropShadow: "#F2EFDE"
};

// The SierpinskiHexagon config to be used for the Rooms sub hexagon on the home page
export const appConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/rooms";
    }
  },
  images: sharedConfig.images,
  text: {},
  textColor: sharedConfig.textColor,
  dropShadow: sharedConfig.dropShadow,
  backButton: {
    exists: false
  }
};

// The SierpinskiHexagon config to be used for the Rooms page
const pageConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    }
  },
  images: sharedConfig.images,
  text: {
    1: "How",
    2: "",
    3: "",
    4: "Press",
    5: "What",
    6: "Why"
  },
  title: "roōms",
  titleSize: "5em",
  textColor: sharedConfig.textColor,
  dropShadow: sharedConfig.dropShadow,
  backButton: {
    exists: true,
    to: "/",
    color: "#4c0013"
  }
};

const Rooms: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Rooms;
