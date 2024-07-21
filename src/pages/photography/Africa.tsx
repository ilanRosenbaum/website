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
appConfig.title = "Africa";
appConfig.imageId = "Africa";
appConfig.titleSize = "max(1.2vw, 1.2vh)";
appConfig.images = {
  left: "/Covers/moroccoVertical.jpg"
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
      window.location.href = "/photography/africa/morocco";
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
    left: "/Covers/moroccoVertical.jpg"
  },
  text: {
    4: "Morocco"
  },
  title: "Africa",
  titleSize: "2vw",
  backButton: {
    exists: true,
    to: "/photography"
  }
};

const Africa: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Africa;

export { appConfig };
