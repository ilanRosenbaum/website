/*
Ilan's Website
Copyright (C) 2024-2025 ILAN ROSENBAUM

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useMemo, useRef } from "react";
import { Link } from "react-router-dom";

type Point = [number, number];

const createHexagonPoints = (x: number, y: number, size: number): Point[] => {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI) / 3;
    return [Math.cos(angle) * size + x, Math.sin(angle) * size + y];
  }) as Point[];
};

const getSubHexOffsets = (size: number): Point[] => [
  [size / 1.5, 0],
  [size / 3, (Math.sqrt(3) / 3) * size],
  [-size / 3, (Math.sqrt(3) / 3) * size],
  [-size / 1.5, 0],
  [-size / 3, -(Math.sqrt(3) / 3) * size],
  [size / 3, -(Math.sqrt(3) / 3) * size]
];

interface HexagonPath {
  id: number;
  level: number;
  points: Point[];
}

interface BridgeSegment {
  start: Point;
  end: Point;
}

interface TrimmedHexagon extends HexagonPath {
  edges: Array<[Point, Point]>;
}

interface VertexTrimmedPoint {
  hexId: number;
  point: Point;
  angle: number;
}

const pointKey = ([x, y]: Point) => `${x.toFixed(3)}:${y.toFixed(3)}`;

const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
const sub = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
const scale = (p: Point, factor: number): Point => [p[0] * factor, p[1] * factor];
const length = (p: Point) => Math.hypot(p[0], p[1]);
const normalize = (p: Point): Point => {
  const len = length(p) || 1;
  return [p[0] / len, p[1] / len];
};

const buildHexagons = (
  level: number,
  maxDepth: number,
  x: number,
  y: number,
  size: number,
  accumulator: HexagonPath[],
  idRef: { current: number }
) => {
  idRef.current += 1;
  accumulator.push({
    id: idRef.current,
    level,
    points: createHexagonPoints(x, y, size)
  });

  if (level === maxDepth) {
    return;
  }

  const offsets = getSubHexOffsets(size);
  offsets.forEach(([dx, dy]) => {
    buildHexagons(level + 1, maxDepth, x + dx, y + dy, size / 3, accumulator, idRef);
  });
};

const generateSierpinskiHexagons = (maxDepth: number, canvasSize: number, padding: number): HexagonPath[] => {
  const accumulator: HexagonPath[] = [];
  const idRef = { current: 0 };
  const center = canvasSize / 2;
  const size = center - padding;
  buildHexagons(1, maxDepth, center, center, size, accumulator, idRef);
  return accumulator;
};

const SierpinskiExport: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasSize = 900;
  const padding = 60;
  const maxDepth = 4;
  const trimDistance = 2;
  const bridgeInset = 0;
  const bridgeStrokeWidth = 0.7;

  const hexagons = useMemo(() => generateSierpinskiHexagons(maxDepth, canvasSize, padding), [maxDepth, canvasSize, padding]);

  const leafHexagons = useMemo(() => hexagons.filter((hex) => hex.level === maxDepth), [hexagons, maxDepth]);

  const { trimmedHexagons, bridgeSegments } = useMemo(() => {
    const sharedCounts = new Map<string, number>();
    const vertexTrimmedPoints = new Map<string, VertexTrimmedPoint[]>();

    leafHexagons.forEach((hex) => {
      hex.points.forEach((point) => {
        const key = pointKey(point);
        sharedCounts.set(key, (sharedCounts.get(key) || 0) + 1);
      });
    });

    const registerTrimmedPoint = (vertexKey: string, vertex: Point, point: Point, hexId: number) => {
      const list = vertexTrimmedPoints.get(vertexKey) || [];
      list.push({
        hexId,
        point,
        angle: Math.atan2(point[1] - vertex[1], point[0] - vertex[0])
      });
      vertexTrimmedPoints.set(vertexKey, list);
    };

    const trimHex = (hex: HexagonPath): TrimmedHexagon => {
      const points = hex.points;
      const vertexMeta = points.map((current, i) => {
        const prev = points[(i - 1 + points.length) % points.length];
        const next = points[(i + 1) % points.length];
        const key = pointKey(current);
        const isShared = (sharedCounts.get(key) || 0) > 1;

        if (!isShared) {
          return {
            original: current,
            outgoing: current,
            incoming: current,
            shared: false
          };
        }

        const prevDir = normalize(sub(prev, current));
        const nextDir = normalize(sub(next, current));

        const incoming = add(current, scale(prevDir, trimDistance));
        const outgoing = add(current, scale(nextDir, trimDistance));

        registerTrimmedPoint(key, current, incoming, hex.id);
        registerTrimmedPoint(key, current, outgoing, hex.id);

        return {
          original: current,
          outgoing,
          incoming,
          shared: true
        };
      });

      const edges: Array<[Point, Point]> = [];
      for (let i = 0; i < points.length; i++) {
        const startMeta = vertexMeta[i];
        const endMeta = vertexMeta[(i + 1) % points.length];
        edges.push([startMeta.outgoing, endMeta.incoming]);
      }

      return { ...hex, edges };
    };

    const trimmed: TrimmedHexagon[] = leafHexagons.map(trimHex);

    const bridges: BridgeSegment[] = [];

    vertexTrimmedPoints.forEach((points) => {
      if (points.length < 2) return;
      const sorted = points.slice().sort((a, b) => a.angle - b.angle);
      for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i];
        const next = sorted[(i + 1) % sorted.length];

        if (current.hexId === next.hexId) {
          continue;
        }

        const bridgeVector = sub(next.point, current.point);
        const bridgeLen = length(bridgeVector);
        if (bridgeLen < 0.0001) {
          continue;
        }

        const direction = normalize(bridgeVector);
        const maxInset = Math.max(0, bridgeLen / 2 - 0.001);
        const inset = Math.min(Math.max(bridgeInset, 0), maxInset);
        const start = add(current.point, scale(direction, inset));
        const end = add(next.point, scale(direction, -inset));

        bridges.push({ start, end });
      }
    });

    return { trimmedHexagons: trimmed, bridgeSegments: bridges };
  }, [leafHexagons, trimDistance, bridgeInset]);

  const downloadSVG = () => {
    if (!svgRef.current) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "sierpinski-hexagon-depth-4.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col items-center gap-8 py-10 px-6">
      <div className="text-center space-y-2 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-wide">Sierpinski Hexagon Export</h1>
        <p className="text-sm text-neutral-600">
          This SVG reuses the same geometry as the interactive homepage, but renders four recursion layers with a clean white background and
          stroke-only outlines suitable for laser cutting.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          className="px-6 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium tracking-wide hover:bg-neutral-700 transition-colors"
          onClick={downloadSVG}
        >
          Download SVG
        </button>
        <Link
          to="/"
          className="px-6 py-2 rounded-full border border-neutral-900 text-sm font-medium tracking-wide hover:bg-neutral-100 transition-colors"
        >
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-4xl">
        <div className="border border-neutral-300 shadow-lg bg-white p-4">
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${canvasSize} ${canvasSize}`}
            width="100%"
            height="100%"
            shapeRendering="geometricPrecision"
          >
            <rect width={canvasSize} height={canvasSize} fill="#ffffff" />
            {trimmedHexagons.map((hex) => {
              const strokeWidth = Math.max(0.4, 2 - hex.level * 0.35);
              const pathData = hex.edges.map(([start, end]) => `M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`).join(" ");
              return <path key={`hex-${hex.id}`} d={pathData} fill="none" stroke="#000000" strokeWidth={strokeWidth} strokeLinecap="round" />;
            })}
            {bridgeSegments.map((segment, index) => (
              <line
                key={`bridge-${index}`}
                x1={segment.start[0]}
                y1={segment.start[1]}
                x2={segment.end[0]}
                y2={segment.end[1]}
                stroke="#000000"
                strokeWidth={bridgeStrokeWidth}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <p className="text-xs text-neutral-500 text-center mt-3">Depth 4 • Leaf-only strokes • SVG ready for vector workflows</p>
        </div>
      </div>
    </div>
  );
};

export default SierpinskiExport;
