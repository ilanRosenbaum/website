import React, { useMemo } from "react";
import TiledPlane from "../components/TiledPlane";
import * as photoFiles from "../photoFiles";

const DisplayPhotos: React.FC<{ source: string }> = ({ source }) => {
  const photos = useMemo(() => {
    // Convert source to the correct variable name format
    const variableName = `photoFiles${source.split('/').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')}`;
    
    // Access the correct array from photoFiles
    return (photoFiles as any)[variableName] || [];
  }, [source]);

  return (
    <div className="photography-page">
      <h1 className="sr-only">Photography Portfolio</h1>
      <TiledPlane photos={photos} />
    </div>
  );
};

export default DisplayPhotos;