import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import BackButton from "./BackButton";
import { throttle } from "./SierpinskiHexagon";
import { storage } from "./../firebase";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { imageCache } from "./ImageCache";

interface TiledPlaneProps {
  photoPath: string;
  backTo?: string;
}

const PAGE_SIZE = 6;

const TiledPlane: React.FC<TiledPlaneProps> = ({ photoPath, backTo }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fullscreen state
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Firebase references
  const [allPhotoRefs, setAllPhotoRefs] = useState<any[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  // Prevent multiple loads at once
  const loadingRef = useRef(false);

  // Track which hex is hovered
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPhotoRefs = async () => {
      try {
        const folderRef = ref(storage, photoPath);
        const result = await listAll(folderRef);

        const itemsWithMetadata = await Promise.all(
          result.items.map(async (item) => {
            const metadata = await getMetadata(item);
            return {
              ref: item,
              updated: metadata.updated || metadata.timeCreated,
            };
          })
        );

        const sortedRefs = itemsWithMetadata
          .sort(
            (a, b) =>
              new Date(b.updated).getTime() - new Date(a.updated).getTime()
          )
          .map((item) => item.ref);

        setAllPhotoRefs(sortedRefs);
      } catch (err) {
        console.error("Error fetching photo refs:", err);
      }
    };

    fetchPhotoRefs();

    return () => {
      setPhotos([]);
      setLoadedCount(0);
      loadingRef.current = false;
    };
  }, [photoPath]);

  const loadNextBatch = useCallback(async () => {
    if (loadingRef.current || loadedCount >= allPhotoRefs.length) return;

    loadingRef.current = true;
    const endIndex = Math.min(loadedCount + PAGE_SIZE, allPhotoRefs.length);
    const batch = allPhotoRefs.slice(loadedCount, endIndex);

    try {
      const urls = await Promise.all(
        batch.map(async (item) => {
          const url = await getDownloadURL(item);
          await imageCache.getImage(url);
          return url;
        })
      );

      setPhotos((prev) => {
        const newPhotos = [...prev];
        for (const url of urls) {
          if (!newPhotos.includes(url)) newPhotos.push(url);
        }
        return newPhotos;
      });

      setLoadedCount(endIndex);
    } catch (error) {
      console.error("Error loading batch:", error);
    } finally {
      loadingRef.current = false;
    }
  }, [allPhotoRefs, loadedCount]);

  useEffect(() => {
    if (allPhotoRefs.length) {
      loadNextBatch();
    }
  }, [allPhotoRefs, loadNextBatch]);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateContainerSize() {
      if (!containerRef.current) return;
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, []);

  const hexData = useMemo(() => {
    const { width, height } = containerSize;
    if (!width || !height || photos.length === 0) return [];

    const hexRadius = width > height ? height / 4 : width / 6;
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;

    const centerX = width / 2;
    const columnOffsetX = hexWidth * 0.75;
    const rowOffsetY = hexHeight;

    const columns = [0, -1, 1];
    let photoIndex = 0;
    let row = 0;

    const tmp: { x: number; y: number; url: string; index: number }[] = [];

    while (photoIndex < photos.length) {
      for (const col of columns) {
        if (photoIndex >= photos.length) break;

        const x = centerX + col * columnOffsetX - hexWidth / 2;
        const y =
          row * rowOffsetY + (Math.abs(col) === 1 ? rowOffsetY / 2 : 0);

        tmp.push({
          x,
          y,
          url: photos[photoIndex],
          index: photoIndex,
        });

        photoIndex++;
      }
      row++;
    }

    return tmp;
  }, [containerSize, photos]);

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

  const handleScroll = throttle((e: React.UIEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;
    const target = e.currentTarget;
    
    const scrollPosition = target.scrollTop + target.clientHeight;
    const scrollThreshold = target.scrollHeight * 0.8;
  
    if (scrollPosition > scrollThreshold && !loadingRef.current) {
      setLoadedCount((prev) => prev + PAGE_SIZE);
    }
  }, 200);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedPhoto(photos[selectedIndex + 1]);
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedPhoto(photos[selectedIndex - 1]);
    }
  };

  const closeFullscreen = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      setSelectedPhoto(null);
      setSelectedIndex(null);
    }
  };

  return (
    <div className="h-screen w-screen bg-black/90 flex flex-col items-center">
      <div className="absolute top-[2vw] left-[2vw] z-10">
        <BackButton textColor="#ffefdb" color="#603b61" to={backTo || ""} />
      </div>

      <div
        ref={containerRef}
        className="w-screen h-[calc(80dvh)] mt-[max(9vw,9vh)] mb-[calc(6dvh)] custom-scrollbar overflow-auto"
        onScroll={handleScroll}
      >
        {(() => {
          const rowCount = Math.ceil(photos.length / 3);
          const { width, height } = containerSize;
          const hexRadius = width > height ? height / 4 : width / 6;
          const hexHeight = hexRadius * Math.sqrt(3);
          const svgHeight = Math.max(height, rowCount * hexHeight + hexHeight);

          return (
            <svg
              width={width}
              height={svgHeight}
              className="mx-auto block"
              style={{ overflow: "visible" }}
            >
              <defs>
                {hexData.map((d) => {
                  const patternId = `image-${d.index}`;
                  const hr = width > height ? height / 4 : width / 6;
                  const w = hr * 2;
                  const h = hr * Math.sqrt(3);

                  return (
                    <pattern
                      key={patternId}
                      id={patternId}
                      x={0}
                      y={0}
                      width={w}
                      height={h}
                      patternUnits="userSpaceOnUse"
                    >
                      <image
                        xlinkHref={d.url}
                        x={0}
                        y={0}
                        width={w}
                        height={h}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </pattern>
                  );
                })}
              </defs>

              {hexData.map((d) => {
                const hr = width > height ? height / 4 : width / 6;
                const side = hr * 2;
                const cx = d.x + side / 2;
                const cy = d.y + hr;
                const isHovered = hoveredIndex === d.index;
                const scale = isHovered ? 0.92 : 1;

                return (
                  <g
                    key={`hex-${d.index}`}
                    transform={`translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})`}
                    style={{
                      transition: "transform 0.15s ease-out",
                      cursor: "pointer",
                    }}
                  >
                    {/* Invisible larger hit area for hover detection */}
                    <path
                      d={hexPath}
                      fill="transparent"
                      transform={`translate(${d.x}, ${d.y}) scale(1.1)`}
                      onMouseEnter={() => setHoveredIndex(d.index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{ pointerEvents: "all" }}
                    />
                    {/* Visible hexagon */}
                    <path
                      d={hexPath}
                      fill={`url(#image-${d.index})`}
                      stroke="black"
                      strokeWidth={2}
                      transform={`translate(${d.x}, ${d.y})`}
                      onClick={() => {
                        setSelectedPhoto(d.url);
                        setSelectedIndex(d.index);
                      }}
                      style={{ pointerEvents: "none" }}
                    />
                  </g>
                );
              })}
            </svg>
          );
        })()}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20"
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

      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">
        Copyright © 2024 Ilan Rosenbaum All rights reserved.
      </div>
    </div>
  );
};

export default TiledPlane;
