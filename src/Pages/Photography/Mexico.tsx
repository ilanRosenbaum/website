import { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";

const appConfig: HexagonConfig = Object.create(minConfig);
appConfig.targetLevels = {
  right: 0,
  bottomRight: 0,
  bottomLeft: 0,
  left: 0,
  topLeft: 3,
  topRight: 0
};
appConfig.titleSize = "1.5em";
appConfig.title = "Mexico";

export { appConfig };

