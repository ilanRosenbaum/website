import React from "react";
import SierpinskiHexagon, { HexagonConfig, minConfig } from "./../components/SierpinskiHexagon";

const sharedConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 3,
    left: 3,
    topLeft: 3,
    topRight: 3
  }
};

// The SierpinskiHexagon config to be used for the Lists sub hexagon on the home page
const appConfig: HexagonConfig = Object.create(minConfig);
export { appConfig };

// The SierpinskiHexagon config to be used to generate the config for the Lists page
let pageConfig: HexagonConfig = Object.create(minConfig);
pageConfig.targetLevels = sharedConfig.targetLevels;
pageConfig.backButton = {
  exists: true,
  to: "/",
  textColor: "#4c0013"
}
pageConfig.text = {
  1: "Restaurants",
  2: "Places",
  3: "Recipes",
  4: "Books",
  5: "Shopping",
  6: "Gift"
};

const Lists: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Lists;
