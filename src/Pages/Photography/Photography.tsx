import React from "react";
import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";
import { performTransitionAndRedirect } from "../../App";
import { appConfig as unitedStatesConfig } from "./UnitedStates";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {}
};

const appConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 2,
    bottomLeft: 2,
    left: 2,
    topLeft: 3,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  }
};
appConfig.titleSize = "0.9em";
appConfig.title = "Photography";
appConfig.config = {};
appConfig.config.right = Object.create(unitedStatesConfig); // Don't want to modify the original config
appConfig.config.right.title = "";


export { appConfig };

// The SierpinskiHexagon config to be used to generate the config for the Misc page
const pageConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 2,
    bottomLeft: 2,
    left: 2,
    topLeft: 3,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {
  },
  images: sharedConfig.images,
  text: {
    5: "In Between",
    6: "Info"
  },
  title: "Photography",
  backButton: {
    exists: true,
    to: "/",
    textColor: "#4c0013"
  }
};

pageConfig.actions = {
  right: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/usa");
  },
  topRight: () => {
    window.location.href = "/photography/info";
  },
  topLeft: () => {
    window.location.href = "/photography/InBetween";
  }
};

const leftConfig = Object.create(minConfig);
leftConfig.titleSize = "1.5em";
leftConfig.title = "Mexico";

const bottomLeft = Object.create(minConfig);
bottomLeft.title = "Africa";
bottomLeft.titleSize = "1.5em";

const bottomRightConfig = Object.create(minConfig);
bottomRightConfig.titleSize = "1.5em";
bottomRightConfig.title = "Europe";

pageConfig.config = {}; // Initialize pageConfig.config as an empty object
pageConfig.config.left = leftConfig;
pageConfig.config.bottomLeft = bottomLeft;
pageConfig.config.bottomRight = bottomRightConfig;
pageConfig.config.right = unitedStatesConfig;

const Misc: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Misc;
