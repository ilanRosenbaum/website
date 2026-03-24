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

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { Footer } from "../Constants";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Document, Page, pdfjs } from "react-pdf";

// Set up the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface PDFItem {
  id: string;
  title: string;
  date: string;
  pdfPath: string;
  bgColor?: string;
  pageBreaks?: boolean;
}

interface PDFSidebarPageProps {
  items: PDFItem[];
  selectedId?: string;
  basePath: string;
  backTo: string;
  homeContentUrl: string;
  homeContentFallback: string;
  loadingText?: string;
  emptyText?: string;
}

const PDFSidebarPage: React.FC<PDFSidebarPageProps> = ({
  items,
  selectedId,
  basePath,
  backTo,
  homeContentUrl,
  homeContentFallback,
  loadingText = "Loading...",
  emptyText = "No items yet...",
}) => {
  const navigate = useNavigate();
  const [homeContent, setHomeContent] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [mobilePdfStatus, setMobilePdfStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectedItem = selectedId ? items.find((item) => item.id === selectedId) : null;
  const pdfBg = selectedItem?.bgColor ?? "#1e1e1e";
  const pageBreaks = selectedItem?.pageBreaks ?? false;
  const containerBg = pageBreaks ? "#1e1e1e" : pdfBg;

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  useEffect(() => {
    fetch(homeContentUrl)
      .then((res) => res.text())
      .then((text) => setHomeContent(text))
      .catch(() => setHomeContent(homeContentFallback));
  }, [homeContentUrl, homeContentFallback]);

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

  useEffect(() => {
    const detectMobile = () => {
      const ua = window.navigator.userAgent;
      const isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      setIsMobileView(window.innerWidth <= 820 || isTouchDevice);
    };

    detectMobile();
    window.addEventListener("resize", detectMobile);
    return () => window.removeEventListener("resize", detectMobile);
  }, []);

  useEffect(() => {
    if (selectedItem && isMobileView) {
      setMobilePdfStatus("loading");
    } else {
      setMobilePdfStatus("idle");
    }
  }, [selectedItem, isMobileView]);

  // Reset page count when the selected item changes
  useEffect(() => {
    setNumPages(0);
  }, [selectedId]);

  const pdfUrl = useMemo(() => {
    if (!selectedItem) {
      return "";
    }
    if (/^https?:\/\//i.test(selectedItem.pdfPath)) {
      return selectedItem.pdfPath;
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}${selectedItem.pdfPath}`;
    }
    return selectedItem.pdfPath;
  }, [selectedItem]);

  // Sort items by date, newest first
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.date + "T00:00:00").getTime();
    const dateB = new Date(b.date + "T00:00:00").getTime();
    return dateB - dateA;
  });

  const handleItemClick = (id: string) => {
    navigate(`${basePath}/${id}`);
  };

  const handleHomeClick = () => {
    navigate(basePath);
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
            <BackButton to={backTo} color="#603b61" textColor="#ffefdb" />
          </div>

          {/* Home Link */}
          <div
            onClick={handleHomeClick}
            className="mx-4 my-2 py-3 cursor-pointer transition-colors font-mono text-lg text-gray-300 text-center rounded-lg hover:opacity-80"
            style={!selectedId ? { backgroundColor: "#603b61" } : undefined}
          >
            Home
          </div>

          {/* Divider */}
          <div className="border-b border-gray-600 mx-4" />

          {/* Items List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2">
            {sortedItems.length === 0 ? (
              <div className="py-3 text-gray-500 text-[10px] sm:text-sm font-mono italic">{emptyText}</div>
            ) : (
              sortedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="py-2 sm:py-3 px-2 sm:px-3 my-1 cursor-pointer transition-colors text-gray-300 hover:opacity-80 rounded-lg overflow-hidden"
                  style={selectedId === item.id ? { backgroundColor: "#603b61" } : undefined}
                >
                  <div className="text-[8px] sm:text-xs text-gray-500 font-mono mb-1">{formatDate(item.date)}</div>
                  <div className="text-[10px] sm:text-sm font-mono leading-tight break-words">{item.title}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div ref={containerRef} className="flex-1 h-full overflow-y-auto overflow-x-hidden pb-16" style={{ backgroundColor: containerBg }}>
          {selectedItem ? (
            isMobileView ? (
              <div className="h-full flex flex-col" style={{ backgroundColor: containerBg }}>
                <iframe
                  title={selectedItem.title}
                  src={pdfUrl}
                  className="flex-1 w-full"
                  style={{ border: "none", minHeight: "100%" }}
                  onLoad={() => setMobilePdfStatus("loaded")}
                  onError={() => setMobilePdfStatus("error")}
                />
                {mobilePdfStatus === "error" && (
                  <div className="p-4 text-center text-gray-400 font-mono text-xs">
                    Trouble loading?{" "}
                    <a className="underline" href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      Open the PDF in a new tab
                    </a>
                    .
                  </div>
                )}
              </div>
            ) : (
              /* PDF Viewer using react-pdf */
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center min-h-screen text-gray-400 font-mono" style={{ backgroundColor: pdfBg }}>
                    {loadingText}
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-full text-gray-400 font-mono" style={{ backgroundColor: pdfBg }}>
                    Failed to load. Try again. If that doesn't work clear your cookies + cache and try again. If that doesn't work then text me.
                  </div>
                }
              >
                {Array.from(new Array(numPages), (_, index) => (
                  pageBreaks ? (
                    <div key={`break_${index + 1}`} style={{ backgroundColor: "#1e1e1e", padding: "10px 0" }}>
                      <Page
                        pageNumber={index + 1}
                        width={containerWidth > 0 ? containerWidth : undefined}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        loading={<div style={{ backgroundColor: pdfBg, width: containerWidth, height: containerWidth * 1.4 }} />}
                        canvasBackground={pdfBg}
                      />
                    </div>
                  ) : (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={containerWidth > 0 ? containerWidth : undefined}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={<div style={{ backgroundColor: pdfBg, width: containerWidth, height: containerWidth * 1.4 }} />}
                      canvasBackground={pdfBg}
                    />
                  )
                ))}
              </Document>
            )
          ) : (
            /* Home/Intro Content */
            <div className="h-full overflow-y-auto pb-16">
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

export default PDFSidebarPage;
