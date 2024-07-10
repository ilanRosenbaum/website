import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";

const appConfig: HexagonConfig = Object.create(minConfig);
appConfig.targetLevels = {
  right: 0,
  bottomRight: 0,
  bottomLeft: 0,
  left: 3,
  topLeft: 0,
  topRight: 0
};
appConfig.title = "Africa";
appConfig.titleSize = "1.5em";

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
    left: "/assets/covers/moroccoVertical.jpg"
  },
  text: {
    4: "Morocco"
  },
  title: "Africa",
  titleSize: "2em",
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
