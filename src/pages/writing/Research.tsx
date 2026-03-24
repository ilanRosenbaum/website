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
import PDFSidebarPage, { PDFItem } from "../../components/PDFSidebarPage";

// Research papers configuration - add new papers here
// PDFs should be placed in public/content/research/
const researchPapers: PDFItem[] = [
  {
    id: "ai-alignment-intractability",
    title: "AI Alignment Intractability",
    date: "2026-03-24",
    pdfPath: "/content/research/AI_Alignment_Intractability.pdf",
    bgColor: "#F2EFDE",
    pageBreaks: true
  },
  {
    id: "headphones-no-headphones",
    title: "Headphones, No Headphones",
    date: "2025-01-01",
    pdfPath: "/content/research/Headphones_No_Headphones.pdf",
    bgColor: "#F2EFDE",
    pageBreaks: true
  }
];

const Research: React.FC = () => {
  const { paperId } = useParams<{ paperId?: string }>();

  return (
    <PDFSidebarPage
      items={researchPapers}
      selectedId={paperId}
      basePath="/writing/research"
      backTo="/writing"
      homeContentUrl="/content/ResearchHome.md"
      homeContentFallback="# Research\n\nSelect a paper from the sidebar to begin reading."
      loadingText="Loading..."
      emptyText="No papers yet..."
    />
  );
};

export default Research;
