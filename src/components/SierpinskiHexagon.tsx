import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const SierpinskiHexagon: React.FC = () => {
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

      const drawHexagon = (x: number, y: number, size: number, level: number, targetLevel: number) => {
        if (level === 0) return;

        const offsets = [
          [size / 1.5, 0],
          [size / 3, (Math.sqrt(3) / 3) * size],
          [-size / 3, (Math.sqrt(3) / 3) * size],
          [-size / 1.5, 0],
          [-size / 3, -(Math.sqrt(3) / 3) * size],
          [size / 3, -(Math.sqrt(3) / 3) * size]
        ];

        offsets.forEach(([dx, dy]) => {
          drawHexagon(x + dx, y + dy, size / 3, level - 1, targetLevel);
        });

        if (level === targetLevel) {
          const hexagon = createHexagon(x, y, size);
          svg
            .append("polygon")
            .attr("points", hexagon.map((p) => p.join(",")).join(" "))
            .attr("stroke", "black")
            .attr("stroke-width", "0.4")
            .attr("fill", "#603b61")
            .style("filter", "drop-shadow(0 4px 8px rgba(143, 107, 143, 0.2)) drop-shadow(0 6px 20px rgba(143, 107, 143, 0.1))");
        }

        if (level === targetLevel + 1) {
          const hexagon = createHexagon(x, y, size);
          const group = svg.append("g").attr("class", "hexagon-group");
          const currentHexagonId = hexagonCounter;

          group
            .append("polygon")
            .attr("points", hexagon.map((p) => p.join(",")).join(" "))
            .attr("fill", "transparent")
            .attr("id", `hexagon-${currentHexagonId}`)
            .style("cursor", "pointer");

          const [centerX, centerY] = getHexagonCenter(hexagon);

          group
            .append("text")
            .attr("x", centerX)
            .attr("y", centerY)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "black")
            .style("pointer-events", "none")
            .style("font-size", "1.5em")
            .style("font-family", "Courier New, monospace")
            .style("font-weight", "500")
            .text(`Hex ${currentHexagonId}`);

          group.on("click", () => {
            alert(`Hexagon ${currentHexagonId} clicked!`);
          });

          hexagonCounter++;
        }

        if (level === targetLevel + 2) {
          const hexagon = createHexagon(x, y, size);
          const group = svg.append("g").attr("class", "hexagon-group");
          const currentHexagonId = hexagonCounter;

          group
            .append("polygon")
            .attr("points", hexagon.map((p) => p.join(",")).join(" "))
            .attr("fill", "transparent")
            .attr("id", `hexagon-${currentHexagonId}`)
            .style("cursor", "pointer");

          const [centerX, centerY] = getHexagonCenter(hexagon);

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
            .text(`Bestagons`);
        }
      };

      svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", width)
        .attr("height", height);

      const centerX = width / 2;
      const centerY = height / 2;

      drawHexagon(centerX, centerY, hexagonWidth / 2, 3, 1);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black/85">
      <svg ref={svgRef} />
    </div>
  );
};

export default SierpinskiHexagon;
