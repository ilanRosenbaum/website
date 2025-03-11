import SierpinskiHexagon, {
  HexagonConfig,
  minConfig
} from "../../components/SierpinskiHexagon";
import { appConfig as californiaConfig } from "./California";
import { appConfig as midwestConfig } from "./Midwest";
import { performTransitionAndRedirect } from "../../App";

const sharedConfig: HexagonConfig = structuredClone(minConfig);
sharedConfig.images = {
  bottomLeft: "/Covers/hawaiiVertical.jpg",
  topLeft: "/Covers/charlotteVertical.jpg",
  left: "/Covers/sedonaVertical.jpeg"
};
const appConfig: HexagonConfig = structuredClone(minConfig);
appConfig.title = "United States";
appConfig.imageId = "United States";
appConfig.titleSize = "max(0.5vw, 0.5vh)";
appConfig.targetLevels = {
  right: 0,
  bottomRight: 0,
  bottomLeft: 3,
  left: 3,
  topLeft: 3,
  topRight: 0
};
appConfig.config = {};
appConfig.config.bottomRight = structuredClone(californiaConfig);
appConfig.config.bottomRight.title = "";
appConfig.config.right = structuredClone(midwestConfig);
appConfig.config.right.title = "";
const pageConfig: HexagonConfig = structuredClone(appConfig);
pageConfig.backButton = {
  exists: true,
  to: "/photography"
};
appConfig.images = sharedConfig.images;

pageConfig.actions = {
  right: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/usa/midwest");
  },
  bottomRight: (hexagonId: number) => {
    performTransitionAndRedirect(hexagonId, "/photography/usa/california");
  },
  bottomLeft: () => {
    window.location.href = "/photography/usa/hawaii";
  },
  left: () => {
    window.location.href = "/photography/usa/arizona";
  },
  topLeft: () => {
    window.location.href = "/photography/usa/northCarolina";
  }
};
pageConfig.titleSize = "2vw";
pageConfig.text = {
  3: "Hawaii",
  5: "North Carolina",
  4: "Sedona"
};
pageConfig.images = sharedConfig.images;

pageConfig.config = {};
pageConfig.config.bottomRight = structuredClone(californiaConfig);
pageConfig.config.bottomRight.titleSize = "max(0.8vw, 0.7vh)";
pageConfig.config.right = structuredClone(midwestConfig);
pageConfig.config.right.titleSize = "max(0.9vw, 0.8vh)";

const UnitedStates: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default UnitedStates;
export { appConfig };
