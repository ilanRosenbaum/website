import SierpinskiHexagon, { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";

const appConfig: HexagonConfig = Object.create(minConfig);
appConfig.targetLevels = {
  right: 0,
  bottomRight: 3,
  bottomLeft: 3,
  left: 3,
  topLeft: 3,
  topRight: 3
};
appConfig.title = "California";

export { appConfig };

const pageConfig = Object.create(appConfig);
pageConfig.backButton = {
  exists: true,
  to: "/photography/unitedStates"
};

pageConfig.actions = {
  left: () => {
    window.location.href = "/photography/usa/california/bayArea";
  },
  bottomLeft: () => {
    window.location.href = "/photography/usa/california/sacramento";
  },
  topRight: () => {
    window.location.href = "/photography/usa/california/tahoe";
  },
  topLeft: () => {
    window.location.href = "/photography/usa/california/yosemite";
  },
  bottomRight: () => {
    window.location.href = "/photography/usa/california/sequoia";
  }
};

pageConfig.images = {
  topLeft: "/assets/covers/yosemiteVertical.jpg",
  topRight: "/assets/covers/tahoeVertical.jpg",
  left: "/assets/covers/bayAreaVertical.jpg",
  bottomLeft: "/assets/covers/sacramentoVertical.jpg",
  bottomRight: "/assets/covers/sequoiaVertical.jpg"
}

pageConfig.text = {
  2: "Sequoia",
  3: "Sacramento",
  4: "Bay Area",
  5: "Yosemite",
  6: "Tahoe"
};

pageConfig.backButton = {
  exists: true,
  to: "/photography/usa"
};

const California: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default California;
