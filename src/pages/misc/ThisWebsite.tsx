import React from "react";
import SierpinskiHexagon from "../../components/SierpinskiHexagon";

const sharedConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 3,
    topRight: 3
  },
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {},
};

export const appConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/misc/thisWebsite";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  }
};

const pageConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    topLeft: () => {
      window.location.href = "/misc/thisWebsite/what";
    },
    topRight: () => {
      window.location.href = "/misc/thisWebsite/why";
    },
    right: () => {
      window.location.href = "/misc/thisWebsite/how";
    },
  },
  images: sharedConfig.images,
  text: {
    1: "How",
    2: "",
    3: "",
    4: "",
    5: "What",
    6: "Why"
  },
  title: "This Website",
  titleSize: "2vw",
  backButton: {
    exists: true,
    to: "/misc",
    fill: "#603b61",
  }
};

const Rooms: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Rooms;
