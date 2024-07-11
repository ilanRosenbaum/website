import React from "react";
import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";
import { performTransitionAndRedirect } from "../../App";
import { appConfig as unitedStatesConfig } from "./UnitedStates";
import { appConfig as africaConfig } from "./Africa";
import { appConfig as mexicoConfig } from "./Mexico";
import { appConfig as europeConfig } from "./Europe";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  }
};

const appConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 3,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {},
  images: {},
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

appConfig.config.left = Object.create(mexicoConfig);
appConfig.config.left.title = "";

appConfig.config.bottomLeft = Object.create(africaConfig);
appConfig.config.bottomLeft.title = "";

appConfig.config.bottomRight = Object.create(europeConfig);
appConfig.config.bottomRight.title = "";

export { appConfig };

// The SierpinskiHexagon config to be used to generate the config for the Misc page
const pageConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 3,
    topRight: 3
  },
  styles: sharedConfig.styles,
  actions: {},
  images: {
    topLeft: "./assets/covers/planeVertical.jpg"
  },
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
  },
  left: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/mexico");
  },
  bottomLeft: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/africa");
  },
};

pageConfig.config = {}; // Initialize pageConfig.config as an empty object
pageConfig.config.left = mexicoConfig;
pageConfig.config.bottomLeft = africaConfig;
pageConfig.config.bottomRight = europeConfig;
pageConfig.config.right = unitedStatesConfig;

const Misc: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Misc;
