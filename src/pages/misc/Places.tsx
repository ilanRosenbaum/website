import React from "react";
import SierpinskiHexagon from "../../components/SierpinskiHexagon";

const sharedConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 0,
    left: 3,
    topLeft: 3,
    topRight: 0
  },
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {},
};

// The SierpinskiHexagon config to be used for the Rooms sub hexagon on the home page
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
  backButton: {
    exists: false
  }
};

// The SierpinskiHexagon config to be used for the Rooms page
const pageConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    },
    left: () => {
      window.location.href = "/misc/places/visited"; // TODO: Make the MD page for this
    },
    topLeft: () => {
      window.location.href = "/misc/places/toVisit"; // TODO: Make the MD page for this
    },
    bottomRight: () => {
      window.location.href = "/misc/places/toLive"; // TODO: Make the MD page for this
    },
    right: () => {
      window.location.href = "/misc/places/lived"; // TODO: Make the MD page for this
    },
  },
  images: sharedConfig.images,
  text: {
    1: "Lived",
    2: "To Live",
    3: "",
    4: "Visited",
    5: "To Visit",
    6: ""
  },
  title: "Places",
  titleSize: "4vw",
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
