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

import React, { useEffect, useState } from "react";

const FAST_MODE_KEY = "fastMode";

export const getFastMode = (): boolean => {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(FAST_MODE_KEY);
  return stored === "true";
};

export const setFastMode = (enabled: boolean): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAST_MODE_KEY, enabled.toString());
  window.dispatchEvent(new CustomEvent("fastModeChange", { detail: enabled }));
};

const FastModeToggle: React.FC = () => {
  const [fastMode, setFastModeState] = useState(getFastMode());

  useEffect(() => {
    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setFastModeState(customEvent.detail);
    };
    window.addEventListener("fastModeChange", handleChange);
    return () => window.removeEventListener("fastModeChange", handleChange);
  }, []);

  const toggleFastMode = () => {
    const newValue = !fastMode;
    setFastMode(newValue);
    setFastModeState(newValue);
  };

  return (
    <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
      <label className="text-xs text-white opacity-70 select-none cursor-pointer flex items-center gap-2">
        <span>Fast Mode</span>
        <div
          onClick={toggleFastMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            fastMode ? "bg-[#603b61]" : "bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              fastMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </div>
      </label>
    </div>
  );
};

export default FastModeToggle;
