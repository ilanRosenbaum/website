import React, { useEffect, useRef, useState, useMemo } from "react";
import BackButton from "./BackButton";
import { storage } from "./../firebase";
import { ref, listAll, getMetadata, getDownloadURL, StorageReference } from "firebase/storage";
import { imageCache } from "./ImageCache";

interface TiledPlaneFoldersProps {
  parentFolder: string; // e.g. "Ceramics"
  backTo?: string; // optional route/string for the BackButton
}

interface FolderData {
  coverPhoto: string; // The thumbnail of the newest original (or fallback)
  allPhotos: string[]; // The full-size URLs for each image
  folderName: string; // e.g. "x" for "Ceramics/x"
}

const TiledPlaneFolders: React.FC<TiledPlaneFoldersProps> = ({ parentFolder, backTo }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // =============== State ===============
  // Which folder is open in the fullscreen viewer, and which photo is displayed?
  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Our array of subfolders (each with a coverPhoto and an allPhotos list)
  const [folderData, setFolderData] = useState<FolderData[]>([]);

  // Just storing the raw sorted folder paths here
  const [photoPaths, setPhotoPaths] = useState<string[]>([]);

  // Prevent double-clicking Next/Prev from causing flickers
  const [isLoading, setIsLoading] = useState(false);

  // Track hovered index for optional hover animation
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // For container sizing
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // ------------------------------------------------------------------------
  // 1) List the subfolders of `parentFolder` and sort them by lastModified
  // ------------------------------------------------------------------------
  useEffect(() => {
    const listFolders = async () => {
      const directoryRef = ref(storage, parentFolder);

      try {
        const result = await listAll(directoryRef);

        // We only care about subfolders (prefixes)
        const folderPromises = result.prefixes.map(async (folderRef: StorageReference) => {
          // Example folderRef: "Ceramics/x"
          const folderPath = `${parentFolder}/${folderRef.name}`;

          // Get all items in that subfolder to find the newest date
          const folderContents = await listAll(ref(storage, folderPath));
          if (folderContents.items.length === 0) {
            return { path: folderPath, lastModified: new Date(0) };
          }

          // Get metadata for each file, pick the newest date
          const metadataPromises = folderContents.items.map((item) => getMetadata(item));
          const metadataResults = await Promise.all(metadataPromises);

          const validDates = metadataResults
            .map((meta) => meta.updated)
            .filter((updated): updated is string => typeof updated === "string")
            .map((updated) => new Date(updated))
            .filter((date) => !isNaN(date.getTime()));

          const lastModified = validDates.length > 0 ? new Date(Math.max(...validDates.map((d) => d.getTime()))) : new Date(0);

          return { path: folderPath, lastModified };
        });

        const foldersWithDates = await Promise.all(folderPromises);

        // Sort by newest first
        const sortedFolders = foldersWithDates.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
        setPhotoPaths(sortedFolders.map((folder) => folder.path));
      } catch (error) {
        console.error("Error listing folders:", error);
      }
    };

    listFolders();
  }, [parentFolder]);

  // ------------------------------------------------------------------------
  // 2) For each subfolder:
  //    (a) Find the *original image* that is most recently modified
  //    (b) Look for its matching thumbnail in /thumbnails
  //    (c) If found, that thumbnail becomes coverPhoto
  //    (d) If not, fallback to the original
  //    (e) allPhotos => sorted big images
  // ------------------------------------------------------------------------
  useEffect(() => {
    const fetchPhotos = async () => {
      const paths = Array.isArray(photoPaths) ? photoPaths : [photoPaths];

      const fetchedFolderData: FolderData[] = await Promise.all(
        paths.map(async (path) => {
          // e.g. path = "Ceramics/x"
          const folderName = path.split("/").pop() || "";

          // 2a) List all *original* images in the main subfolder, sort descending by lastModified
          let allOriginalItems: StorageReference[] = [];
          let newestOriginal: StorageReference | null = null;

          try {
            const folderRef = ref(storage, path);
            const folderContents = await listAll(folderRef);

            // If no items, skip
            if (!folderContents.items.length) {
              return {
                coverPhoto: "",
                allPhotos: [],
                folderName
              };
            }

            // Sort the folder items by lastModified descending
            const itemsWithMeta = await Promise.all(
              folderContents.items.map(async (item) => {
                const meta = await getMetadata(item);
                // fallback to timeCreated if updated not present
                const dateString = meta.updated || meta.timeCreated;
                return {
                  ref: item,
                  date: new Date(dateString)
                };
              })
            );
            itemsWithMeta.sort((a, b) => b.date.getTime() - a.date.getTime());

            // Now, allOriginalItems is in descending order
            allOriginalItems = itemsWithMeta.map((obj) => obj.ref);

            // newestOriginal is the item with the largest date
            newestOriginal = allOriginalItems[0] || null;
          } catch (error) {
            console.error(`Error listing original images from ${path}:`, error);
            return {
              coverPhoto: "",
              allPhotos: [],
              folderName
            };
          }

          // 2b) If we have a newest original, look for its matching thumbnail
          let coverPhotoUrl = "";
          if (newestOriginal) {
            const originalName = newestOriginal.name;
            const lastDotIndex = originalName.lastIndexOf(".");

            // Ensure there's an extension
            if (lastDotIndex !== -1) {
              const baseFilename = originalName.substring(0, lastDotIndex); // Extract base filename
              const extension = originalName.substring(lastDotIndex); // Extract extension including the dot

              // Append "_300x300" before the extension
              const possibleThumbName = `${baseFilename}_300x300${extension}`;

              try {
                const thumbRef = ref(storage, `${path}/thumbnails/${possibleThumbName}`);
                // Attempt to get the download URL for the thumbnail
                coverPhotoUrl = await getDownloadURL(thumbRef);
                await imageCache.getImage(coverPhotoUrl); // Preload
              } catch (error) {
                console.warn(`No matching thumbnail for newest original ${originalName}`, error);
              }
            } else {
              console.warn(`Original file "${originalName}" does not have an extension.`);
            }
          }

          return {
            coverPhoto: coverPhotoUrl,
            allPhotos: [], // We'll fetch these on-demand
            folderName
          };
        })
      );

      // Filter out any empty or broken folders
      const validData = fetchedFolderData.filter((data) => data.coverPhoto !== "");
      setFolderData(validData);
    };

    if (photoPaths.length > 0) {
      fetchPhotos();
    }
  }, [photoPaths]);

  // =============== Container Size ===============
  useEffect(() => {
    const updateContainerSize = () => {
      if (!containerRef.current) return;
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    };
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, []);

  // =============== 3) Prepare the Honeycomb Data in a React Way ===============
  interface HexDatum {
    x: number;
    y: number;
    folder: FolderData;
    index: number;
  }

  const hexData: HexDatum[] = useMemo(() => {
    const { width, height } = containerSize;
    if (!width || !height || folderData.length === 0) return [];

    // Basic sizing for the hex grid (similar logic as before)
    const hexRadius = width > height ? height / 4 : width / 6;
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;

    const centerX = width / 2;
    const columnOffsetX = hexWidth * 0.75;
    const rowOffsetY = hexHeight;

    // We'll place hexagons in a honeycomb pattern:
    // 3 columns each row => center(0), left(-1), right(1)
    const columns = [0, -1, 1];
    let folderIndex = 0;
    let row = 0;

    const tmp: HexDatum[] = [];

    while (folderIndex < folderData.length) {
      for (const col of columns) {
        if (folderIndex >= folderData.length) break;

        const x = centerX + col * columnOffsetX - hexWidth / 2;
        // For honeycomb style, shift half a hex if col != 0
        // but let's keep your existing offset logic: (Math.abs(col) % 2 === 1)
        const y = row * rowOffsetY + (Math.abs(col) % 2 === 1 ? rowOffsetY / 2 : 0);

        tmp.push({
          x,
          y,
          folder: folderData[folderIndex],
          index: folderIndex
        });

        folderIndex++;
      }
      row++;
    }

    return tmp;
  }, [containerSize, folderData]);

  // =============== Hex Path ===============
  const hexPath = useMemo(() => {
    const { width, height } = containerSize;
    if (!width || !height) return "";

    const r = width > height ? height / 4 : width / 6;
    const side = r * 2;
    const h = (r * Math.sqrt(3)) / 2;
    return `M0,${r}
            l${side * 0.25},${h}
            l${side * 0.5},0
            l${side * 0.25},-${h}
            l-${side * 0.25},-${h}
            l-${side * 0.5},0
            Z`;
  }, [containerSize]);

  // =============== 4) Fullscreen viewer logic: next/prev/close ===============
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (selectedFolder && selectedPhotoIndex !== null) {
      const nextIndex = selectedPhotoIndex + 1;
      if (nextIndex < selectedFolder.allPhotos.length) {
        setIsLoading(true);
        setSelectedPhotoIndex(nextIndex);
      }
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (selectedFolder && selectedPhotoIndex !== null) {
      const prevIndex = selectedPhotoIndex - 1;
      if (prevIndex >= 0) {
        setIsLoading(true);
        setSelectedPhotoIndex(prevIndex);
      }
    }
  };

  const closeFullscreen = (e: React.MouseEvent) => {
    // Only close if user clicks the background (not the image itself)
    if (e.currentTarget === e.target) {
      setSelectedFolder(null);
      setSelectedPhotoIndex(null);
      setIsLoading(false);
    }
  };

  // Preload next/previous images so there's less flicker
  useEffect(() => {
    if (selectedFolder && selectedPhotoIndex !== null) {
      const preloadImage = (index: number) => {
        if (index >= 0 && index < selectedFolder.allPhotos.length) {
          const img = new Image();
          img.src = selectedFolder.allPhotos[index];
        }
      };
      preloadImage(selectedPhotoIndex + 1);
      preloadImage(selectedPhotoIndex - 1);
    }
  }, [selectedFolder, selectedPhotoIndex]);

  // =============== On Click: Show Fullscreen ===============
  const handleHexClick = async (folderIndex: number) => {
    const folder = folderData[folderIndex];
    if (folder.allPhotos.length > 0) {
      setSelectedFolder(folder);
      setSelectedPhotoIndex(0);
      return;
    }

    // Otherwise, load on-demand
    try {
      const allPhotos = await fetchAllPhotosForFolderPath(folder.folderName);
      setFolderData((prev) => {
        const newArr = [...prev];
        newArr[folderIndex] = {
          ...newArr[folderIndex],
          allPhotos
        };
        return newArr;
      });
      setSelectedFolder({
        ...folder,
        allPhotos
      });
      setSelectedPhotoIndex(0);
    } catch (err) {
      console.error("Error loading on-demand photos:", err);
    }
  };

  // Example helper to fetch the big images
  async function fetchAllPhotosForFolderPath(subfolderName: string): Promise<string[]> {
    try {
      const folderRef = ref(storage, `${parentFolder}/${subfolderName}`);
      const result = await listAll(folderRef);
      const sortedItems = result.items.sort((a, b) => b.name.localeCompare(a.name));

      const allPhotos = await Promise.all(
        sortedItems.map(async (item) => {
          const url = await getDownloadURL(item);
          await imageCache.getImage(url); // Preload big images
          return url;
        })
      );
      return allPhotos;
    } catch (error) {
      console.error("Error fetching all photos from", subfolderName, error);
      return [];
    }
  }

  // =============== Render ===============
  return (
    <div className="h-screen w-screen bg-black/90 flex flex-col items-center">
      {/* Back button at top-left */}
      <div className="absolute top-[2vw] left-[2vw] z-10">
        <BackButton textColor="#ffefdb" color="#603b61" to={backTo || ""} />
      </div>

      {/* Main container (for the honeycomb of subfolders) */}
      <div ref={containerRef} className="w-screen h-[calc(80dvh)] mt-[max(9vw,9vh)] mb-[calc(6dvh)] custom-scrollbar overflow-auto">
        {(() => {
          const { width, height } = containerSize;
          if (!width || !height || hexData.length === 0) return null;

          // Estimate total rows to compute an SVG height that can scroll
          // (Row count roughly = total folders / 3 columns)
          const rowCount = Math.ceil(folderData.length / 3);
          const hexRadius = width > height ? height / 4 : width / 6;
          const singleHexHeight = hexRadius * Math.sqrt(3);
          const svgHeight = Math.max(height, rowCount * singleHexHeight + singleHexHeight);

          return (
            <svg width={width} height={svgHeight} className="mx-auto block" style={{ overflow: "visible" }}>
              {/* 1) Define clip paths in <defs> for each folder */}
              <defs>
                {hexData.map((d) => (
                  <clipPath key={`clip-hex-${d.index}`} id={`clip-hex-${d.index}`}>
                    <path d={hexPath} transform={`translate(${d.x}, ${d.y})`} />
                  </clipPath>
                ))}
              </defs>

              {/* 2) Render each hex */}
              {hexData.map((d) => {
                // Basic geometry
                const r = width > height ? height / 4 : width / 6;
                const side = r * 2;
                const centerX = d.x + side / 2;
                const centerY = d.y + r;
                const isHovered = hoveredIndex === d.index;
                const scale = isHovered ? 0.9 : 1;

                // For cropping the cover photo into the hex shape
                // We'll use the same x/y as the hex path
                const imgX = d.x;
                const imgY = d.y;
                const imgW = side;
                const imgH = r * Math.sqrt(3);

                // "cover-scale" approach: if your images are consistently sized,
                // this can be simplified. Otherwise, a dynamic approach:
                const scaleX = imgW / 300; // because we used 300 as an example size
                const scaleY = imgH / 300;
                const coverScale = Math.max(scaleX, scaleY);
                const scaledW = 300 * coverScale;
                const scaledH = 300 * coverScale;
                const offsetX = (imgW - scaledW) / 2;
                const offsetY = (imgH - scaledH) / 2;

                return (
                  <g key={`hex-${d.index}`}>
                    {/* A) Transparent path for pointer events + hover */}
                    <path
                      d={hexPath}
                      fill="transparent"
                      transform={`translate(${imgX}, ${imgY})`}
                      onMouseEnter={() => setHoveredIndex(d.index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleHexClick(d.index)}
                      style={{ cursor: "pointer" }}
                    />

                    {/* B) Visual group that shrinks/grows on hover */}
                    <g transform={`translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX}, ${-centerY})`} style={{ transition: "transform 0.15s ease-out", pointerEvents: "none" }}>
                      {/* Clipped image */}
                      <g clipPath={`url(#clip-hex-${d.index})`}>
                        <g transform={`translate(${imgX}, ${imgY})`}>
                          <g transform={`translate(${offsetX}, ${offsetY}) scale(${coverScale})`}>
                            <image xlinkHref={d.folder.coverPhoto} width={300} height={300} preserveAspectRatio="none" style={{ pointerEvents: "none" }} />
                          </g>
                        </g>
                      </g>

                      {/* Optional border or stroke */}
                      <path d={hexPath} fill="none" stroke="black" strokeWidth={2} transform={`translate(${imgX}, ${imgY})`} style={{ pointerEvents: "none" }} />
                    </g>
                  </g>
                );
              })}
            </svg>
          );
        })()}
      </div>

      {/* Fullscreen photo viewer */}
      {selectedFolder && selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20" onClick={closeFullscreen}>
          <img src={selectedFolder.allPhotos[selectedPhotoIndex]} alt="" className="max-w-[90%] max-h-[70%] object-contain mb-4" onClick={(e) => e.stopPropagation()} onLoad={() => setIsLoading(false)} />
          {/* Show folder name or other info if desired */}
          <div className="text-[#ffebcd] font-mono text-xl mb-4">{selectedFolder.folderName}</div>

          {/* Next/Prev arrows */}
          <div className="flex justify-center items-center w-full">
            {/* Previous button */}
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${isLoading ? "text-[#a09f9e]" : "text-[#ffebcd]"} ${
                selectedPhotoIndex === 0 ? "opacity-0 cursor-default" : "opacity-100 cursor-pointer"
              }`}
              onClick={handlePrevious}
              disabled={isLoading || selectedPhotoIndex === 0}
            >
              &lt;
            </button>

            {/* Next button */}
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${isLoading ? "text-[#a09f9e]" : "text-[#ffebcd]"} ${
                selectedPhotoIndex === selectedFolder.allPhotos.length - 1 ? "opacity-0 cursor-default" : "opacity-100 cursor-pointer"
              }`}
              onClick={handleNext}
              disabled={isLoading || selectedPhotoIndex === selectedFolder.allPhotos.length - 1}
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
