import React, { useRef, useEffect } from "react";
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
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const hexagonWidth = window.innerHeight;
    let hexagonCounter = 1;

    const transition = (element: SVGGElement, respectTo: SVGGElement, scale: number) => {
      d3.select(element)
        .transition()
        .duration(200)
        .ease(d3.easeCubicInOut)
        .attr("transform", function () {
          const bbox = respectTo.getBBox();
          return `translate(${bbox.x + bbox.width / 2}, ${bbox.y + bbox.height / 2}) scale(${scale}) translate(${-bbox.x - bbox.width / 2}, ${-bbox.y - bbox.height / 2})`;
        });
    };

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

    const drawHexagon = (x: number, y: number, size: number, level: number, section: string, currentConfig: HexagonConfig, isMainHexagon: boolean) => {
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
          drawHexagon(x + dx, y + dy, size / 3, level - 1, newSection, currentConfig, isMainHexagon);
        });
      } else {
        if (level > targetLevel) {
          offsets.forEach(([dx, dy]) => {
            drawHexagon(x + dx, y + dy, size / 3, level - 1, section, currentConfig, isMainHexagon);
          });
        }
      }

      // Recursively draw new hexagon with specific config if exists before drawing the current hexagon
      if (level === 3 && currentConfig.config && currentConfig.config[section]) {
        drawHexagon(x, y, size, 4, section, currentConfig.config[section], false);
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
        });

        if (currentConfig.images[section]) {
          hexagonPolygon.attr("fill", `url(#image-fill-${section})`).attr("opacity", style.opacity);
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

        // Apply specific click action for the hexagon
        // If the target level is 0, use the action defined in the current config and if there is none that means
        //    that hexagon effectively should not exist so it should do nothing
        if (targetLevel === 0) {
          group.on("click", () => {
            const action = currentConfig.actions[section] || function () {};
            action(currentHexagonId);
          });
        } else {
          group.on("click", () => {
            const action = currentConfig.actions[section] || config.actions.default;
            action(currentHexagonId);
          });
        }

        // Add hover effect to translate all target level hexagons
        if (targetLevel === 3) {
          group
            .on("mouseover", function () {
              transition(this, this, 0.9);
            })
            .on("mouseout", function () {
              transition(this, this, 1);
            });
        } else {
          const elements = d3.selectAll(`.sub-hexagon-${currentHexagonId}`).nodes() as SVGGElement[];
          group
            .on("mouseover", function () {
              elements.forEach((element) => transition(element, group.node() as SVGGElement, 1.1));
            })
            .on("mouseout", function () {
              elements.forEach((element) => transition(element, group.node() as SVGGElement, 1));
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
        .attr("preserveAspectRatio", "xMidYMid slice"); // Ensure the image is scaled proportionally to cover the entire area.
    });
    // Update the initial draw call to use the maximum target level + 2
    const maxTargetLevel = 4;
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", "100%");

    const centerX = width / 2;
    const centerY = height / 2;
    drawHexagon(centerX, centerY, hexagonWidth / 2, maxTargetLevel, "center", config, true);

    for (let i: number = 1; i < 7; i++) {
      if (config.targetLevels[Object.keys(config.targetLevels)[i - 1]] === 0) {
        const currentSection = Object.keys(config.targetLevels)[i - 1];

        // If there is no sub-config for the section with target level 0 in the main config, skip the hover effect as this hexagon should not functionally exist
        if (!config.config || !config.config.hasOwnProperty(currentSection)) {
          continue;
        }
      }

      if (Object.values(config.targetLevels)[i - 1] === 3) {
        continue;
      }

      const respectTo = d3.select(`#hexagon-${i}`).node() as SVGGElement;
      const hexagonGroup = d3.selectAll(`.hexagon-group-${i}`);
      const svg = d3.select("svg").node() as SVGSVGElement;
      const svgSelection = d3.select(svg);

      const bbox = respectTo.getBBox();

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 1.15])
        .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
          svgSelection.attr("transform", event.transform.toString());
        });

      svgSelection.call(zoom as any);

      const handleMouseOver = () => {
        const hexCenterX = bbox.x + bbox.width / 2;
        const hexCenterY = bbox.y + bbox.height / 2;
        // Calculate the translation needed to center the hexagon
        const translateX = (centerX - hexCenterX) * 0.2;
        const translateY = (centerY - hexCenterY) * 0.2;

        // Apply zoom and translation
        svgSelection
          .transition()
          .duration(700)
          .call(zoom.transform as any, d3.zoomIdentity.translate(translateX, translateY).scale(1.15));
      };

      const handleMouseOut = () => {
        svgSelection
          .transition()
          .duration(700)
          .call(zoom.transform as any, d3.zoomIdentity);
      };

      hexagonGroup
        .on("mouseover", function () {
          handleMouseOver();
        })
        .on("mouseout", function () {
          handleMouseOut();
        });
    }
  }, [config]);

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
