import { HexagonConfig, minConfig } from "../../components/SierpinskiHexagon";

const appConfig: HexagonConfig = Object.create(minConfig);
appConfig.targetLevels = {
  right: 0,
  bottomRight: 3,
  bottomLeft: 3,
  left: 3,
  topLeft: 3,
  topRight: 3
};

export { appConfig };

