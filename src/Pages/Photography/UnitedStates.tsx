import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";
import { appConfig as californiaConfig } from "./California";
import { performTransitionAndRedirect } from "../../App";

const appConfig: HexagonConfig = Object.create(minConfig);
appConfig.title = "United States";
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
appConfig.config.bottomRight = californiaConfig;

const pageConfig: HexagonConfig = Object.create(appConfig);
pageConfig.backButton = {
  exists: true,
  to: "/photography",
};

pageConfig.actions = {
  default: (hexagonId: number) => {
    alert(`Hexagon ${hexagonId} clicked!`);
  },
  bottomLeft: (hexagonId: number) => {
  }
};
pageConfig.titleSize = "2em";

const UnitedStates: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default UnitedStates;
export { appConfig };
