import React from "react";
import SierpinskiHexagon, { HexagonConfig } from "../../components/SierpinskiHexagon";
import { performTransitionAndRedirect } from "../../App";
import { appConfig as unitedStatesConfig } from "./UnitedStates";
import { appConfig as africaConfig } from "./Africa";
import { appConfig as mexicoConfig } from "./Mexico";
import { appConfig as europeConfig } from "./Europe";

const africaAppConfig = Object.create(africaConfig);
africaAppConfig.title = "";
const mexicoAppConfig = Object.create(mexicoConfig);
mexicoAppConfig.title = "";
const europeAppConfig = Object.create(europeConfig);
europeAppConfig.title = "";

const unitedStatesAppConfig = Object.create(unitedStatesConfig);
unitedStatesAppConfig.title = "";

const sharedConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {
    topLeft: "./assets/covers/planeVertical.jpg"
  },
  config: {
    left: mexicoAppConfig,
    bottomLeft: africaAppConfig,
    bottomRight: europeAppConfig,
    right: unitedStatesAppConfig
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
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: sharedConfig.config
};
appConfig.titleSize = "0.9em";
appConfig.title = "Photography";

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
  },
  config: sharedConfig.config
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
  bottomRight: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/europe");
  }
};

const Photography: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Photography;
