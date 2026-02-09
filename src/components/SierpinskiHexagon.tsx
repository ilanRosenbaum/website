/*
Ilan's Website
Copyright (C) 2024-2026 ILAN ROSENBAUM

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import BackButton from "./BackButton";
import { imageCache } from "./ImageCache";
import { Footer } from "../Constants";
import FastModeToggle from "./FastModeToggle";

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

// Keep existing helper functions the same...
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

function generateUniqueId(config: HexagonConfig, section: string, sectionPath: string = ""): string {
  const baseId = config.imageId || config.title || "root";
  const pathPrefix = sectionPath ? `${sectionPath}-` : "";
  return `image-fill-${pathPrefix}${baseId}-${section}`.replace(/\s+/g, "-").toLowerCase();
}

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

function getThumbPath(originalPath: string): string {
  // Extract the base filename and extension
  const lastSlashIndex = originalPath.lastIndexOf("/");
  const filename = originalPath.substring(lastSlashIndex + 1);
  const lastDotIndex = filename.lastIndexOf(".");

  if (lastDotIndex === -1) return originalPath; // No extension found

  const baseFilename = filename.substring(0, lastDotIndex);
  const extension = filename.substring(lastDotIndex);

  return `/Covers/thumbnails/${baseFilename}_300x300${extension}`;
}

async function addPatterns(defs: d3.Selection<SVGDefsElement, unknown, null, undefined>, config: HexagonConfig) {
  // Helper function to create a pattern
  const createPattern = (uniqueId: string, imageUrl: string) => {
    const pattern = defs
      .append("pattern")
      .attr("id", uniqueId)
      .attr("patternUnits", "objectBoundingBox")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1);

    pattern.append("image").attr("xlink:href", imageUrl).attr("width", 1).attr("height", 1).attr("preserveAspectRatio", "xMidYMid slice");
  };

  // Collect all configs including nested ones with their section paths
  const getAllConfigs = (config: HexagonConfig, sectionPath: string = ""): Array<{ config: HexagonConfig; path: string }> => {
    const configs = [{ config, path: sectionPath }];
    if (config.config) {
      Object.entries(config.config).forEach(([section, subConfig]) => {
        const newPath = sectionPath ? `${sectionPath}-${section}` : section;
        configs.push(...getAllConfigs(subConfig, newPath));
      });
    }
    return configs;
  };

  // Get all image loading promises
  const imageLoadPromises = getAllConfigs(config).flatMap(({ config: cfg, path }) =>
    Object.entries(cfg.images).map(async ([key, imagePath]) => {
      const uniqueId = generateUniqueId(cfg, key, path);
      const thumbPath = getThumbPath(imagePath);

      try {
        // Try thumbnail first
        const imageUrl = await imageCache.getImage(thumbPath);
        // Preload original in background
        imageCache.getImage(imagePath).catch(console.error);
        return { uniqueId, imageUrl };
      } catch (error) {
        // Fallback to original
        console.warn(`Failed to load thumbnail for ${imagePath}, falling back to original`);
        const imageUrl = await imageCache.getImage(imagePath);
        return { uniqueId, imageUrl };
      }
    })
  );

  // Load all images concurrently
  const results = await Promise.all(imageLoadPromises);

  // Create patterns for all loaded images
  results.forEach(({ uniqueId, imageUrl }) => {
    createPattern(uniqueId, imageUrl);
  });
}

const SierpinskiHexagon: React.FC<{ config: HexagonConfig }> = ({ config }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Cache for hexagon paths
  const hexagonPathCache = useMemo(() => new Map<string, string>(), []);

  // Memoized geometry calculations
  const geometry = useMemo(() => {
    const getSize = (width: number, height: number) => Math.min(width, height) * 0.9;

    return {
      createHexagonPoints: (x: number, y: number, size: number): [number, number][] => {
        const key = `${x}-${y}-${size}`;
        if (hexagonPathCache.has(key)) {
          return hexagonPathCache
            .get(key)!
            .split(" ")
            .map((point) => {
              const [x, y] = point.split(",");
              return [parseFloat(x), parseFloat(y)] as [number, number];
            });
        }

        const points = d3.range(6).map((i) => {
          const angle = (i * Math.PI) / 3;
          return [Math.cos(angle) * size + x, Math.sin(angle) * size + y] as [number, number];
        });

        hexagonPathCache.set(key, points.map((p) => p.join(",")).join(" "));
        return points;
      },
      getPolygonCenter: (points: [number, number][]): [number, number] => {
        const x = points.reduce((acc, point) => acc + point[0], 0) / points.length;
        const y = points.reduce((acc, point) => acc + point[1], 0) / points.length;
        return [x, y];
      },
      getSubHexOffsets: (size: number) => [
        [size / 1.5, 0],
        [size / 3, (Math.sqrt(3) / 3) * size],
        [-size / 3, (Math.sqrt(3) / 3) * size],
        [-size / 1.5, 0],
        [-size / 3, -(Math.sqrt(3) / 3) * size],
        [size / 3, -(Math.sqrt(3) / 3) * size]
      ],
      getSize
    };
  }, [hexagonPathCache]);

  // Handle window resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        if (dimensions.width !== newWidth || dimensions.height !== newHeight) {
          setDimensions({ width: newWidth, height: newHeight });
        }
      }, 100)
    );

    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      hexagonPathCache.clear();
    };
  }, [dimensions.width, dimensions.height, hexagonPathCache]);

  useEffect(() => {
    if (!svgRef.current) return;
    preloadImages(config);
  }, [config]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Use memoized size calculation
    const hexagonWidth = geometry.getSize(width, height);
    let hexagonCounter = 1;

    function drawHexagon(
      x: number,
      y: number,
      size: number,
      level: number,
      section: string,
      currentConfig: HexagonConfig,
      isMainHexagon: boolean,
      parentConfig?: HexagonConfig,
      sectionPath: string = ""
    ) {
      if (level <= 0) return;

      const currentHexagonId = hexagonCounter;
      const targetLevel = currentConfig.targetLevels[section];
      const groupClass = `hexagon-group-${level < 4 ? currentHexagonId : 0}`;
      const group = svg.append("g").attr("class", groupClass);

      // Use memoized offsets for sub-hexagons
      const offsets = geometry.getSubHexOffsets(size);

      if (level > 3) {
        offsets.forEach(([dx, dy], index) => {
          const newSection = Object.keys(currentConfig.targetLevels)[index];
          drawHexagon(x + dx, y + dy, size / 3, level - 1, newSection, currentConfig, isMainHexagon, currentConfig, sectionPath);
        });
      } else if (level > targetLevel) {
        offsets.forEach(([dx, dy]) => {
          drawHexagon(x + dx, y + dy, size / 3, level - 1, section, currentConfig, isMainHexagon, currentConfig, sectionPath);
        });
      }

      if (level === 3 && currentConfig.config && currentConfig.config[section]) {
        const newPath = sectionPath ? `${sectionPath}-${section}` : section;
        drawHexagon(x, y, size, 4, section, currentConfig.config[section], false, currentConfig, newPath);
      }

      if (level === targetLevel) {
        // Use memoized point generation
        const hexPoints = geometry.createHexagonPoints(x, y, size);
        const style = currentConfig.styles[section] || currentConfig.styles.default;
        const dropShadowColor = currentConfig.dropShadow ? hexToRgbA(currentConfig.dropShadow) : "rgba(75, 0, 130, 0.5)";

        const hexagonPolygon = group.append("polygon");

        const imageSource = currentConfig.images[section] || (parentConfig && parentConfig.images[section]);
        if (imageSource) {
          const uniqueId = generateUniqueId(currentConfig.images[section] ? currentConfig : parentConfig!, section, sectionPath);
          hexagonPolygon
            .attr("points", hexPoints.map((p) => p.join(",")).join(" "))
            .attr("stroke", "black")
            .attr("stroke-width", "0.4")
            .attr("opacity", style.opacity)
            .style("filter", `drop-shadow(0 0px 1em ${dropShadowColor})`)
            .attr("fill", `url(#${uniqueId})`);
        } else {
          group
            .append("polygon")
            .attr("points", hexPoints.map((p) => p.join(",")).join(" "))
            .attr("stroke", "black")
            .attr("stroke-width", "0.4")
            .attr("opacity", style.opacity)
            .style("filter", `drop-shadow(0 0px 1em ${dropShadowColor})`)
            .attr("fill", style.fill);
        }

        group
          .append("polygon")
          .attr("points", hexPoints.map((p) => p.join(",")).join(" "))
          .attr("fill", "transparent")
          .style("pointer-events", "fill");

        group.on("click", () => {
          const possibleSection = Object.keys(currentConfig.targetLevels)[currentHexagonId - 1];
          const action = config.actions[possibleSection] || config.actions.default;
          action(currentHexagonId);
          setIsTransitioning(true);
        });

        if (!isMainHexagon) {
          hexagonPolygon.attr("class", `sub-hexagon-${currentHexagonId}`);
        }
      }

      if (level === 3 && isMainHexagon) {
        // Use memoized point and center calculations
        const hexPoints = geometry.createHexagonPoints(x, y, size);
        const [centerX, centerY] = geometry.getPolygonCenter(hexPoints);

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

        group
          .append("polygon")
          .attr("points", hexPoints.map((p) => p.join(",")).join(" "))
          .attr("fill", "transparent")
          .style("pointer-events", "fill")
          .attr("id", `hexagon-${currentHexagonId}`)
          .style("opacity", 0);

        group.attr("data-scale", "1");

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

      if (level === 4) {
        const hexPoints = geometry.createHexagonPoints(x, y, size);
        const [centerX, centerY] = geometry.getPolygonCenter(hexPoints);

        group
          .append("polygon")
          .attr("points", hexPoints.map((p) => p.join(",")).join(" "))
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
          .style("font-size", currentConfig.titleSize || config.titleSize || "max(1.8vw, 1.8vh)")
          .style("font-family", "Courier New, monospace")
          .style("text-shadow", "0em 0em 0.2em rgba(143, 107, 143, 1)")
          .text(currentConfig.title || "");

        if (currentConfig.title !== config.title) {
          group.style("opacity", 0).transition().duration(500).ease(d3.easeCubicInOut).style("opacity", 1);
        }
      }
    }

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

    const defs = svg.append("defs");
    addPatterns(defs, config);

    const maxTargetLevel = 4;
    const centerX = width / 2;
    const centerY = height / 2;
    drawHexagon(centerX, centerY, hexagonWidth / 2, maxTargetLevel, "center", config, true);

    const handleMouseMove = throttle((event: MouseEvent) => {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const svgRect = svgElement.getBoundingClientRect();
      const mouseX = event.clientX - svgRect.left;
      const mouseY = event.clientY - svgRect.top;

      for (let i = 1; i < 7; i++) {
        const respectTo = d3.select(`#hexagon-${i}`).node() as SVGGElement;
        if (!respectTo) continue;

        const hexagonGroup = d3.selectAll(`.hexagon-group-${i}`);
        const bbox = respectTo.getBoundingClientRect();

        const cX = bbox.left - svgRect.left + bbox.width / 2;
        const cY = bbox.top - svgRect.top + bbox.height / 2;
        const hexSize = bbox.width / 2;

        // Use point in polygon check for hexagon shape
        const dx = mouseX - cX;
        const dy = mouseY - cY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const bufferZone = hexSize * 1.1; // 10% buffer zone

        let targetScale: number;
        if (distance <= hexSize) {
          targetScale = 0.9; // Inside hexagon
        } else if (distance <= bufferZone) {
          return; // In buffer zone, do nothing
        } else {
          targetScale = 1; // Outside hexagon
        }

        if (isTransitioning) {
          targetScale = 1;
        }

        const currentScale = d3.select(respectTo).attr("data-scale");
        if (currentScale !== targetScale.toString()) {
          hexagonGroup.each(function () {
            const element = this as SVGGElement;
            d3.select(element)
              .transition()
              .duration(200)
              .ease(d3.easeCubicInOut)
              .attr("transform", function () {
                const bbox = respectTo.getBoundingClientRect();
                const xMid = bbox.x + bbox.width / 2;
                const yMid = bbox.y + bbox.height / 2;
                return `translate(${xMid}, ${yMid}) scale(${targetScale}) translate(${-xMid}, ${-yMid})`;
              });
          });
          d3.select(respectTo).attr("data-scale", targetScale);
        }
      }
    }, 200);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [config, isTransitioning, geometry]);

  return (
    <div className="h-screen w-screen bg-black/90 fixed overflow-hidden">
      <FastModeToggle />
      <div className="absolute pt-8 pl-8 z-10">
        {config.backButton.exists && (
          <BackButton textColor={config.textColor || "#ffefdb"} color={config.styles.default.fill || "#603b61"} to={config.backButton.to || "/"} />
        )}
      </div>
      <div className="items-center justify-center">
        <svg ref={svgRef} style={{ position: "relative", zIndex: 1 }} />
      </div>
      <Footer />
    </div>
  );
};

export default SierpinskiHexagon;
