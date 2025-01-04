import React from "react";
import BackButton from "../../../components/BackButton";
import ToLiveRaw from "./ToLiveRaw";



const ToLive = () => {
  return (
    <div className="h-screen w-screen bg-black/90 text-white overflow-hidden p-4">
      <div className="absolute top-8 left-8 z-10">
        <BackButton textColor={"#ffefdb"} color={"#603b61"} to={"/misc/places"} />
      </div>
        <ToLiveRaw />
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">Copyright © 2024-2025 Ilan Rosenbaum. All rights reserved.</div>
    </div>
  );
};

export default ToLive;
