import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";

const appConfig: HexagonConfig = structuredClone(minConfig);
appConfig.targetLevels = {
  right: 3,
  bottomRight: 0,
  bottomLeft: 3,
  left: 3,
  topLeft: 3,
  topRight: 0
};
appConfig.titleSize = "max(1.2vw, 1.2vh)";
appConfig.title = "Europe";
appConfig.imageId = "Europe";
appConfig.images = {
  left: "/Covers/amsterdamVertical.jpg",
  bottomLeft: "/Covers/lyonVertical.jpg",
  topLeft: "/Covers/gironaVertical.jpg",
  right: "/Covers/copenhagenVertical.jpg"
}

export { appConfig };

const pageConfig = structuredClone(appConfig);
pageConfig.backButton = {
  exists: true,
  to: "/photography"
};

pageConfig.actions = {
  left: () => {
    window.location.href = "/photography/europe/netherlands";
  },
  bottomLeft: () => {
    window.location.href = "/photography/europe/france";
  },
  topLeft: () => {
    window.location.href = "/photography/europe/spain";
  },
  right: () => {
    window.location.href = "/photography/europe/denmark";
  }
};

pageConfig.images = {
  left: "/Covers/amsterdamVertical.jpg",
  bottomLeft: "/Covers/lyonVertical.jpg",
  topLeft: "/Covers/gironaVertical.jpg",
  right: "/Covers/copenhagenVertical.jpg"
}

pageConfig.text = {
  1: "Denmark",
  3: "France",
  4: "Netherlands",
  5: "Spain",
};

pageConfig.backButton = {
  exists: true,
  to: "/photography"
};

const California: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default California;
