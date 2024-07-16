import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import BackButton from "./BackButton";

export interface HexagonConfig {
  targetLevels: Record<string, number>;
  styles: Record<string, { fill: string; opacity: number }>;
  actions: Record<string, (hexagonId: number) => void>;
  images: Record<string, string>;
  text: Record<number, string>;
  textSize?: string;
  title?: string;
  titleSize?: string;
  imageId?: string;
  textColor?: string;
  dropShadow?: string;
  backButton: {
    exists: boolean;
    to?: string;
    textColor?: string;
  };
  config?: Record<string, HexagonConfig>;
}

// The minimum SierpinskiHexagon config to be used for edits to sub hexagons
export const minConfig: HexagonConfig = {
  targetLevels: {
    right: 0,
    bottomRight: 0,
    bottomLeft: 0,
    left: 0,
    topLeft: 0,
    topRight: 0
  },
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  actions: {
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    }
  },
  images: {},
  text: {},
  backButton: {
    exists: false
  }
};

function generateUniqueId(config: HexagonConfig, section: string): string {
  return `image-fill-${config.imageId || config.title || "root"}-${section}`.replace(/\s+/g, "-").toLowerCase();
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

function throttle<F extends (...args: any[]) => any>(func: F, limit: number): (...args: Parameters<F>) => void {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  return function (this: any, ...args: Parameters<F>) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

const transition = (element: SVGGElement, respectTo: SVGGElement, scale: number) => {
  d3.select(element)
    .transition()
    .duration(200)
    .ease(d3.easeCubicInOut)
    .attr("transform", function () {
      const bbox = respectTo.getBoundingClientRect();
      return `translate(${bbox.x + bbox.width / 2}, ${bbox.y + bbox.height / 2}) scale(${scale}) translate(${-bbox.x - bbox.width / 2}, ${-bbox.y - bbox.height / 2})`;
    });
};

const SierpinskiHexagon: React.FC<{ config: HexagonConfig }> = ({ config }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;
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

    const drawHexagon = (x: number, y: number, size: number, level: number, section: string, currentConfig: HexagonConfig, isMainHexagon: boolean, parentConfig?: HexagonConfig) => {
      if (level <= 0) return;

      const currentHexagonId = hexagonCounter;
      const targetLevel = currentConfig.targetLevels[section];
      const group = svg.append("g").attr("class", `hexagon-group-${level < 4 ? currentHexagonId : 0}`);

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
          const newSection = Object.keys(currentConfig.targetLevels)[index];
          drawHexagon(x + dx, y + dy, size / 3, level - 1, newSection, currentConfig, isMainHexagon, currentConfig);
        });
      } else {
        if (level > targetLevel) {
          offsets.forEach(([dx, dy]) => {
            drawHexagon(x + dx, y + dy, size / 3, level - 1, section, currentConfig, isMainHexagon, currentConfig);
          });
        }
      }

      // Recursively draw new hexagon with specific config if exists before drawing the current hexagon
      if (level === 3 && currentConfig.config && currentConfig.config[section]) {
        drawHexagon(x, y, size, 4, section, currentConfig.config[section], false, currentConfig);
      }

      if (level === targetLevel) {
        const hexagon = createHexagon(x, y, size);
        const style = currentConfig.styles[section] || currentConfig.styles.default;

        const hexagonPolygon = group
          .append("polygon")
          .attr("points", hexagon.map((p) => p.join(",")).join(" "))
          .attr("stroke", "black")
          .attr("stroke-width", "0.4")
          .attr("opacity", style.opacity)
          .style("filter", `drop-shadow(0 0px 1em ${currentConfig.dropShadow !== undefined ? hexToRgbA(currentConfig.dropShadow) : "rgba(75, 0, 130, 0.5))"}`);

        // Add class if not a main hexagon
        if (!isMainHexagon) {
          hexagonPolygon.attr("class", `sub-hexagon-${currentHexagonId}`);
        }

        // Apply click action for the subHexagons if level below 3
        group
          .append("polygon")
          .attr("points", hexagon.map((p) => p.join(",")).join(" "))
          .attr("fill", "transparent")
          .style("pointer-events", "fill");

        // Apply specific click action for the hexagon
        group.on("click", () => {
          // Get the section corresponding to the current hexagon ID
          const currentSection = Object.keys(currentConfig.targetLevels)[currentHexagonId - 1];
          const action = config.actions[currentSection] || config.actions.default;
          action(currentHexagonId);
          setIsTransitioning(true);
        });

        // Check for images in both current and parent configs
        const imageSource = currentConfig.images[section] || (parentConfig && parentConfig.images[section]);
        if (imageSource) {
          const uniqueId = generateUniqueId(currentConfig.images[section] ? currentConfig : parentConfig!, section);
          hexagonPolygon.attr("fill", `url(#${uniqueId})`).attr("opacity", style.opacity);
        } else {
          hexagonPolygon.attr("fill", style.fill);
        }
      }

      if (level === 3 && isMainHexagon) {
        const hexagon = createHexagon(x, y, size);
        const [centerX, centerY] = getHexagonCenter(hexagon);

        group
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", currentConfig.textColor || "#ffefdb")
          .style("font-size", config.textSize || "2em")
          .style("font-family", "Courier new, monospace")
          .style("font-weight", "500")
          .style("text-shadow", "0em 0em 0.1em rgba(0, 0, 0, 1)")
          .text(`${currentConfig.text[hexagonCounter] || ""}`)
          .style("opacity", 0)
          .transition()
          .duration(500)
          .ease(d3.easeCubicInOut)
          .style("opacity", 1);

        group
          .append("polygon")
          .attr("points", hexagon.map((p) => p.join(",")).join(" "))
          .attr("fill", "transparent")
          .style("pointer-events", "fill")
          .attr("id", `hexagon-${currentHexagonId}`)
          .style("opacity", 0);

        group.attr("data-scale", "1");

        // Apply specific click action for the hexagon
        if (targetLevel === 0) {
          group.on("click", () => {
            setIsTransitioning(true);
            const action = currentConfig.actions[section] || function () {};
            action(currentHexagonId);
          });
        } else if (targetLevel !== 3) {
          group.on("click", () => {
            setIsTransitioning(true);
            const action = currentConfig.actions[section] || config.actions.default;
            action(currentHexagonId);
          });
        } else {
          group.on("click", () => {
            const action = currentConfig.actions[section] || config.actions.default;
            action(currentHexagonId);
          });
        }

        hexagonCounter++;
      }

      if (level === 4) {
        const hexagon = createHexagon(x, y, size);
        const [centerX, centerY] = getHexagonCenter(hexagon);

        group
          .append("polygon")
          .attr("points", hexagon.map((p) => p.join(",")).join(" "))
          .attr("fill", "transparent")
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
          .style("font-size", currentConfig.titleSize || config.titleSize || "2em")
          .style("font-family", "Courier New, monospace")
          .style("text-shadow", "0em 0em 0.2em rgba(143, 107, 143, 1)")
          .text(currentConfig.title || "");

        if (currentConfig.title !== config.title) {
          group.style("opacity", 0).transition().duration(500).ease(d3.easeCubicInOut).style("opacity", 1);
        }
      }
    };

    // Clear SVG content before drawing
    svg.selectAll("*").remove();

    const addPatterns = (config: HexagonConfig, parentId: string = "") => {
      Object.keys(config.images).forEach((key) => {
        const uniqueId = generateUniqueId(config, key);
        defs
          .append("pattern")
          .attr("id", uniqueId)
          .attr("patternUnits", "objectBoundingBox")
          .attr("patternContentUnits", "objectBoundingBox")
          .attr("width", 1)
          .attr("height", 1)
          .append("image")
          .attr("xlink:href", config.images[key])
          .attr("width", 1)
          .attr("height", 1)
          .attr("preserveAspectRatio", "xMidYMid slice");
      });

      // Recursively add patterns for sub-configurations
      if (config.config) {
        Object.entries(config.config).forEach(([subSection, subConfig]) => {
          addPatterns(subConfig, `${parentId}-${subSection}`);
        });
      }
    };

    // Add image patterns for hexagons defined in config
    const defs = svg.append("defs");
    addPatterns(config);

    // Update the initial draw call to use the maximum target level + 2
    const maxTargetLevel = 4;
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

    const centerX = width / 2;
    const centerY = height / 2;
    drawHexagon(centerX, centerY, hexagonWidth / 2, maxTargetLevel, "center", config, true);

    function isPointInHexagon(px: number, py: number, cx: number, cy: number, size: number, bufferSize: number = 1.1): "inside" | "buffer" | "outside" {
      const dx = Math.abs(px - cx);
      const dy = Math.abs(py - cy);

      const height = size * Math.sqrt(3);
      const bufferHeight = height * bufferSize;

      // Helper function to check if point is inside a hexagon of given size
      const insideHex = (s: number, h: number) => dx <= s && dy <= h / 2 && (h / 2) * s - (h / 4) * dx - s * dy >= 0;

      // Check if point is outside the buffer zone
      if (!insideHex(size * bufferSize, bufferHeight)) return "outside";

      // Check if point is inside the actual hexagon
      if (insideHex(size, height)) return "inside";

      // If it's neither inside nor outside, it's in the buffer zone
      return "buffer";
    }

    const handleMouseMove = throttle((event: MouseEvent) => {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const svgRect = svgElement.getBoundingClientRect();
      const mouseX = event.clientX - svgRect.left;
      const mouseY = event.clientY - svgRect.top;

      console.log(`Mouse position: (${mouseX}, ${mouseY})`);

      for (let i: number = 1; i < 7; i++) {
        const respectTo = d3.select(`#hexagon-${i}`).node() as SVGGElement;
        if (!respectTo) continue;

        const hexagonGroup = d3.selectAll(`.hexagon-group-${i}`);
        const bbox = respectTo.getBoundingClientRect();

        const centerX = bbox.left - svgRect.left + bbox.width / 2;
        const centerY = bbox.top - svgRect.top + bbox.height / 2;
        const hexagonSize = bbox.width / 2;

        const position = isPointInHexagon(mouseX, mouseY, centerX, centerY, hexagonSize);

        console.log(`Hexagon ${i}: center(${centerX}, ${centerY}), size: ${hexagonSize}, position: ${position}`);

        hexagonGroup.each(function () {
          const element = this as SVGGElement;
          const currentScale = d3.select(element).attr("data-scale");
          let targetScale: number;

          switch (position) {
            case "inside":
              targetScale = 0.9;
              break;
            case "outside":
              targetScale = 1;
              break;
            case "buffer":
              // Do nothing in the buffer zone
              return;
          }

          if (currentScale !== targetScale.toString()) {
            transition(element, respectTo, targetScale);
            d3.select(element).attr("data-scale", targetScale);
            console.log(`Hexagon ${i} scale changed to ${targetScale}`);
          }
        });
      }
    }, 200); // 200ms throttle

    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup function
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [config, isTransitioning]);

  useEffect(() => {
    console.log("isTransitioning:", isTransitioning); // Don't delete this lol
  }, [isTransitioning]);

  return (
    <div className="h-screen w-screen bg-black/90 fixed">
      <div className="absolute pt-8 pl-8 z-10">{config.backButton.exists && <BackButton textColor={config.textColor || "#ffefdb"} color={config.styles["default"].fill || "#603b61"} to={config.backButton.to || "/"} />}</div>
      <div className="items-center justify-center">
        <svg ref={svgRef} style={{ position: "relative", zIndex: 1 }} />
      </div>
    </div>
  );
};

export default SierpinskiHexagon;
