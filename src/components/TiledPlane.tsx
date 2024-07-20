import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import BackButton from "./BackButton";
import { throttle } from "./SierpinskiHexagon";

interface TiledPlaneProps {
  photos: string[];
  backTo?: string;
}

// This is recreated here instead of using sierpinskiHexagon implementation because they use hexagons with different aspect ratios 
const isPointInHexagon = (px: number, py: number, cx: number, cy: number, size: number): boolean => {
  const dx = Math.abs(px - cx);
  const dy = Math.abs(py - cy);
  const r = size / 2;
  return (dx <= r * Math.sqrt(3) / 2) && (dy <= r) && (r * Math.sqrt(3) * dx + r * dy <= r * r * 3 / 2);
};

const TiledPlane: React.FC<TiledPlaneProps> = ({ photos, backTo }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const hexRadius = width / 11;
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

    const drawHexagon = (photo: string, col: number, row: number) => {
      const x = centerX + col * columnOffsetX - hexWidth / 2;
      const y = row * rowOffsetY + (Math.abs(col) % 2 === 1 ? rowOffsetY / 2 : 0);

      const hexagon = svg.append("g")
        .attr("class", `hexagon hexagon-${col}-${row}`);

      hexagon
        .append("path")
        .attr("d", createHexagonPath(0, 0))
        .attr("fill", `url(#image-${col}-${row})`)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("transform", `translate(${x}, ${y})`)
        .on("click", () => setSelectedPhoto(photo));

      const defs = svg.append("defs");
      defs
        .append("pattern")
        .attr("id", `image-${col}-${row}`)
        .attr("patternUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("image")
        .attr("xlink:href", photo)
        .attr("width", hexWidth)
        .attr("height", hexHeight)
        .attr("preserveAspectRatio", "xMidYMid slice");
    };

    let photoIndex = 0;
    let row = 0;
    const columns = [0, -1, 1];

    svg.selectAll("*").remove();
    while (photoIndex < photos.length) {
      for (const col of columns) {
        if (photoIndex < photos.length) {
          drawHexagon(photos[photoIndex], col, row);
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

    const handleMouseMove = throttle((event: MouseEvent) => {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const svgRect = svgElement.getBoundingClientRect();
      const mouseX = event.clientX - svgRect.left;
      const mouseY = event.clientY - svgRect.top;

      svg.selectAll(".hexagon")
        .each(function(this) {
          if (!this) return;
          if (!(this instanceof SVGElement)) return;
          
          const hexagon = d3.select(this);
          const hexBBox = this.getBoundingClientRect();
          const hexCenterX = hexBBox.x + hexBBox.width / 2 - svgRect.left;
          const hexCenterY = hexBBox.y + hexBBox.height / 2 - svgRect.top;

          if (isPointInHexagon(mouseX, mouseY, hexCenterX, hexCenterY, hexWidth)) {
            hexagon.transition()
              .duration(100)
              .attr("transform", `translate(${hexCenterX}, ${hexCenterY}) scale(0.9) translate(${-hexCenterX}, ${-hexCenterY})`);
          } else {
            hexagon.transition()
              .duration(100)
              .attr("transform", "scale(1)");
          }
        });
    }, 50);

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [photos]);

  return (
    <div className="h-screen w-screen bg-black/90 flex flex-col items-center">
      <div className="absolute top-8 left-8 z-10">
        <BackButton textColor="#ffefdb" color="#603b61" to={backTo || ""} />
      </div>
      <div ref={containerRef} className="w-full h-full mt-8 mb-8 overflow-y-auto">
        <svg ref={svgRef} className="mx-auto"></svg>
      </div>
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20" onClick={() => setSelectedPhoto(null)}>
          <img src={selectedPhoto} alt="Selected photo" className="max-w-[60%] max-h-[90%] object-contain" />
        </div>
      )}
    </div>
  );
};

export default TiledPlane;