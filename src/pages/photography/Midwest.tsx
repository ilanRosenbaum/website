import SierpinskiHexagon, {
  HexagonConfig,
  minConfig
} from "../../components/SierpinskiHexagon";

const appConfig: HexagonConfig = structuredClone(minConfig);
appConfig.targetLevels = {
  right: 3,
  bottomRight: 3,
  bottomLeft: 0,
  left: 0,
  topLeft: 0,
  topRight: 3
};
appConfig.title = "Midwest";

appConfig.images = {
  topRight: "/Covers/chicagoVertical.jpg",
  right: "/Covers/madisonVertical.jpg",
  bottomRight: "/Covers/minneapolisVertical.jpg"
};
appConfig.imageId = "Midwest";

export { appConfig };

const pageConfig = structuredClone(appConfig);

pageConfig.actions = {
  right: () => {
    window.location.href = "/photography/usa/midwest/wisconsin";
  },
  bottomRight: () => {
    window.location.href = "/photography/usa/midwest/minnesota";
  },
  topRight: () => {
    window.location.href = "/photography/usa/midwest/illinois";
  }
};

pageConfig.backButton = {
  exists: true,
  to: "/photography/usa"
};

pageConfig.text = {
  1: "Wisconsin",
  2: "Minnesota",
  6: "Illinois"
};

const Midwest: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Midwest;
