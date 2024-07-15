import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";
import { appConfig as californiaConfig } from "./California";
import { performTransitionAndRedirect } from "../../App";

const sharedConfig: HexagonConfig = Object.create(minConfig);
sharedConfig.images = {
  bottomLeft: "/assets/covers/hawaiiVertical.jpg",
  right: "/assets/covers/chicagoVertical.jpg",
  topRight: "/assets/covers/minneapolisVertical.jpg",
  topLeft: "/assets/covers/charlotteVertical.jpg",
  left: "/assets/covers/madisonVertical.jpg"
};
const appConfig: HexagonConfig = Object.create(minConfig);
appConfig.title = "United States";
appConfig.imageId = "United States";
appConfig.titleSize = "0.75em";
appConfig.targetLevels = {
  right: 3,
  bottomRight: 0,
  bottomLeft: 3,
  left: 3,
  topLeft: 3,
  topRight: 3
};
appConfig.config = {};
appConfig.config.bottomRight = Object.create(californiaConfig);
appConfig.config.bottomRight.title = "";
const pageConfig: HexagonConfig = Object.create(appConfig);
pageConfig.backButton = {
  exists: true,
  to: "/photography"
};
appConfig.images = sharedConfig.images;

pageConfig.actions = {
  right: () => {
    window.location.href = "/photography/usa/illinois";
  },
  bottomRight: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/usa/california");
  },
  bottomLeft: () => {
    window.location.href = "/photography/usa/hawaii";
  },
  left: () => {
    window.location.href = "/photography/usa/wisconsin";
  },
  topLeft: () => {
    window.location.href = "/photography/usa/northCarolina";
  },
  topRight: () => {
    window.location.href = "/photography/usa/minnesota";
  }
};
pageConfig.titleSize = "2em";
pageConfig.text = {
  1: "Illinois",
  3: "Hawaii",
  4: "Wisconsin",
  5: "North Carolina",
  6: "Minnesota"
};
pageConfig.images = sharedConfig.images;

pageConfig.config = {};
pageConfig.config.bottomRight = Object.create(californiaConfig);
pageConfig.config.bottomRight.titleSize = "0.9em";

const UnitedStates: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default UnitedStates;
export { appConfig };
