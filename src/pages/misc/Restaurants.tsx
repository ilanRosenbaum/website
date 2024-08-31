import React from "react";
import SierpinskiHexagon from "../../components/SierpinskiHexagon";

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
      window.location.href = "/misc";
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
      window.open("https://innovate.wisc.edu/business-entrepreneurship-clinic-a-room-with-a-view-ilan-rosenbaums-app-helps-students-find-housing/", "_blank");
    },
    topLeft: () => {
      window.location.href = "/rooms/what";
    },
    topRight: () => {
      window.location.href = "/rooms/why";
    },
    right: () => {
      window.location.href = "/rooms/how";
    },
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
  title: "Restaurants",
  titleSize: "5vw",
  backButton: {
    exists: true,
    to: "/misc",
    fill: "#603b61",
  }
};

const Restaurants: React.FC = () => {
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Restaurants;
