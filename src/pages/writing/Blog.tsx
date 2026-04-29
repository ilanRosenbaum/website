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
import WritingSidebarPage, { WritingItem } from "../../components/WritingSidebarPage";

// Blog articles configuration - add new articles here
// HTML files should be placed in public/content/blog/
const blogArticles: WritingItem[] = [
  {
    id: "structured-notes",
    title: "Structured Notes, Assets, or whatever other marketing word bankers have come up with; Will I regret it?",
    date: "2026-01-16",
    pdfPath: "/content/blog/1.pdf"
  },
  {
    id: "ai-inequality-and-us",
    title: "AI, Inequality, and Us",
    date: "2026-04-27",
    htmlPath: "/content/blog/AIInequalityAndUs.html"
  }
];

const Blog: React.FC = () => {
  const { articleId } = useParams<{ articleId?: string }>();

  return (
    <WritingSidebarPage
      items={blogArticles}
      selectedId={articleId}
      basePath="/writing/blog"
      backTo="/writing"
      homeContentUrl="/content/BlogHome.md"
      homeContentFallback="# Welcome to the Blog\n\nSelect an article from the sidebar to begin reading."
      loadingText="Loading Too Many of Ilan's Words..."
      emptyText="No articles yet..."
    />
  );
};

export default Blog;
