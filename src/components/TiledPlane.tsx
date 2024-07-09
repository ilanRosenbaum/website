import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import BackButton from './BackButton';

interface TiledPlaneProps {
  photos: string[];
}

const TiledPlane: React.FC<TiledPlaneProps> = ({ photos }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const hexRadius = width / 11; // Adjust size to fit screen
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;

    svg.attr('width', width).attr('height', height);

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

      const hexagon = svg.append('g')
        .attr('class', 'hexagon');

      hexagon.append('path')
        .attr('d', createHexagonPath(0, 0))
        .attr('fill', `url(#image-${col}-${row})`)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('transform', `translate(${x}, ${y})`);

      const defs = svg.append('defs');
      defs.append('pattern')
        .attr('id', `image-${col}-${row}`)
        .attr('patternUnits', 'objectBoundingBox')
        .attr('width', '100%')
        .attr('height', '100%')
        .append('image')
        .attr('xlink:href', photo)
        .attr('width', hexWidth)
        .attr('height', hexHeight)
        .attr('preserveAspectRatio', 'xMidYMid slice');
    };

    let photoIndex = 0;
    let row = 0;
    const columns = [0, -1, 1]; // Center, left, right

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

    // Adjust SVG height
    const svgHeight = (row + 1) * rowOffsetY;
    svg.attr('height', Math.max(height, svgHeight));

    // Adjust container height if content exceeds it
    if (svgHeight > height) {
      container.style.overflowY = 'scroll';
    }

  }, [photos]);

  return (
    <div className="h-screen w-screen bg-black/90 flex flex-col items-center">
      <div className="absolute top-8 left-8 z-10">
        <BackButton textColor="#ffefdb" color="#603b61" to="/" />
      </div>
      <div 
        ref={containerRef}
        className="w-full h-full mt-8 mb-8" 
      >
        <svg ref={svgRef} className="mx-auto"></svg>
      </div>
    </div>
  );
};

export default TiledPlane;