/*
Ilan's Website
Copyright (C) 2024-2026 ILAN ROSENBAUM

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import SierpinskiHexagon, { HexagonConfig } from "../components/SierpinskiHexagon";
import { performTransitionAndRedirect } from "../App";
import { appConfig as AggregatorsConfig } from "./links/Aggregators";
import { appConfig as JournalismConfig } from "./links/Journalism";
import { appConfig as CoolConfig } from "./links/Cool";
import { COLORS } from "../Constants";

const titleLessAggregatorsConfig = { ...AggregatorsConfig, title: "" };
const titleLessJournalismConfig = { ...JournalismConfig, title: "" };
const titleLessCoolConfig = { ...CoolConfig, title: "" };

const sharedConfig = {
  styles: {
    default: {
      fill: COLORS.BACK_BUTTON_PURPLE,
      opacity: 0.6
    }
  },
  images: {},
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 0,
    topRight: 0
  }
};

const appConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/links";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  },
  config: {
    right: titleLessAggregatorsConfig,
    bottomRight: titleLessJournalismConfig,
    left: titleLessCoolConfig
  }
};
appConfig.title = "Links";

export { appConfig };

const pageConfig: HexagonConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {},
  title: "Links",
  backButton: {
    exists: true,
    to: "/",
    textColor: COLORS.DARK_MAROON
  },
  config: {
    right: AggregatorsConfig,
    bottomRight: JournalismConfig,
    left: CoolConfig
  },
  confusedButton: {
    link: "https://thoughts.melonking.net/thoughts/every-site-needs-a-links-page-why-linking-matters"
  }
};

const Links: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    right: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/links/aggregators", navigate);
    },
    bottomRight: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/links/journalism", navigate);
    },
    left: (hexagonId: number) => {
      performTransitionAndRedirect(hexagonId, "/links/coolWebsites", navigate);
    }
  };

  return <SierpinskiHexagon config={pageConfig} />;
};

export default Links;
