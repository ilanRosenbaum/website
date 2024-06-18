import React from "react";
import SierpinskiHexagon from "./../components/SierpinskiHexagon";

const hexagonConfig = {
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
  actions: {
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    }
  },
  images: {},
  text: {
    1: "How",
    2: "",
    3: "",
    4: "Press",
    5: "What",
    6: "Why"
  },
  title: "roōms",
  textColor: "#F2EFDE",
  dropShadow: "#F2EFDE",
  backButton: {
    exists: true,
    to: "/",
    color: "#4c0013"
  }
};

const Rooms: React.FC = () => {
  return <SierpinskiHexagon config={hexagonConfig} />;
};

export default Rooms;
