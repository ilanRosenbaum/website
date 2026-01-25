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

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { Footer } from "../Constants";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Document, Page, pdfjs } from "react-pdf";

// Set up the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface BlogArticle {
  id: string;
  title: string;
  date: string;
  pdfPath: string;
}

// Blog articles configuration - add new articles here
// PDFs should be placed in public/content/blog/
const blogArticles: BlogArticle[] = [
  {
    id: "structured-notes",
    title: "Structured Notes, Assets, or whatever other marketing word bankers have come up with; Will I regret it?",
    date: "2026-01-16",
    pdfPath: "/content/blog/1.pdf"
  }
];

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const { articleId } = useParams<{ articleId?: string }>();
  const [homeContent, setHomeContent] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  useEffect(() => {
    // Fetch the blog home markdown content
    fetch("/content/BlogHome.md")
      .then((res) => res.text())
      .then((text) => setHomeContent(text))
      .catch(() => setHomeContent("# Welcome to the Blog\n\nSelect an article from the sidebar to begin reading."));
  }, []);

  // Measure container width for responsive PDF rendering
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Sort articles by date, newest first
  const sortedArticles = [...blogArticles].sort((a, b) => {
    const dateA = new Date(a.date + "T00:00:00").getTime();
    const dateB = new Date(b.date + "T00:00:00").getTime();
    return dateB - dateA;
  });

  const selectedArticle = articleId ? blogArticles.find((article) => article.id === articleId) : null;

  const handleArticleClick = (id: string) => {
    navigate(`/blog/${id}`);
  };

  const handleHomeClick = () => {
    navigate("/blog");
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen" style={{ backgroundColor: "#1e1e1e" }}>
      {/* Main content area - takes up all space except footer */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Panel */}
        <div className="w-[25%] sm:w-[15%] h-full border-r border-gray-700 flex flex-col overflow-hidden" style={{ backgroundColor: "#2d2d2d" }}>
        {/* Back Button */}
        <div className="p-4 flex justify-center">
          <BackButton to="/" color="#603b61" textColor="#ffefdb" />
        </div>

        {/* Home Link */}
        <div
          onClick={handleHomeClick}
          className="mx-4 my-2 py-3 cursor-pointer transition-colors font-mono text-lg text-gray-300 text-center rounded-lg hover:opacity-80"
          style={!articleId ? { backgroundColor: "#603b61" } : undefined}
        >
          Home
        </div>

        {/* Divider */}
        <div className="border-b border-gray-600 mx-4" />

        {/* Articles List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {sortedArticles.length === 0 ? (
            <div className="py-3 text-gray-500 text-sm font-mono italic">No articles yet...</div>
          ) : (
            sortedArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(article.id)}
                className="py-3 px-3 my-1 cursor-pointer transition-colors text-gray-300 hover:opacity-80 rounded-lg"
                style={articleId === article.id ? { backgroundColor: "#603b61" } : undefined}
              >
                <div className="text-xs text-gray-500 font-mono mb-1">{formatDate(article.date)}</div>
                <div className="text-sm font-mono leading-tight">{article.title}</div>
              </div>
            ))
          )}
        </div>
      </div>

        {/* Main Content Area */}
        <div ref={containerRef} className="flex-1 h-full overflow-y-auto overflow-x-hidden" style={{ backgroundColor: "#1e1e1e" }}>
        {selectedArticle ? (
          /* PDF Viewer using react-pdf */
          <Document
            file={selectedArticle.pdfPath}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
                <div className="flex items-center justify-center min-h-screen text-gray-400 font-mono" style={{ backgroundColor: "#1e1e1e" }}>
                Loading Too Many of Ilan's Words...
                </div>
            }
            error={
              <div className="flex items-center justify-center h-full text-gray-400 font-mono" style={{ backgroundColor: "#1e1e1e" }}>
                Failed to load. Try again. If that doesn't work clear your cookies + cache and try again. If that doesn't work then text me.
              </div>
            }
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={containerWidth > 0 ? containerWidth : undefined}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div style={{ backgroundColor: "#1e1e1e", width: containerWidth, height: containerWidth * 1.4 }} />}
                canvasBackground="#1e1e1e"
              />
            ))}
          </Document>
        ) : (
          /* Home/Intro Content */
          <div className="h-full overflow-y-auto">
            <div className="markdown-container p-8">
              <div className="markdown font-mono text-[#ffebcd]">
                <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                  {homeContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Footer area with fixed height */}
      <div className="h-8 flex-shrink-0 relative" style={{ backgroundColor: "#1e1e1e" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Blog;
