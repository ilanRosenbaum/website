import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import BackButton from "./BackButton";
import { imageCache } from "./ImageCache";

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
  actions: {},
  images: {},
  text: {},
  backButton: {
    exists: false
  }
};

/**
 * Preloads images found at any level of the config.
 */
function preloadImages(config: HexagonConfig) {
  Object.values(config.images).forEach((imagePath) => {
    imageCache.getImage(imagePath);
  });

  if (config.config) {
    Object.values(config.config).forEach((subConfig) => {
      preloadImages(subConfig);
    });
  }
}

/**
 * Generates a unique ID for patterns based on the config (imageId or title) and the section.
 */
function generateUniqueId(config: HexagonConfig, section: string): string {
  const baseId = config.imageId || config.title || "root";
  return `image-fill-${baseId}-${section}`.replace(/\s+/g, "-").toLowerCase();
}

/**
 * Converts a hex color to an RGBA string with given opacity.
 */
function hexToRgbA(hex: string, opacity = 0.5) {
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

/**
 * Throttles a function call to the specified limit (milliseconds).
 */
export function throttle<F extends (...args: any[]) => any>(func: F, limit: number): (...args: Parameters<F>) => void {
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

/**
 * Handles the transition effect for a hexagon group.
 */
const transition = (element: SVGGElement, respectTo: SVGGElement, scale: number) => {
  d3.select(element)
    .transition()
    .duration(200)
    .ease(d3.easeCubicInOut)
    .attr("transform", function () {
      const bbox = respectTo.getBoundingClientRect();
      const xMid = bbox.x + bbox.width / 2;
      const yMid = bbox.y + bbox.height / 2;
      return `translate(${xMid}, ${yMid}) scale(${scale}) translate(${-xMid}, ${-yMid})`;
    });
};

/**
 * Creates the points of a single hexagon.
 */
const createHexagonPoints = (x: number, y: number, size: number): [number, number][] => {
  return d3.range(6).map((i) => {
    const angle = (i * Math.PI) / 3;
    return [Math.cos(angle) * size + x, Math.sin(angle) * size + y];
  });
};

/**
 * Returns the center (average x, y) of a polygon.
 */
const getPolygonCenter = (points: [number, number][]) => {
  const x = points.reduce((acc, point) => acc + point[0], 0) / points.length;
  const y = points.reduce((acc, point) => acc + point[1], 0) / points.length;
  return [x, y];
};

/**
 * Determines if a point (px, py) is inside, outside or in a buffer zone of a hexagon.
 */
function isPointInHexagon(px: number, py: number, cx: number, cy: number, size: number, bufferSize: number = 1.1): "inside" | "buffer" | "outside" {
  // Create hexagon points
  function createHex(centerX: number, centerY: number, s: number): [number, number][] {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i * Math.PI) / 3;
      return [centerX + s * Math.cos(angle), centerY + s * Math.sin(angle)] as [number, number];
    });
  }

  // Returns true if point is inside a polygon
  const isInsidePolygon = (point: [number, number], polygon: [number, number][]) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0],
        yi = polygon[i][1];
      const xj = polygon[j][0],
        yj = polygon[j][1];
      const intersect = yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const hexPoints = createHex(cx, cy, size);
  const bufferHexPoints = createHex(cx, cy, size * bufferSize);

  if (isInsidePolygon([px, py], hexPoints)) {
    return "inside";
  } else if (isInsidePolygon([px, py], bufferHexPoints)) {
    return "buffer";
  }
  return "outside";
}

/**
 * Recursively adds <pattern> elements for images in the given config (and sub-configs).
 */
async function addPatterns(defs: d3.Selection<SVGDefsElement, unknown, null, undefined>, config: HexagonConfig) {
  for (const [key, imagePath] of Object.entries(config.images)) {
    const uniqueId = generateUniqueId(config, key);
    const imageUrl = await imageCache.getImage(imagePath);

    const pattern = defs.append("pattern").attr("id", uniqueId).attr("patternUnits", "objectBoundingBox").attr("patternContentUnits", "objectBoundingBox").attr("width", 1).attr("height", 1);

    pattern.append("image").attr("xlink:href", imageUrl).attr("width", 1).attr("height", 1).attr("preserveAspectRatio", "xMidYMid slice");
  }

  if (config.config) {
    for (const subConfig of Object.values(config.config)) {
      await addPatterns(defs, subConfig);
    }
  }
}

/**
 * Draws a single hexagon polygon on the provided group.
 */
function drawSingleHexPolygon(group: d3.Selection<SVGGElement, unknown, null, undefined>, points: [number, number][], styleFill: string, styleOpacity: number, strokeWidth: string, dropShadowColor: string) {
  group
    .append("polygon")
    .attr("points", points.map((p) => p.join(",")).join(" "))
    .attr("stroke", "black")
    .attr("stroke-width", strokeWidth)
    .attr("opacity", styleOpacity)
    .style("filter", `drop-shadow(0 0px 1em ${dropShadowColor})`)
    .attr("fill", styleFill);
}

/**
 * Creates a transparent overlay polygon to receive clicks.
 */
function createClickOverlay(group: d3.Selection<SVGGElement, unknown, null, undefined>, points: [number, number][]) {
  group
    .append("polygon")
    .attr("points", points.map((p) => p.join(",")).join(" "))
    .attr("fill", "transparent")
    .style("pointer-events", "fill");
}

/**
 * Main SierpinskiHexagon component.
 */
const SierpinskiHexagon: React.FC<{ config: HexagonConfig }> = ({ config }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;
    preloadImages(config);
  }, [config]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Use 90% of the smaller dimension to size the main hexagon
    const hexagonWidth = Math.min(width, height) * 0.9;
    let hexagonCounter = 1;

    /**
     * Recursively draws hexagons at the specified level.
     */
    function drawHexagon(x: number, y: number, size: number, level: number, section: string, currentConfig: HexagonConfig, isMainHexagon: boolean, parentConfig?: HexagonConfig) {
      if (level <= 0) return;

      const currentHexagonId = hexagonCounter;
      const targetLevel = currentConfig.targetLevels[section];
      const groupClass = `hexagon-group-${level < 4 ? currentHexagonId : 0}`;
      const group = svg.append("g").attr("class", groupClass);

      // Offsets for 6 sub-hexagons
      const offsets = [
        [size / 1.5, 0],
        [size / 3, (Math.sqrt(3) / 3) * size],
        [-size / 3, (Math.sqrt(3) / 3) * size],
        [-size / 1.5, 0],
        [-size / 3, -(Math.sqrt(3) / 3) * size],
        [size / 3, -(Math.sqrt(3) / 3) * size]
      ];

      if (level > 3) {
        // For level > 3, draw 6 sub-hexagons for each offset
        offsets.forEach(([dx, dy], index) => {
          const newSection = Object.keys(currentConfig.targetLevels)[index];
          drawHexagon(x + dx, y + dy, size / 3, level - 1, newSection, currentConfig, isMainHexagon, currentConfig);
        });
      } else {
        // For levels <= 3, only draw sub-hexagons if the user wants it
        if (level > targetLevel) {
          offsets.forEach(([dx, dy]) => {
            drawHexagon(x + dx, y + dy, size / 3, level - 1, section, currentConfig, isMainHexagon, currentConfig);
          });
        }
      }

      // If at level === 3, check if a sub-config should be drawn at level 4
      if (level === 3 && currentConfig.config && currentConfig.config[section]) {
        drawHexagon(x, y, size, 4, section, currentConfig.config[section], false, currentConfig);
      }

      // Finally, if this is the target level, draw the actual hex polygon
      if (level === targetLevel) {
        const hexPoints = createHexagonPoints(x, y, size);
        const style = currentConfig.styles[section] || currentConfig.styles.default;
        const fillColor = style.fill;
        const polygonStyleOpacity = style.opacity;
        const dropShadowColor = currentConfig.dropShadow ? hexToRgbA(currentConfig.dropShadow) : "rgba(75, 0, 130, 0.5)";

        const hexagonPolygon = group.append("polygon");

        // If there's an image for this section, set it as a pattern fill
        const imageSource = currentConfig.images[section] || (parentConfig && parentConfig.images[section]);
        if (imageSource) {
          const uniqueId = generateUniqueId(currentConfig.images[section] ? currentConfig : parentConfig!, section);
          hexagonPolygon
            .attr("points", hexPoints.map((p) => p.join(",")).join(" "))
            .attr("stroke", "black")
            .attr("stroke-width", "0.4")
            .attr("opacity", polygonStyleOpacity)
            .style("filter", `drop-shadow(0 0px 1em ${dropShadowColor})`)
            .attr("fill", `url(#${uniqueId})`);
        } else {
          // Otherwise, use plain fill
          drawSingleHexPolygon(group, hexPoints, fillColor, polygonStyleOpacity, "0.4", dropShadowColor);
        }

        // Add a transparent overlay for clicks
        createClickOverlay(group, hexPoints);

        // Apply click action
        group.on("click", () => {
          const possibleSection = Object.keys(currentConfig.targetLevels)[currentHexagonId - 1];
          const action = config.actions[possibleSection] || config.actions.default;
          action(currentHexagonId);
          setIsTransitioning(true);
        });

        // If not the main hex, add a sub-hexagon class
        if (!isMainHexagon) {
          hexagonPolygon.attr("class", `sub-hexagon-${currentHexagonId}`);
        }
      }

      // If level === 3 and we are drawing the main hexagon, add text label and click logic
      if (level === 3 && isMainHexagon) {
        const hexPoints = createHexagonPoints(x, y, size);
        const [centerX, centerY] = getPolygonCenter(hexPoints);

        // Add text to the center of the hex
        group
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", currentConfig.textColor || "#ffefdb")
          .style("font-size", config.textSize || "1.5vw")
          .style("font-family", "Courier new, monospace")
          .style("font-weight", "500")
          .style("text-shadow", "0em 0em 0.1em rgba(0, 0, 0, 1)")
          .text(currentConfig.text[hexagonCounter] || "")
          .style("opacity", 0)
          .transition()
          .duration(500)
          .ease(d3.easeCubicInOut)
          .style("opacity", 1);

        // Add an invisible polygon to track hover/click
        group
          .append("polygon")
          .attr("points", hexPoints.map((p) => p.join(",")).join(" "))
          .attr("fill", "transparent")
          .style("pointer-events", "fill")
          .attr("id", `hexagon-${currentHexagonId}`)
          .style("opacity", 0);

        group.attr("data-scale", "1");

        // Determine the click action for the main hex
        if (targetLevel === 0) {
          group.on("click", () => {
            setIsTransitioning(true);
            const action = currentConfig.actions[section] || (() => {});
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

      // Level 4 draws the title in the center
      if (level === 4) {
        const hexPoints = createHexagonPoints(x, y, size);
        const [centerX, centerY] = getPolygonCenter(hexPoints);

        // Invisible polygon for correct bounding box
        group
          .append("polygon")
          .attr("points", hexPoints.map((p) => p.join(",")).join(" "))
          .attr("fill", "transparent")
          .style("cursor", "pointer")
          .style("pointer-events", "none");

        // Title text
        group
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", "#ffebcd")
          .style("pointer-events", "none")
          .style("font-size", currentConfig.titleSize || config.titleSize || "max(1.8vw, 1.8vh)")
          .style("font-family", "Courier New, monospace")
          .style("text-shadow", "0em 0em 0.2em rgba(143, 107, 143, 1)")
          .text(currentConfig.title || "");

        // Fade in if a different title
        if (currentConfig.title !== config.title) {
          group.style("opacity", 0).transition().duration(500).ease(d3.easeCubicInOut).style("opacity", 1);
        }
      }
    }

    // Clear SVG before re-drawing
    svg.selectAll("*").remove();

    // Add image patterns for all hexagons
    const defs = svg.append("defs");
    addPatterns(defs, config);

    // We use 4 as the max level plus we add the main root
    const maxTargetLevel = 4;
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

    // Draw the root-level hexagon
    const centerX = width / 2;
    const centerY = height / 2;
    drawHexagon(centerX, centerY, hexagonWidth / 2, maxTargetLevel, "center", config, true);

    /**
     * Mousemove handler to scale hexagons on hover (throttled).
     */
    const handleMouseMove = throttle((event: MouseEvent) => {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const svgRect = svgElement.getBoundingClientRect();
      const mouseX = event.clientX - svgRect.left;
      const mouseY = event.clientY - svgRect.top;

      // Each main-level hex has an ID from 1..6
      for (let i = 1; i < 7; i++) {
        const respectTo = d3.select(`#hexagon-${i}`).node() as SVGGElement;
        if (!respectTo) continue;

        const hexagonGroup = d3.selectAll(`.hexagon-group-${i}`);
        const bbox = respectTo.getBoundingClientRect();

        const cX = bbox.left - svgRect.left + bbox.width / 2;
        const cY = bbox.top - svgRect.top + bbox.height / 2;
        const hexSize = bbox.width / 2;

        const position = isPointInHexagon(mouseX, mouseY, cX, cY, hexSize);

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
              // Do nothing in buffer zone
              return;
          }

          if (isTransitioning) {
            targetScale = 1;
          }

          if (currentScale !== targetScale.toString()) {
            transition(element, respectTo, targetScale);
            d3.select(element).attr("data-scale", targetScale);
            console.log(`Hexagon ${i} scale changed to ${targetScale}`);
          }
        });
      }
    }, 200);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [config, isTransitioning]);

  useEffect(() => {
    console.log("isTransitioning:", isTransitioning); // Debug logging
  }, [isTransitioning]);

  return (
    <div className="h-screen w-screen bg-black/90 fixed overflow-hidden">
      <div className="absolute pt-8 pl-8 z-10">{config.backButton.exists && <BackButton textColor={config.textColor || "#ffefdb"} color={config.styles.default.fill || "#603b61"} to={config.backButton.to || "/"} />}</div>
      <div className="items-center justify-center">
        <svg ref={svgRef} style={{ position: "relative", zIndex: 1 }} />
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">Copyright © 2024 Ilan Rosenbaum All rights reserved.</div>
    </div>
  );
};

export default SierpinskiHexagon;
