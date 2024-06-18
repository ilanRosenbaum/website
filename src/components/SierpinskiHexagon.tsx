import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import BackButton from "./BackButton";
interface HexagonConfig {
  targetLevels: Record<string, number>;
  styles: Record<string, { fill: string; opacity: number }>;
  actions: Record<string, (hexagonId: number) => void>;
  images: Record<string, string>;
  text: Record<number, string>;
  title: string;
  textColor?: string;
  dropShadow?: string;
  backButton: {
    exists: boolean;
    to?: string;
    textColor?: string;
  };
}

interface SierpinskiHexagonProps {
  config: HexagonConfig;
}

function hexToRgbA(hex: string, opacity: number = 0.5) {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c: any = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + `,${opacity})`;
  }
  throw new Error("Bad Hex");
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
          offsets.forEach(([dx, dy]) => {
            drawHexagon(x + dx, y + dy, size / 3, level - 1, section);
          });
        }

        const targetLevel = config.targetLevels[section];

        if (level === targetLevel) {
          const hexagon = createHexagon(x, y, size);
          const style = config.styles[section] || config.styles.default;

          const hexagonPolygon = group
            .append("polygon")
            .attr("points", hexagon.map((p) => p.join(",")).join(" "))
            .attr("stroke", "black")
            .attr("stroke-width", "0.4")
            .attr("opacity", style.opacity)
            .attr("id", `hexagon-${currentHexagonId}`)
            .style("filter", `drop-shadow(0 0px 1em ${config.dropShadow !== undefined ? hexToRgbA(config.dropShadow) : "rgba(75, 0, 130, 0.5))"}`)
            .style("cursor", level === targetLevel + 2 ? "pointer" : "default")
            .style("pointer-events", level === targetLevel ? "all" : "none");

          if (config.images[section]) {
            hexagonPolygon.attr("fill", `url(#image-fill-${section})`);
          } else {
            hexagonPolygon.attr("fill", style.fill);
          }
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
            .attr("fill", config.textColor || "#ffefdb")
            .style("font-size", "2em")
            .style("font-family", "Courier new, monospace")
            .style("font-weight", "500")
            .style("text-shadow", "0em 0em 0.1em rgba(0, 0, 0, 1)")
            .text(`${config.text[hexagonCounter]}`);

          group
            .append("polygon")
            .attr("points", hexagon.map((p) => p.join(",")).join(" "))
            .attr("fill", "transparent")
            .style("pointer-events", "fill");

          // Apply specific click action for the hexagon
          group.on("click", () => {
            const action = config.actions[section] || config.actions.default;
            action(currentHexagonId);
          });

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
            .attr("fill", "#ffebcd")
            .style("pointer-events", "none")
            .style("font-size", "2em")
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
        defs
          .append("pattern")
          .attr("id", `image-fill-${key}`)
          .attr("patternUnits", "objectBoundingBox")
          .attr("patternContentUnits", "objectBoundingBox")
          .attr("width", 1)
          .attr("height", 1)
          .append("image")
          .attr("xlink:href", config.images[key]) // Use the local image path
          .attr("width", 1)
          .attr("height", 1)
          .attr("preserveAspectRatio", "xMidYMid slice") // Ensure the image is scaled proportionally to cover the entire area.
          .attr("opacity", 0.5); // Set the opacity to make the image slightly translucent.
      });

      // Update the initial draw call to use the maximum target level + 2
      const maxTargetLevel = 4;
      svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

      const centerX = width / 2;
      const centerY = height / 2;
      drawHexagon(centerX, centerY, hexagonWidth / 2, maxTargetLevel, "center");
    }
  }, [config]);

  return (
    <div className="h-screen w-screen bg-black/90 fixed">
      <div className="absolute pt-8 pl-8">{config.backButton.exists && <BackButton textColor={config.textColor || "black"} color={config.styles["default"].fill || "black"} to={config.backButton.to || "/"} />}</div>
      <div className="items-center justify-center">
        <svg ref={svgRef} />
      </div>
    </div>
  );
};

export default SierpinskiHexagon;
