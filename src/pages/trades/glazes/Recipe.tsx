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
import { useParams } from "react-router-dom";
import MarkdownPage from "../../../components/MarkdownPage";

/**
 * Renders a single glaze recipe by loading
 * /content/glazes/<glazeId>.md from the public directory.
 * The glazeId URL param may be percent-encoded (e.g. "Matte%20Black").
 */
const GlazeRecipe: React.FC = () => {
  const { glazeId } = useParams<{ glazeId: string }>();
  const decoded = decodeURIComponent(glazeId ?? "");
  const source = `/content/glazes/${decoded}.md`;

  return (
    <MarkdownPage
      source={source}
      backTo="/trades/ceramics/glazes"
    />
  );
};

export default GlazeRecipe;
