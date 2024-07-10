import { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";

const appConfig: HexagonConfig = Object.create(minConfig);
appConfig.targetLevels = {
  right: 3,
  bottomRight: 0,
  bottomLeft: 3,
  left: 3,
  topLeft: 3,
  topRight: 0
};
appConfig.titleSize = "1.5em";
appConfig.title = "Europe";

export { appConfig };

