import React from "react";
import SierpinskiHexagon, { HexagonConfig, minConfig } from "../components/SierpinskiHexagon";
import { appConfig as ListConfig } from "./Lists";
import { performTransitionAndRedirect } from "../App";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {}
};

// The SierpinskiHexagon config to be used for the Misc sub hexagon on the home page
const appConfig: HexagonConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 2,
    bottomLeft: 2,
    left: 2,
    topLeft: 3,
    topRight: 2
  },
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/misc";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  }
};

const appBottomLeft = structuredClone(minConfig);
appBottomLeft.targetLevels = ListConfig.targetLevels;
appConfig.config = {};
appConfig.config.bottomLeft = appBottomLeft;
appConfig.targetLevels.bottomLeft = 0;

export { appConfig };

// The SierpinskiHexagon config to be used to generate the config for the Misc page
const pageConfig: HexagonConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 2,
    bottomLeft: 0,
    left: 2,
    topLeft: 3,
    topRight: 2
  },
  styles: sharedConfig.styles,
  actions: {
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    },
    topLeft: () => {
      window.location.href = "/misc/openSource";
    },
    right: () => {
      window.location.href = "/misc/headphonesNoHeadphones";
    },
    bottomLeft: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/lists");
    }
  },
  images: sharedConfig.images,
  text: {
    5: "Open Source"
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

const bottomRightConfig = structuredClone(minConfig);
bottomRightConfig.titleSize = "0.65vw";
bottomRightConfig.title = "This Website";

const leftConfig = structuredClone(minConfig);
leftConfig.titleSize = "0.9vw";
leftConfig.title = "Anti-Hate";

const topRightConfig = structuredClone(minConfig);
topRightConfig.title = "Robotics";
topRightConfig.titleSize = "1vw";

const rightConfig = structuredClone(minConfig);
rightConfig.title = "Headphones, No Headphones";
rightConfig.titleSize = "0.8vw";

const bottomLeft = structuredClone(minConfig);
bottomLeft.targetLevels = ListConfig.targetLevels;
bottomLeft.title = "Lists";
bottomLeft.titleSize = "1vw";

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
