import React from "react";
import SierpinskiHexagon from "./../components/SierpinskiHexagon";

const sharedConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 3,
    left: 3,
    topLeft: 3,
    topRight: 3
  },
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {},
  title: "Misc",
  // textColor: "#F2EFDE",
  // dropShadow: "#F2EFDE"
};

// The SierpinskiHexagon config to be used for the Misc sub hexagon on the home page
export const appConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/misc";
    }
  },
  images: sharedConfig.images,
  text: {},
  title: sharedConfig.title,
  // textColor: sharedConfig.textColor,
  // dropShadow: sharedConfig.dropShadow,
  backButton: {
    exists: false
  }
};

// The SierpinskiHexagon config to be used for the Misc page
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
  title: sharedConfig.title,
  // textColor: sharedConfig.textColor,
  // dropShadow: sharedConfig.dropShadow,
  backButton: {
    exists: true,
    to: "/",
    color: "#4c0013"
  }
};

const Misc: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Misc;
