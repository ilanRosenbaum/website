/*
Ilan's Website
Copyright (C) 2024-2025 ILAN ROSENBAUM

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import BackButton from "../../../../components/BackButton";
import ToLiveRaw from "./ToLiveRaw";

const ToLive = () => {
  return (
    <div className="h-screen w-screen bg-black/90 text-white overflow-hidden p-4">
      <div className="absolute top-8 left-8 z-10">
        <BackButton
          textColor={"#ffefdb"}
          color={"#603b61"}
          to={"/misc/places"}
        />
      </div>
      <ToLiveRaw />
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">
        Copyright © 2024-2025 Ilan Rosenbaum. All rights reserved.
      </div>
    </div>
  );
};

export default ToLive;
