import React, { useEffect, useRef, useState, useMemo } from "react";
import BackButton from "./BackButton";
import { storage } from "./../firebase";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { imageCache } from "./ImageCache";

interface TiledPlaneProps {
  photoPath: string;
  backTo?: string;
}

interface ImageItem {
  thumbUrl: string; // thumbnail URL
  fullPath: string; // path to the original full-size photo
  lastModified: string; // from original photo's metadata.updated
}

const TiledPlane: React.FC<TiledPlaneProps> = ({ photoPath, backTo }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fullscreen viewer
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Photo array (sorted newest -> oldest)
  const [photos, setPhotos] = useState<ImageItem[]>([]);

  // Hover index
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // For container sizing
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // =================== 1) Fetch on mount ===================
  useEffect(() => {
    // Reset when photoPath changes
    setPhotos([]);
    setSelectedPhoto(null);
    setSelectedIndex(null);

    fetchThumbnailsIncremental();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoPath]);

  /**
   * Insert a single item into our array in descending order,
   * but only if it doesn't already exist (avoid duplicates).
   */
  function insertInDescendingOrder(existing: ImageItem[], item: ImageItem) {
    // 1) Check if already present
    const alreadyIndex = existing.findIndex(
      (x) => x.fullPath === item.fullPath
    );
    if (alreadyIndex !== -1) {
      // Already in the list
      return existing;
    }

    // 2) Place item in descending order by lastModified
    const newTs = new Date(item.lastModified).getTime();
    let i = 0;
    while (i < existing.length) {
      const currentTs = new Date(existing[i].lastModified).getTime();
      if (currentTs <= newTs) {
        // item is newer than existing[i]
        break;
      }
      i++;
    }
    return [...existing.slice(0, i), item, ...existing.slice(i)];
  }

  /**
   * 2) Incremental approach:
   *    listAll -> for each thumbnail -> fetch original metadata -> insert
   */
  const fetchThumbnailsIncremental = async () => {
    try {
      const thumbsRef = ref(storage, `${photoPath}/thumbnails`);
      const { items: thumbRefs } = await listAll(thumbsRef);

      // For each thumbnail, do the fetching
      thumbRefs.forEach(async (thumbRef) => {
        try {
          // e.g. "example_300x300.jpg"
          const thumbName = thumbRef.name;
          const baseName = thumbName.replace("_300x300", "");
          const originalFullPath = `${photoPath}/${baseName}`;

          // 1) Thumbnail URL
          const thumbUrl = await getDownloadURL(thumbRef);
          await imageCache.getImage(thumbUrl);

          // 2) Original metadata (for lastModified)
          const originalRef = ref(storage, originalFullPath);
          const originalMeta = await getMetadata(originalRef);

          const lastModified = originalMeta.updated || originalMeta.timeCreated;

          const newItem: ImageItem = {
            thumbUrl,
            fullPath: originalFullPath,
            lastModified
          };

          // Insert item in correct descending order, skipping duplicates
          setPhotos((prev) => insertInDescendingOrder(prev, newItem));
        } catch (innerErr) {
          console.error("Error fetching data for a thumbnail:", innerErr);
        }
      });
    } catch (error) {
      console.error("Error listing thumbnails:", error);
    }
  };

  // =============== On Click, Load the Full-Size ===============
  const handleHexClick = async (index: number) => {
    try {
      const item = photos[index];
      const fullRef = ref(storage, item.fullPath);
      const bigImageUrl = await getDownloadURL(fullRef);
      setSelectedIndex(index);
      setSelectedPhoto(bigImageUrl);
    } catch (error) {
      console.error("Error loading full-size image:", error);
    }
  };

  // =============== Next / Previous Full-Size ===============
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      const newIndex = selectedIndex + 1;
      handleHexClick(newIndex);
      setSelectedIndex(newIndex);
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      handleHexClick(newIndex);
      setSelectedIndex(newIndex);
    }
  };

  const closeFullscreen = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      setSelectedPhoto(null);
      setSelectedIndex(null);
    }
  };

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

  // =============== Prepare Hex Data ===============
  const hexData = useMemo(() => {
    const { width, height } = containerSize;
    if (!width || !height || photos.length === 0) return [];

    const hexRadius = width > height ? height / 4 : width / 6;
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;

    const centerX = width / 2;
    const columnOffsetX = hexWidth * 0.75;
    const rowOffsetY = hexHeight;

    // We'll do 3 columns (center, left, right)
    const columns = [0, -1, 1];
    let photoIndex = 0;
    let row = 0;

    const tmp: { x: number; y: number; item: ImageItem; index: number }[] = [];

    while (photoIndex < photos.length) {
      for (const col of columns) {
        if (photoIndex >= photos.length) break;

        const x = centerX + col * columnOffsetX - hexWidth / 2;
        // For honeycomb style, shift half a hex if col != 0
        const y = row * rowOffsetY + (Math.abs(col) === 1 ? rowOffsetY / 2 : 0);

        tmp.push({
          x,
          y,
          item: photos[photoIndex],
          index: photoIndex
        });

        photoIndex++;
      }
      row++;
    }
    return tmp;
  }, [containerSize, photos]);

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

  return (
    <div className="h-screen w-screen bg-black/90 flex flex-col items-center">
      {/* Back Button */}
      <div className="absolute top-[2vw] left-[2vw] z-10">
        <BackButton textColor="#ffefdb" color="#603b61" to={backTo || ""} />
      </div>

      {/* Main Container */}
      <div
        ref={containerRef}
        className="w-screen h-[calc(80dvh)] mt-[max(9vw,9vh)] mb-[calc(6dvh)] custom-scrollbar overflow-auto"
      >
        {(() => {
          const { width, height } = containerSize;
          if (!width || !height) return null;

          const rowCount = Math.ceil(photos.length / 3);
          const hexRadius = width > height ? height / 4 : width / 6;
          const singleHexHeight = hexRadius * Math.sqrt(3);
          const svgHeight = Math.max(
            height,
            rowCount * singleHexHeight + singleHexHeight
          );

          return (
            <svg
              width={width}
              height={svgHeight}
              className="mx-auto block"
              style={{ overflow: "visible" }}
            >
              {/* 1) Define all clip paths in <defs> */}
              <defs>
                {hexData.map((d) => (
                  <clipPath
                    key={`clip-hex-${d.index}`}
                    id={`clip-hex-${d.index}`}
                  >
                    <path d={hexPath} transform={`translate(${d.x}, ${d.y})`} />
                  </clipPath>
                ))}
              </defs>

              {/* 2) Render each hex */}
              {hexData.map((d) => {
                const hr = width > height ? height / 4 : width / 6;
                const side = hr * 2;
                const cx = d.x + side / 2;
                const cy = d.y + hr;
                const isHovered = hoveredIndex === d.index;
                const scale = isHovered ? 0.92 : 1;

                // We'll use the same x/y as the hex path
                const imgX = d.x;
                const imgY = d.y;
                const imgW = side;
                const imgH = hr * Math.sqrt(3);

                // cover-scale logic
                const scaleX = imgW / 300;
                const scaleY = imgH / 300;
                const coverScale = Math.max(scaleX, scaleY);
                const scaledW = 300 * coverScale;
                const scaledH = 300 * coverScale;
                const offsetX = (imgW - scaledW) / 2;
                const offsetY = (imgH - scaledH) / 2;

                return (
                  <g key={`hex-${d.index}`}>
                    {/* A) Unscaled path to handle pointer events */}
                    <path
                      d={hexPath}
                      fill="transparent"
                      transform={`translate(${imgX}, ${imgY})`}
                      onMouseEnter={() => setHoveredIndex(d.index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleHexClick(d.index)}
                      style={{
                        pointerEvents: "all",
                        cursor: "pointer"
                      }}
                    />

                    {/* B) Visual group that shrinks/grows on hover */}
                    <g
                      transform={`translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})`}
                      style={{
                        transition: "transform 0.15s ease-out",
                        pointerEvents: "none"
                      }}
                    >
                      {/* Clipped image */}
                      <g clipPath={`url(#clip-hex-${d.index})`}>
                        <g transform={`translate(${imgX}, ${imgY})`}>
                          <g
                            transform={`translate(${offsetX}, ${offsetY}) scale(${coverScale})`}
                          >
                            <image
                              xlinkHref={d.item.thumbUrl}
                              width={300}
                              height={300}
                              preserveAspectRatio="none"
                              style={{ pointerEvents: "none" }}
                            />
                          </g>
                        </g>
                      </g>

                      {/* Optional border */}
                      <path
                        d={hexPath}
                        fill="none"
                        stroke="black"
                        strokeWidth={2}
                        transform={`translate(${imgX}, ${imgY})`}
                        style={{ pointerEvents: "none" }}
                      />
                    </g>
                  </g>
                );
              })}
            </svg>
          );
        })()}
      </div>

      {/* Fullscreen Overlay */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-20"
          onClick={closeFullscreen}
        >
          <img
            src={selectedPhoto}
            alt=""
            className="max-w-[90%] max-h-[80%] object-contain mb-4"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex justify-center items-center w-full">
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-[#ffebcd] text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${
                selectedIndex === 0 ? "opacity-0" : "opacity-100"
              }`}
              onClick={handlePrevious}
            >
              &lt;
            </button>
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-[#ffebcd] text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${
                selectedIndex === photos.length - 1
                  ? "opacity-0"
                  : "opacity-100"
              }`}
              onClick={handleNext}
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">
        Copyright © 2024-2025 Ilan Rosenbaum. All rights reserved.
      </div>
    </div>
  );
};

export default TiledPlane;
