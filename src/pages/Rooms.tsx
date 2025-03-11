import React from "react";
import SierpinskiHexagon from "../components/SierpinskiHexagon";

const sharedConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 0,
    bottomLeft: 0,
    left: 3,
    topLeft: 3,
    topRight: 3
  },
  styles: {
    default: {
      fill: "#4c0013",
      opacity: 1.0
    }
  },
  images: {},
  textColor: "#F2EFDE",
  dropShadow: "#F2EFDE"
};

export const appConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/rooms";
    }
  },
  images: sharedConfig.images,
  text: {},
  textColor: sharedConfig.textColor,
  dropShadow: sharedConfig.dropShadow,
  backButton: {
    exists: false
  }
};

const pageConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    },
    left: () => {
      window.open(
        "https://innovate.wisc.edu/business-entrepreneurship-clinic-a-room-with-a-view-ilan-rosenbaums-app-helps-students-find-housing/",
        "_blank"
      );
    },
    topLeft: () => {
      window.location.href = "/rooms/what";
    },
    topRight: () => {
      window.location.href = "/rooms/why";
    },
    right: () => {
      window.location.href = "/rooms/how";
    }
  },
  images: sharedConfig.images,
  text: {
    1: "How",
    2: "",
    3: "",
    4: "Press",
    5: "What",
    6: "Why"
  },
  title: "roōms",
  titleSize: "5vw",
  textColor: sharedConfig.textColor,
  dropShadow: sharedConfig.dropShadow,
  backButton: {
    exists: true,
    to: "/",
    color: "#4c0013"
  }
};

const Rooms: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Rooms;
