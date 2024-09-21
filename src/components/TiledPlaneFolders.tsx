import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import BackButton from "./BackButton";
import { throttle } from "./SierpinskiHexagon";
import { storage } from "./../firebase";
import { ref, listAll, getMetadata, getDownloadURL, StorageReference } from "firebase/storage";
import { imageCache } from "./ImageCache";
import { isPointInHexagon } from "./TiledPlane";

interface TiledPlaneFoldersProps {
  parentFolder: string;
  backTo?: string;
}

interface FolderData {
  coverPhoto: string;
  allPhotos: string[];
  folderName: string;
}

const TiledPlaneFolders: React.FC<TiledPlaneFoldersProps> = ({ parentFolder, backTo }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [folderData, setFolderData] = useState<FolderData[]>([]);
  const [photoPaths, setPhotoPaths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const listFolders = async () => {
      const directoryRef = ref(storage, parentFolder);

      try {
        const result = await listAll(directoryRef);

        const folderPromises = result.prefixes.map(async (folderRef: StorageReference) => {
          const folderPath = "/Ceramics/" + folderRef.name;

          const folderContents = await listAll(ref(storage, folderPath));

          if (folderContents.items.length === 0) {
            return { path: folderPath, lastModified: new Date(0) };
          }

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

        const sortedFolders = foldersWithDates.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

        setPhotoPaths(sortedFolders.map((folder) => folder.path));
        console.log("Folders:", sortedFolders);
      } catch (error) {
        console.error("Error listing folders:", error);
      }
    };

    listFolders();
  }, [parentFolder]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const paths = Array.isArray(photoPaths) ? photoPaths : [photoPaths];
      const fetchedFolderData: FolderData[] = await Promise.all(
        paths.map(async (path) => {
          const folderRef = ref(storage, path);
          try {
            const result = await listAll(folderRef);
            const sortedItems = result.items.sort((a, b) => b.name.localeCompare(a.name));
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
          } catch (error) {
            console.error(`Error fetching photos from ${path}:`, error);
            return { coverPhoto: "", allPhotos: [], folderName: "" };
          }
        })
      );
      setFolderData(fetchedFolderData.filter((data) => data.coverPhoto !== ""));
    };

    fetchPhotos();
  }, [photoPaths]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || folderData.length === 0) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    let hexRadius: number;
    if (width > height) {
      hexRadius = height / 4;
    } else {
      hexRadius = width / 6;
    }
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;

    svg.attr("width", width).attr("height", height);

    const createHexagonPath = (x: number, y: number): string => {
      return `M${x},${y + hexRadius}
              l${hexWidth * 0.25},${hexHeight * 0.5}
              l${hexWidth * 0.5},0
              l${hexWidth * 0.25},-${hexHeight * 0.5}
              l-${hexWidth * 0.25},-${hexHeight * 0.5}
              l-${hexWidth * 0.5},0
              Z`;
    };

    const centerX = width / 2;
    const columnOffsetX = hexWidth * 0.75;
    const rowOffsetY = hexHeight;

    const drawHexagon = async (folderData: FolderData, col: number, row: number, index: number) => {
      const x = centerX + col * columnOffsetX - hexWidth / 2;
      const y = row * rowOffsetY + (Math.abs(col) % 2 === 1 ? rowOffsetY / 2 : 0);

      const hexagon = svg.append("g").attr("class", `hexagon hexagon-${col}-${row}`);

      hexagon
        .append("path")
        .attr("d", createHexagonPath(0, 0))
        .attr("fill", `url(#image-${col}-${row})`)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("transform", `translate(${x}, ${y})`)
        .on("click", () => {
          setSelectedFolder(folderData);
          setSelectedPhotoIndex(0);
        });

      const defs = svg.append("defs");
      const pattern = defs.append("pattern").attr("id", `image-${col}-${row}`).attr("patternUnits", "objectBoundingBox").attr("width", "100%").attr("height", "100%");

      const imageUrl = await imageCache.getImage(folderData.coverPhoto);
      pattern.append("image").attr("xlink:href", imageUrl).attr("width", hexWidth).attr("height", hexHeight).attr("preserveAspectRatio", "xMidYMid slice");
    };

    let folderIndex = 0;
    let row = 0;
    const columns = [0, -1, 1];

    svg.selectAll("*").remove();
    const drawHexagons = async () => {
      while (folderIndex < folderData.length) {
        for (const col of columns) {
          if (folderIndex < folderData.length) {
            await drawHexagon(folderData[folderIndex], col, row, folderIndex);
            folderIndex++;
          }
        }
        row++;
      }

      const svgHeight = (row + 1) * rowOffsetY;
      svg.attr("height", Math.max(height, svgHeight));

      if (svgHeight > height) {
        container.style.overflowY = "scroll";
      }
    };

    drawHexagons();

    const handleMouseMove = throttle((event: MouseEvent) => {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const svgRect = svgElement.getBoundingClientRect();
      const mouseX = event.clientX - svgRect.left;
      const mouseY = event.clientY - svgRect.top;

      svg.selectAll(".hexagon").each(function (this) {
        if (!this) return;
        if (!(this instanceof SVGElement)) return;

        const hexagon = d3.select(this);
        const hexBBox = this.getBoundingClientRect();
        const hexCenterX = hexBBox.x + hexBBox.width / 2 - svgRect.left;
        const hexCenterY = hexBBox.y + hexBBox.height / 2 - svgRect.top;

        if (isPointInHexagon(mouseX, mouseY, hexCenterX, hexCenterY, hexWidth)) {
          hexagon.transition().duration(100).attr("transform", `translate(${hexCenterX}, ${hexCenterY}) scale(0.9) translate(${-hexCenterX}, ${-hexCenterY})`);
        } else {
          hexagon.transition().duration(100).attr("transform", "scale(1)");
        }
      });
    }, 50);

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [folderData]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return; // Prevent multiple clicks
    if (selectedFolder && selectedPhotoIndex !== null && selectedPhotoIndex < selectedFolder.allPhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    } else {
      setIsLoading(false);
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return; // Prevent multiple clicks
    if (selectedFolder && selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    } else {
      setIsLoading(false);
    }
  };

  const closeFullscreen = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedFolder(null);
      setSelectedPhotoIndex(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Preload next and previous images
    if (selectedFolder && selectedPhotoIndex !== null) {
      const preloadImage = (index: number) => {
        if (index >= 0 && index < selectedFolder.allPhotos.length) {
          const img = new Image();
          img.src = selectedFolder.allPhotos[index];
        }
      };

      preloadImage(selectedPhotoIndex + 1); // Preload next image
      preloadImage(selectedPhotoIndex - 1); // Preload previous image
    }
  }, [selectedFolder, selectedPhotoIndex]);

  return (
    <div className="h-screen w-screen bg-black/90 flex flex-col items-center">
      <div className="absolute top-[2vw] left-[2vw] z-10">
        <BackButton textColor="#ffefdb" color="#603b61" to={backTo || ""} />
      </div>
      <div ref={containerRef} className="w-screen h-[calc(80dvh)] mt-[max(9vw,9vh)] mb-[calc(6dvh)] custom-scrollbar">
        <svg ref={svgRef} className="mx-auto"></svg>
      </div>
      {selectedFolder && selectedPhotoIndex !== null && (
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
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">Copyright © 2024 Ilan Rosenbaum All rights reserved.</div>
    </div>
  );
};

export default TiledPlaneFolders;
