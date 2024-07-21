import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";

const appConfig: HexagonConfig = structuredClone(minConfig);
appConfig.targetLevels = {
  right: 0,
  bottomRight: 0,
  bottomLeft: 0,
  left: 3,
  topLeft: 0,
  topRight: 0
};
appConfig.title = "Mexico";
appConfig.imageId = "Mexico";
appConfig.titleSize = "1.5vw";
appConfig.images = {
  left: "/Covers/PuertoVallartaVertical.jpg"
};

const pageConfig: HexagonConfig = {
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  actions: {
    left: () => {
      window.location.href = "/photography/Mexico/PuertoVallarta";
    }
  },
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 0,
    left: 3,
    topLeft: 0,
    topRight: 0
  },
  images: {
    left: "/Covers/PuertoVallartaVertical.jpg"
  },
  text: {
    4: "Puerto Vallarta"
  },
  title: "Mexico",
  titleSize: "2vw",
  backButton: {
    exists: true,
    to: "/photography"
  }
};

const Mexico: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Mexico;

export { appConfig };
