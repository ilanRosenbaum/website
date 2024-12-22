import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import BackButton from "./BackButton";
import { throttle } from "./SierpinskiHexagon";
import { storage } from "./../firebase";
import { ref, listAll, getMetadata, getDownloadURL, StorageReference } from "firebase/storage";
import { imageCache } from "./ImageCache";

interface TiledPlaneFoldersProps {
  parentFolder: string;
  backTo?: string;
}

interface FolderData {
  coverPhoto: string;
  allPhotos: string[];
  folderName: string;
}

const PAGE_SIZE = 6;

const TiledPlaneFolders: React.FC<TiledPlaneFoldersProps> = ({ parentFolder, backTo }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // All subfolder paths found in Firebase, sorted by lastModified
  const [allFolderPaths, setAllFolderPaths] = useState<string[]>([]);
  // Actual folder data (cover photo, all images, name) for each loaded folder
  const [folderData, setFolderData] = useState<FolderData[]>([]);

  // Lazy load indices
  const [loadedCount, setLoadedCount] = useState(0);
  const loadingRef = useRef(false);

  // Fullscreen overlay states
  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hover tracking (which hex is hovered)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const listFolders = async () => {
      try {
        const directoryRef = ref(storage, parentFolder);
        const result = await listAll(directoryRef);

        // For each subfolder, get lastModified by checking items inside
        const folderPromises = result.prefixes.map(async (folderRef: StorageReference) => {
          const folderPath = `/Ceramics/${folderRef.name}`;
          const folderContents = await listAll(ref(storage, folderPath));

          if (folderContents.items.length === 0) {
            return { path: folderPath, lastModified: new Date(0) };
          }

          const metadataPromises = folderContents.items.map((item) => getMetadata(item));
          const metadataResults = await Promise.all(metadataPromises);

          // Extract valid "updated" timestamps
          const validDates = metadataResults
            .map((m) => m.updated)
            .filter((v): v is string => typeof v === "string")
            .map((s) => new Date(s))
            .filter((d) => !isNaN(d.getTime()));

          const lastModified = validDates.length > 0 ? new Date(Math.max(...validDates.map((d) => d.getTime()))) : new Date(0);

          return { path: folderPath, lastModified };
        });

        const foldersWithDates = await Promise.all(folderPromises);

        // Sort from newest to oldest
        const sortedFolders = foldersWithDates.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
        const paths = sortedFolders.map((f) => f.path);

        setAllFolderPaths(paths);
      } catch (error) {
        console.error("Error listing folders:", error);
      }
    };

    listFolders();

    // Cleanup
    return () => {
      setFolderData([]);
      setLoadedCount(0);
      loadingRef.current = false;
    };
  }, [parentFolder]);

  const loadNextBatch = useCallback(async () => {
    if (loadingRef.current || loadedCount >= allFolderPaths.length) return;

    loadingRef.current = true;
    const endIndex = Math.min(loadedCount + PAGE_SIZE, allFolderPaths.length);
    const batch = allFolderPaths.slice(loadedCount, endIndex);

    try {
      const batchFolderData = await Promise.all(
        batch.map(async (path) => {
          try {
            const folderRef = ref(storage, path);
            const result = await listAll(folderRef);

            // Sort items (photos) by name descending
            const sortedItems = result.items.sort((a, b) => b.name.localeCompare(a.name));

            // Fetch & cache each image
            const urls = await Promise.all(
              sortedItems.map(async (item) => {
                const url = await getDownloadURL(item);
                await imageCache.getImage(url);
                return url;
              })
            );

            return {
              coverPhoto: urls[0],
              allPhotos: urls,
              folderName: path.split("/").pop() || ""
            };
          } catch (err) {
            console.error(`Error fetching photos from ${path}:`, err);
            return null;
          }
        })
      );

      // Filter out null
      const validFolderData = batchFolderData.filter((f): f is FolderData => !!f);

      // Append new folder data
      setFolderData((prev) => [...prev, ...validFolderData]);
      setLoadedCount(endIndex);
    } catch (error) {
      console.error("Error loading batch:", error);
    } finally {
      loadingRef.current = false;
    }
  }, [allFolderPaths, loadedCount]);

  useEffect(() => {
    if (allFolderPaths.length > 0) {
      loadNextBatch();
    }
  }, [allFolderPaths, loadNextBatch]);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const hexData = useMemo(() => {
    const { width, height } = containerSize;
    if (!width || !height || folderData.length === 0) return [];

    const hexRadius = width > height ? height / 4 : width / 6;
    const hexW = hexRadius * 2;
    const hexH = Math.sqrt(3) * hexRadius;

    const centerX = width / 2;
    const columns = [0, -1, 1];
    const columnOffsetX = hexW * 0.75;
    const rowOffsetY = hexH;

    let row = 0;
    let idx = 0;

    const out: {
      x: number;
      y: number;
      folder: FolderData;
      index: number;
    }[] = [];

    while (idx < folderData.length) {
      for (const col of columns) {
        if (idx >= folderData.length) break;

        const x = centerX + col * columnOffsetX - hexW / 2;
        // Slight stagger for col ±1
        const y = row * rowOffsetY + (Math.abs(col) === 1 ? rowOffsetY / 2 : 0);

        out.push({
          x,
          y,
          folder: folderData[idx],
          index: idx
        });
        idx++;
      }
      row++;
    }
    return out;
  }, [containerSize, folderData]);

  const hexPath = useMemo(() => {
    const { width, height } = containerSize;
    if (!width || !height) return "";
    const r = width > height ? height / 4 : width / 6;
    const side = 2 * r;
    const h = (Math.sqrt(3) * r) / 2;

    return `M0,${r}
      l${side * 0.25},${h}
      l${side * 0.5},0
      l${side * 0.25},-${h}
      l-${side * 0.25},-${h}
      l-${side * 0.5},0
      Z`;
  }, [containerSize]);

  const handleScroll = throttle((e: React.UIEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const scrollPos = el.scrollTop + el.clientHeight;
    const threshold = el.scrollHeight * 0.8;

    // If near bottom, load more
    if (scrollPos > threshold && !loadingRef.current) {
      setLoadedCount((prev) => prev + PAGE_SIZE);
    }
  }, 200);

  const closeFullscreen = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      setSelectedFolder(null);
      setSelectedPhotoIndex(null);
      setIsLoading(false);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedFolder || selectedPhotoIndex == null || isLoading) return;
    if (selectedPhotoIndex < selectedFolder.allPhotos.length - 1) {
      setIsLoading(true);
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedFolder || selectedPhotoIndex == null || isLoading) return;
    if (selectedPhotoIndex > 0) {
      setIsLoading(true);
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  // Preload next/prev images
  useEffect(() => {
    if (selectedFolder && selectedPhotoIndex != null) {
      const preload = (idx: number) => {
        if (idx >= 0 && idx < selectedFolder.allPhotos.length) {
          const img = new Image();
          img.src = selectedFolder.allPhotos[idx];
        }
      };
      preload(selectedPhotoIndex + 1);
      preload(selectedPhotoIndex - 1);
    }
  }, [selectedFolder, selectedPhotoIndex]);

  return (
    <div className="h-screen w-screen bg-black/90 flex flex-col items-center">
      {/* Back button */}
      <div className="absolute top-[2vw] left-[2vw] z-10">
        <BackButton textColor="#ffefdb" color="#603b61" to={backTo || ""} />
      </div>

      {/* Scrollable container with lazy-load on scroll */}
      <div ref={containerRef} className="w-screen h-[calc(80dvh)] mt-[max(9vw,9vh)] mb-[calc(6dvh)] custom-scrollbar overflow-auto" onScroll={handleScroll}>
        {(() => {
          const { width, height } = containerSize;
          if (!width || !height) return null; // haven't measured yet

          // rowCount = ceil(folderData.length / 3)
          const rowCount = Math.ceil(folderData.length / 3);
          const r = width > height ? height / 4 : width / 6;
          const hexH = Math.sqrt(3) * r;
          const svgHeight = rowCount * hexH + hexH;

          return (
            <svg width={width} height={svgHeight} className="mx-auto block" style={{ overflow: "visible" }}>
              {/* Patterns for each folder's cover photo */}
              <defs>
                {hexData.map(({ index, folder }) => {
                  const patternId = `folder-cover-${index}`;
                  const r2 = width > height ? height / 4 : width / 6;
                  const w = 2 * r2;
                  const h = Math.sqrt(3) * r2;
                  return (
                    <pattern key={patternId} id={patternId} patternUnits="userSpaceOnUse" width={w} height={h}>
                      <image xlinkHref={folder.coverPhoto} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
                    </pattern>
                  );
                })}
              </defs>

              {/* One hex per folder */}
              {hexData.map((d) => {
                const r2 = width > height ? height / 4 : width / 6;
                const side = 2 * r2;
                const cx = d.x + side / 2;
                const cy = d.y + r2;

                // We'll highlight with a thicker stroke on hover, no scaling:
                const isHovered = hoveredIndex === d.index;
                const strokeColor = isHovered ? "yellow" : "black";
                const strokeWidth = isHovered ? 4 : 2;

                return (
                  <g key={`folder-hex-${d.index}`}>
                    <path
                      d={hexPath}
                      fill={`url(#folder-cover-${d.index})`}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      transform={`translate(${d.x}, ${d.y})`}
                      style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
                      onClick={() => {
                        setSelectedFolder(d.folder);
                        setSelectedPhotoIndex(0);
                      }}
                      onMouseEnter={() => setHoveredIndex(d.index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  </g>
                );
              })}
            </svg>
          );
        })()}
      </div>

      {/* Fullscreen overlay */}
      {selectedFolder && selectedPhotoIndex != null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20" onClick={closeFullscreen}>
          <img src={selectedFolder.allPhotos[selectedPhotoIndex]} alt="" className="max-w-[90%] max-h-[70%] object-contain mb-4" onClick={(e) => e.stopPropagation()} onLoad={() => setIsLoading(false)} />
          <div className="text-[#ffebcd] font-mono text-xl mb-4">{selectedFolder.folderName}</div>
          <div className="flex justify-center items-center w-full">
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${isLoading ? "text-[#a09f9e]" : "text-[#ffebcd]"} ${
                selectedPhotoIndex === 0 ? "opacity-0" : "opacity-100"
              }`}
              onClick={(e) => {
                setIsLoading(true);
                handlePrevious(e);
              }}
              disabled={isLoading}
            >
              &lt;
            </button>
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${isLoading ? "text-[#a09f9e]" : "text-[#ffebcd]"} ${
                selectedPhotoIndex === selectedFolder.allPhotos.length - 1 ? "opacity-0" : "opacity-100"
              }`}
              onClick={(e) => {
                setIsLoading(true);
                handleNext(e);
              }}
              disabled={isLoading}
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">Copyright © 2024 Ilan Rosenbaum All rights reserved.</div>
    </div>
  );
};

export default TiledPlaneFolders;
