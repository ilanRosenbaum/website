import React from "react";
import SierpinskiHexagon, { HexagonConfig, minConfig } from "./../components/SierpinskiHexagon";

const sharedConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 2,
    bottomLeft: 2,
    left: 2,
    topLeft: 3,
    topRight: 2
  },
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {}
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
  // textColor: sharedConfig.textColor,
  // dropShadow: sharedConfig.dropShadow,
  backButton: {
    exists: false
  }
};

// The SierpinskiHexagon config to be used to generate the config for the Misc page
const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    },
    bottomLeft: () => {
      window.location.href = "/lists";
    }
  },
  images: sharedConfig.images,
  text: {
    5: "Open Source",
  },
  title: "Miscellaneous",
  // textColor: sharedConfig.textColor,
  // dropShadow: sharedConfig.dropShadow,
  backButton: {
    exists: true,
    to: "/",
    textColor: "#4c0013"
  }
};

const bottomRightConfig = Object.create(minConfig);
bottomRightConfig.titleSize = "0.8em";
bottomRightConfig.title = "This Website"

const leftConfig = Object.create(minConfig);
leftConfig.titleSize = "0.9em";
leftConfig.title = "Anti-Hate";

const topRightConfig = Object.create(minConfig);
topRightConfig.title = "Robotics";
topRightConfig.titleSize = "1.2em";

const rightConfig = Object.create(minConfig);
rightConfig.title = "Headphones, No Headphones";
rightConfig.titleSize = "1em";

const bottomLeft = Object.create(minConfig);
bottomLeft.title = "Lists";
bottomLeft.titleSize = "1em";

pageConfig.config = {}; // Initialize pageConfig.config as an empty object
pageConfig.config.bottomRight = bottomRightConfig;
pageConfig.config.left = leftConfig;
pageConfig.config.topRight = topRightConfig;
pageConfig.config.right = rightConfig;
pageConfig.config.bottomLeft = bottomLeft;

const Misc: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Misc;
