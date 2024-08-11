import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import BackButton from "./BackButton";
import { throttle } from "./SierpinskiHexagon";
import { storage } from "./../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { imageCache } from "./ImageCache";

interface TiledPlaneProps {
  photoPath: string;
  backTo?: string;
}

export const isPointInHexagon = (px: number, py: number, cx: number, cy: number, size: number): boolean => {
  const dx = Math.abs(px - cx);
  const dy = Math.abs(py - cy);
  const r = size / 2;
  return dx <= (r * Math.sqrt(3)) / 2 && dy <= r && r * Math.sqrt(3) * dx + r * dy <= (r * r * 3) / 2;
};

const TiledPlane: React.FC<TiledPlaneProps> = ({ photoPath, backTo }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const folderRef = ref(storage, photoPath);
      try {
        const result = await listAll(folderRef);

        // Reverse the items array before processing
        const reversedItems = result.items.reverse();

        const urls = await Promise.all(
          reversedItems.map(async (item) => {
            const url = await getDownloadURL(item);
            // Preload image
            await imageCache.getImage(url);
            return url;
          })
        );
        setPhotos(urls);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [photoPath]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || photos.length === 0) return;

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

    const drawHexagon = async (photo: string, col: number, row: number, index: number) => {
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
          setSelectedPhoto(photo);
          setSelectedIndex(index);
        });

      const defs = svg.append("defs");
      const pattern = defs.append("pattern").attr("id", `image-${col}-${row}`).attr("patternUnits", "objectBoundingBox").attr("width", "100%").attr("height", "100%");

      const imageUrl = await imageCache.getImage(photo);
      pattern.append("image").attr("xlink:href", imageUrl).attr("width", hexWidth).attr("height", hexHeight).attr("preserveAspectRatio", "xMidYMid slice");
    };

    let photoIndex = 0;
    let row = 0;
    const columns = [0, -1, 1];

    svg.selectAll("*").remove();
    const drawHexagons = async () => {
      while (photoIndex < photos.length) {
        for (const col of columns) {
          if (photoIndex < photos.length) {
            await drawHexagon(photos[photoIndex], col, row, photoIndex);
            photoIndex++;
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
  }, [photos]);

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
    if (e.target === e.currentTarget) {
      setSelectedPhoto(null);
      setSelectedIndex(null);
    }
  };

  return (
    <div className="h-screen w-screen bg-black/90 flex flex-col items-center">
      <div className="absolute top-[2vw] left-[2vw] z-10">
        <BackButton textColor="#ffefdb" color="#603b61" to={backTo || ""} />
      </div>
      <div ref={containerRef} className="w-screen h-[calc(80dvh)] mt-[max(9vw,9vh)] mb-[calc(6dvh)] custom-scrollbar">
        <svg ref={svgRef} className="mx-auto"></svg>
      </div>
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20" onClick={closeFullscreen}>
          <img src={selectedPhoto} alt="" className="max-w-[90%] max-h-[80%] object-contain mb-4" onClick={(e) => e.stopPropagation()} />
          <div className="flex justify-center items-center w-full">
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-[#ffebcd] text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${selectedIndex === 0 ? "opacity-0" : "opacity-100"}`}
              onClick={handlePrevious}
            >
              &lt;
            </button>
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-[#ffebcd] text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${selectedIndex === photos.length - 1 ? "opacity-0" : "opacity-100"}`}
              onClick={handleNext}
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

export default TiledPlane;
