import React from "react";
import SierpinskiHexagon, {
  HexagonConfig,
  minConfig
} from "../../components/SierpinskiHexagon";
import { performTransitionAndRedirect } from "../../App";
import { appConfig as WebsiteConfig } from "./ThisWebsite";
import { appConfig as PlacesConfig } from "./Places";

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
    bottomRight: 0,
    bottomLeft: 3,
    left: 0,
    topLeft: 3,
    topRight: 3
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
  },
  config: {
    bottomRight: structuredClone(minConfig),
    left: structuredClone(minConfig),
    bottomLeft: structuredClone(minConfig)
  }
};

// If statement exists so TS doesn't get mad. Literally should never matter.
if (appConfig.config !== undefined) {
  appConfig.config.bottomRight.targetLevels = WebsiteConfig.targetLevels;
  appConfig.config.left.targetLevels = PlacesConfig.targetLevels;
}

export { appConfig };

// The SierpinskiHexagon config to be used to generate the config for the Misc page
const pageConfig: HexagonConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 0,
    bottomLeft: 3,
    left: 0,
    topLeft: 3,
    topRight: 3
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
    left: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/misc/places");
    },
    bottomLeft: () => {
      window.location.href = "/misc/restaurants";
    },
    bottomRight: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/misc/thisWebsite");
    },
    topRight: () => {
      window.location.href = "/misc/books";
    }
  },
  images: sharedConfig.images,
  text: {
    3: "Restaurants",
    5: "Open Source",
    6: "Books"
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
bottomRightConfig.targetLevels = WebsiteConfig.targetLevels;
bottomRightConfig.titleSize = "0.65vw";
bottomRightConfig.title = "This Website";

const leftConfig = structuredClone(minConfig);
leftConfig.targetLevels = PlacesConfig.targetLevels;
leftConfig.titleSize = "0.9vw";
leftConfig.title = "Places";

const rightConfig = structuredClone(minConfig);
rightConfig.title = "Headphones, No Headphones";
rightConfig.titleSize = "0.8vw";

pageConfig.config = {}; // Initialize pageConfig.config as an empty object
pageConfig.config.bottomRight = bottomRightConfig;
pageConfig.config.left = leftConfig;
pageConfig.config.right = rightConfig;

const Misc: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Misc;
