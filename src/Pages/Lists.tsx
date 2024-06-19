import React from "react";
import SierpinskiHexagon, { HexagonConfig, minConfig } from "./../components/SierpinskiHexagon";

const sharedConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 2,
    left: 3,
    topLeft: 0,
    topRight: 0
  }
};

// The SierpinskiHexagon config to be used for the Lists sub hexagon on the home page
const appConfig: HexagonConfig = Object.create(minConfig);
appConfig.targetLevels = sharedConfig.targetLevels;
export { appConfig };

// The SierpinskiHexagon config to be used to generate the config for the Lists page
let pageConfig: HexagonConfig = Object.create(minConfig);
pageConfig.targetLevels = sharedConfig.targetLevels;
pageConfig.backButton = {
  exists: true,
  to: "/",
  textColor: "#4c0013"
};
pageConfig.text = {
  1: "Restaurants",
  2: "Places",
  4: "Books"
};

const bottomLeft = Object.create(minConfig);
bottomLeft.title = "Recipes";
bottomLeft.titleSize = "1.5em";

pageConfig.config = {}; // Initialize pageConfig.config as an empty object
pageConfig.config.bottomLeft = bottomLeft;

const Lists: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Lists;
