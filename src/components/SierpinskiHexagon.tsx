import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface HexagonConfig {
  targetLevels: Record<string, number>;
  styles: Record<string, { fill: string; opacity: number }>;
  actions: Record<string, (hexagonId: number) => void>;
  images: Record<string, string>;
  text: Record<number, string>;
  title: string;
}

interface SierpinskiHexagonProps {
  config: HexagonConfig;
}

const SierpinskiHexagon: React.FC<SierpinskiHexagonProps> = ({ config }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const hexagonWidth = window.innerHeight;
      let hexagonCounter = 1;

      const createHexagon = (x: number, y: number, size: number): [number, number][] => {
        const points: [number, number][] = d3.range(6).map((i) => {
          const angle = (i * Math.PI) / 3;
          return [Math.cos(angle) * size + x, Math.sin(angle) * size + y];
        });
        return points;
      };

      const getHexagonCenter = (points: [number, number][]) => {
        const x = points.reduce((acc, point) => acc + point[0], 0) / points.length;
        const y = points.reduce((acc, point) => acc + point[1], 0) / points.length;
        return [x, y];
      };

      const drawHexagon = (x: number, y: number, size: number, level: number, section: string) => {
        const group = svg.append("g").attr("class", "hexagon-group");
        const currentHexagonId = hexagonCounter;

        if (level <= 0) return;

        const offsets = [
          [size / 1.5, 0],
          [size / 3, (Math.sqrt(3) / 3) * size],
          [-size / 3, (Math.sqrt(3) / 3) * size],
          [-size / 1.5, 0],
          [-size / 3, -(Math.sqrt(3) / 3) * size],
          [size / 3, -(Math.sqrt(3) / 3) * size]
        ];

        if (level > 3) {
          offsets.forEach(([dx, dy], index) => {
            const newSection = Object.keys(config.targetLevels)[index];
            drawHexagon(x + dx, y + dy, size / 3, level - 1, newSection);
          });
        } else {
          offsets.forEach(([dx, dy], index) => {
            drawHexagon(x + dx, y + dy, size / 3, level - 1, section);
          });
        }

        const targetLevel = config.targetLevels[section];

        if (level === targetLevel) {
          const hexagon = createHexagon(x, y, size);
          const style = config.styles[section] || config.styles.default;

          group
            .append("polygon")
            .attr("points", hexagon.map((p) => p.join(",")).join(" "))
            .attr("stroke", "black")
            .attr("stroke-width", "0.4")
            .attr("fill", style.fill)
            .attr("opacity", style.opacity)
            .attr("id", `hexagon-${currentHexagonId}`)
            .style("filter", "drop-shadow(0 0px 1em rgba(75, 0, 130, 0.5))")
            .style("cursor", level === targetLevel + 2 ? "pointer" : "default")
            .style("pointer-events", level === targetLevel ? "all" : "none");

          // Apply specific click action for the hexagon
          group.on("click", () => {
            const action = config.actions[section] || config.actions.default;
            action(currentHexagonId);
          });

        }

        if (level === 3) {
          const hexagon = createHexagon(x, y, size);
          const [centerX, centerY] = getHexagonCenter(hexagon);

          group
            .append("text")
            .attr("x", centerX)
            .attr("y", centerY)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "black")
            .style("pointer-events", "none")
            .style("font-size", "2em")
            .style("font-family", "Courier new, monospace")
            .style("font-weight", "500")
            .style("cursor", "pointer")
            .style("text-shadow", "0em 0em 0.1em rgba(0, 0, 0, 1)")
            .text(`${config.text[hexagonCounter]}`);

          hexagonCounter++;
        }

        if (level === 4) {
          const hexagon = createHexagon(x, y, size);
          const [centerX, centerY] = getHexagonCenter(hexagon);

          group
            .append("polygon")
            .attr("points", hexagon.map((p) => p.join(",")).join(" "))
            .attr("fill", "transparent")
            .attr("id", `hexagon-${currentHexagonId}`)
            .style("cursor", "pointer")
            .style("pointer-events", "none");

          group
            .append("text")
            .attr("x", centerX)
            .attr("y", centerY)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "black")
            .style("pointer-events", "none")
            .style("font-size", "3em")
            .style("font-family", "Courier New, monospace")
            .style("font-weight", "500")
            .style("text-shadow", "0em 0em 0.2em rgba(143, 107, 143, 1)")
            .text(config.title);
        }
      };

      // Clear SVG content before drawing
      svg.selectAll("*").remove();

      // Add image patterns for hexagons defined in config
      const defs = svg.append("defs");
      Object.keys(config.images).forEach((key) => {
        defs.append("pattern")
          .attr("id", `image-fill-${key}`)
          .attr("patternUnits", "objectBoundingBox")
          .attr("patternContentUnits", "objectBoundingBox")
          .attr("width", 1)
          .attr("height", 1)
          .append("image")
          .attr("xlink:href", config.images[key]) // Use the local image path
          .attr("width", 1)
          .attr("height", 1)
          .attr("preserveAspectRatio", "xMidYMid meet") // Ensure the image is scaled proportionally to cover the entire area.
          .attr("opacity", 0.5); // Set the opacity to make the image slightly translucent.
      });
      

      // Update the initial draw call to use the maximum target level + 2
      const maxTargetLevel = 4;
      svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", width).attr("height", height);

      const centerX = width / 2;
      const centerY = height / 2;
      drawHexagon(centerX, centerY, hexagonWidth / 2, maxTargetLevel, "center");
    }
  }, [config]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black/85">
      <svg ref={svgRef} />
    </div>
  );
};

export default SierpinskiHexagon;
