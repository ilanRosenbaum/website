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

import React from "react";

interface BackButtonProps {
  to: string;
  color: string;
  textColor: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, color, textColor }) => {
  const handleClick = () => {
    window.location.href = to;
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer"
      style={{
        width: "max(8vw, 8vh)",
        height: "max(8vw, 8vh)",
        backgroundColor: color,
        clipPath:
          "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
        border: "0.4px solid black"
      }}
    >
      <p
        className="absolute inset-0 flex items-center justify-center"
        style={{
          color: textColor || "#ffefdb",
          fontFamily: "Courier new, monospace",
          fontSize: "max(1vw, 1vh)",
          fontWeight: "500",
          textShadow: "0 0 0.1em rgba(0, 0, 0, 1)"
        }}
      >
        Back
      </p>
    </div>
  );
};

export default BackButton;
