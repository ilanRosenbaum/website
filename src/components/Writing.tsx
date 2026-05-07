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

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { COLORS, Footer } from "../Constants";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Document, Page, pdfjs } from "react-pdf";
import NewsletterSubscription from "./NewsletterSubscription";

// Set up the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface WritingItem {
  id: string;
  title: string;
  date: string;
  pdfPath?: string;
  htmlPath?: string;
  bgColor?: string;
  pageBreaks?: boolean;
}

/** @deprecated Use WritingItem instead */
export type PDFItem = WritingItem;

interface WritingSidebarPageProps {
  items: WritingItem[];
  selectedId?: string;
  basePath: string;
  backTo: string;
  homeContentUrl: string;
  homeContentFallback: string;
  loadingText?: string;
  emptyText?: string;
}

const WritingSidebarPage: React.FC<WritingSidebarPageProps> = ({
  items,
  selectedId,
  basePath,
  backTo,
  homeContentUrl,
  homeContentFallback,
  loadingText = "Loading Too Many of Ilan's Words...",
  emptyText = "No items yet...",
}) => {
  const navigate = useNavigate();
  const [homeContent, setHomeContent] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isMobileView, setIsMobileView] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent;
    const isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return window.innerWidth <= 820 || isTouchDevice;
  });
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    const cookie = document.cookie.split(";").find(c => c.trim().startsWith("newsletter_preferences="));
    if (!cookie) return false;
    try {
      const val = JSON.parse(decodeURIComponent(cookie.trim().split("=").slice(1).join("=")));
      return !!(val?.email && (val?.blog || val?.research));
    } catch { return false; }
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const selectedItem = selectedId ? items.find((item) => item.id === selectedId) : null;
  const isHtmlContent = selectedItem?.htmlPath != null;
  const pdfBg = selectedItem?.bgColor ?? COLORS.SURFACE_DARK;
  const pageBreaks = selectedItem?.pageBreaks ?? false;
  const containerBg = isHtmlContent ? COLORS.SURFACE_DARK : (pageBreaks ? COLORS.SURFACE_DARK : pdfBg);
  const currentTopic = useMemo<"blog" | "research" | null>(() => {
    const lowerPath = basePath.toLowerCase();
    if (lowerPath.includes("blog")) {
      return "blog";
    }
    if (lowerPath.includes("research")) {
      return "research";
    }
    return null;
  }, [basePath]);

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

  // Reset page count when the selected item changes
  useEffect(() => {
    setNumPages(0);
  }, [selectedId]);

  const handleHtmlIframeLoad = useCallback((event: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const doc = event.currentTarget.contentDocument;
      if (!doc) {
        return;
      }

      const anchors = doc.querySelectorAll<HTMLAnchorElement>("a[href]");
      anchors.forEach((anchor) => {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      });
    } catch {
      // No-op: if iframe content is inaccessible, default browser behavior applies.
    }
  }, []);

  const contentUrl = useMemo(() => {
    if (!selectedItem) {
      return "";
    }
    const path = selectedItem.htmlPath || selectedItem.pdfPath || "";
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}${path}`;
    }
    return path;
  }, [selectedItem]);

  // Sort items by date, newest first
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.date + "T00:00:00").getTime();
    const dateB = new Date(b.date + "T00:00:00").getTime();
    return dateB - dateA;
  });

  const handleItemClick = (id: string) => {
    navigate(`${basePath}/${id}`);
    if (isMobileView) setSidebarOpen(false);
  };

  const handleHomeClick = () => {
    navigate(basePath);
    if (isMobileView) setSidebarOpen(false);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobileView || !sidebarOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileView, sidebarOpen]);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderHtmlContent = () => {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.SURFACE_DARK }}>
        <iframe
          title={selectedItem!.title}
          src={contentUrl}
          className="flex-1 w-full"
          style={{ border: "none", minHeight: "100%" }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          onLoad={handleHtmlIframeLoad}
        />
      </div>
    );
  };

  const renderPdfContent = () => {
    if (isMobileView) {
      return (
        <div className="h-full flex flex-col" style={{ backgroundColor: containerBg }}>
          <iframe
            title={selectedItem!.title}
            src={`${contentUrl}#toolbar=0`}
            className="flex-1 w-full"
            style={{ border: "none", minHeight: "100%" }}
          />
        </div>
      );
    }

    return (
      <Document
        file={contentUrl}
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
            <div key={`break_${index + 1}`} style={{ backgroundColor: COLORS.SURFACE_DARK, padding: "10px 0" }}>
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
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen" style={{ backgroundColor: COLORS.SURFACE_DARK }}>
      {/* Mobile header bar */}
      {isMobileView && (
        <div
          className="flex items-center justify-between h-11 px-3 flex-shrink-0"
          style={{ backgroundColor: COLORS.SURFACE_DARK_ALT }}
        >
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-200 text-base"
            style={{ backgroundColor: COLORS.BACK_BUTTON_PURPLE }}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
          <div className="flex items-center gap-2">
            {isNewsletterSubscribed && (
              <button
                onClick={() => window.dispatchEvent(new Event("openNewsletterSettings"))}
                className="w-9 h-9 flex items-center justify-center"
                aria-label="Newsletter settings"
              >
                <span
                  className="block w-7 h-7"
                  style={{
                    backgroundColor: COLORS.BACK_BUTTON_PURPLE,
                    WebkitMaskImage: "url('/settings.svg')",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskImage: "url('/settings.svg')",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    maskSize: "contain",
                  }}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main content area - takes up all space except footer */}
      <div className="flex flex-1 overflow-hidden">
        {/* Overlay backdrop for mobile */}
        {isMobileView && sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Left Sidebar Panel */}
        <div
          ref={sidebarRef}
          className={`
            ${isMobileView
              ? `fixed top-11 left-0 h-[calc(100%-2.75rem)] z-40 w-[70%] max-w-[300px] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
              : "w-[25%] sm:w-[15%] h-full"
            }
            border-r border-gray-700 flex flex-col overflow-hidden
          `}
          style={{ backgroundColor: COLORS.SURFACE_DARK_ALT }}
        >
          {/* Back Button */}
          <div className="p-4 flex justify-center">
            <BackButton to={backTo} color={COLORS.BACK_BUTTON_PURPLE} textColor={COLORS.BACK_BUTTON_TEXT} />
          </div>

          {/* Home Link */}
          <div
            onClick={handleHomeClick}
            className="mx-4 my-2 py-3 cursor-pointer transition-colors font-mono text-lg text-gray-300 text-center rounded-lg hover:opacity-80"
            style={!selectedId ? { backgroundColor: COLORS.BACK_BUTTON_PURPLE } : undefined}
          >
            Home
          </div>

          {/* Divider */}
          <div className="border-b border-gray-600 mx-4" />

          {/* Items List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2">
            {sortedItems.length === 0 ? (
              <div className="py-3 text-gray-500 text-sm font-mono italic">{emptyText}</div>
            ) : (
              sortedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`my-1 cursor-pointer transition-colors text-gray-300 hover:opacity-80 rounded-lg overflow-hidden ${
                    isMobileView ? "py-3 px-3" : "py-2 sm:py-3 px-2 sm:px-3"
                  }`}
                  style={selectedId === item.id ? { backgroundColor: COLORS.BACK_BUTTON_PURPLE } : undefined}
                >
                  <div className={`text-gray-500 font-mono mb-1 ${isMobileView ? "text-xs" : "text-[8px] sm:text-xs"}`}>{formatDate(item.date)}</div>
                  <div className={`font-mono leading-tight break-words ${isMobileView ? "text-sm" : "text-[10px] sm:text-sm"}`}>{item.title}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div ref={containerRef} className="flex-1 h-full overflow-y-auto overflow-x-hidden" style={{ backgroundColor: containerBg }}>
          {selectedItem ? (
            isHtmlContent ? renderHtmlContent() : renderPdfContent()
          ) : (
            /* Home/Intro Content */
            <div className="h-full overflow-y-auto">
              <div className={`markdown-container ${isMobileView ? "px-4 py-6" : "p-8"}`}>
                <div className="markdown font-mono text-[#ffebcd]">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                    {homeContent}
                  </ReactMarkdown>
                  <div className="mt-8">
                    <NewsletterSubscription currentTopic={currentTopic} mobileHeaderMode={isMobileView} onSubscriptionChange={setIsNewsletterSubscribed} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0" style={{ backgroundColor: COLORS.SURFACE_DARK }}>
        <Footer />
      </div>
    </div>
  );
};

export default WritingSidebarPage;
