import React from "react";
import { useNavigate } from "react-router-dom";
import SierpinskiHexagon, { HexagonConfig } from "./SierpinskiHexagon";
import { loadSierpinskiPageConfig } from "../utils/sierpinskiConfig";

const SierpinskiPage: React.FC<{ pageId: string }> = ({ pageId }) => {
  const navigate = useNavigate();
  const [config, setConfig] = React.useState<HexagonConfig | null>(null);

  React.useEffect(() => {
    let canceled = false;

    loadSierpinskiPageConfig(pageId, navigate)
      .then((loadedConfig) => {
        if (!canceled) {
          setConfig(loadedConfig);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      canceled = true;
    };
  }, [pageId, navigate]);

  if (!config) {
    return <div className="h-screen w-screen bg-black/90 fixed overflow-hidden" />;
  }

  return <SierpinskiHexagon config={config} />;
};

export default SierpinskiPage;
