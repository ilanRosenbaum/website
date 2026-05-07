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

import React, { useEffect, useRef, useState, useMemo } from "react";
import BackButton from "./BackButton";
import { storage } from "./../firebase";
import { ref, getDownloadURL, StorageReference } from "firebase/storage";
import { imageCache } from "./ImageCache";
import { COLORS, Footer } from "../Constants";

interface TiledPlaneProps {
  photoPath?: string;
  parentFolders?: string | string[];
  backTo?: string;
}

interface ImageItem {
  thumbUrl: string; // thumbnail URL
  fullPath: string; // path to the original full-size photo
  lastModified: string; // from original photo's metadata.updated
}

interface FolderData {
  coverPhoto: string;
  allPhotos: string[];
  folderName: string;
}

const TiledPlane: React.FC<TiledPlaneProps> = ({ photoPath, parentFolders, backTo }) => {
  const isFolderMode = typeof parentFolders !== "undefined";
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Single-folder mode state
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [photos, setPhotos] = useState<ImageItem[]>([]);

  // Folder mode state
  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [folderData, setFolderData] = useState<FolderData[]>([]);
  const [photoPaths, setPhotoPaths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState<number>(0);

  // Shared state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isFolderMode || !photoPath) return;

    setPhotos([]);
    setSelectedPhoto(null);
    setSelectedIndex(null);

    fetchThumbnailsIncremental();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoPath, isFolderMode]);

  useEffect(() => {
    if (!isFolderMode || !parentFolders) return;

    const listFolders = async () => {
      const parentFoldersArray = Array.isArray(parentFolders) ? parentFolders : [parentFolders];

      try {
        const allFolderPromises: Promise<{ path: string; lastModified: Date }>[] = [];
        let totalSkeletonCount = 0;

        for (const parentFolder of parentFoldersArray) {
          const result = await imageCache.listAll(parentFolder);
          const validPrefixes = result.prefixes.filter((folderRef) => folderRef.name !== "thumbnails");

          if (validPrefixes.length === 0 && result.items.length > 0) {
            totalSkeletonCount += 1;

            const folderPromise = (async () => {
              const metadataResults = await Promise.all(result.items.map((item) => imageCache.getMetadata(item)));

              const validDates = metadataResults
                .map((meta) => meta.updated)
                .filter((updated): updated is string => typeof updated === "string" && updated !== "")
                .map((updated) => new Date(updated))
                .filter((date) => !isNaN(date.getTime()));

              const lastModified = validDates.length > 0 ? new Date(Math.max(...validDates.map((d) => d.getTime()))) : new Date(0);

              return { path: parentFolder, lastModified };
            })();

            allFolderPromises.push(folderPromise);
          } else {
            totalSkeletonCount += validPrefixes.length;

            const folderPromises = validPrefixes.map(async (folderRef: StorageReference) => {
              const folderPath = `${parentFolder}/${folderRef.name}`;
              const folderContents = await imageCache.listAll(folderPath);
              if (folderContents.items.length === 0) {
                return { path: folderPath, lastModified: new Date(0) };
              }

              const metadataResults = await Promise.all(folderContents.items.map((item) => imageCache.getMetadata(item)));

              const validDates = metadataResults
                .map((meta) => meta.updated)
                .filter((updated): updated is string => typeof updated === "string" && updated !== "")
                .map((updated) => new Date(updated))
                .filter((date) => !isNaN(date.getTime()));

              const lastModified = validDates.length > 0 ? new Date(Math.max(...validDates.map((d) => d.getTime()))) : new Date(0);

              return { path: folderPath, lastModified };
            });

            allFolderPromises.push(...folderPromises);
          }
        }

        setSkeletonCount(totalSkeletonCount);

        const foldersWithDates = await Promise.all(allFolderPromises);
        const sortedFolders = foldersWithDates.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
        setPhotoPaths(sortedFolders.map((folder) => folder.path));
      } catch (error) {
        console.error("Error listing folders:", error);
      }
    };

    listFolders();
  }, [isFolderMode, parentFolders]);

  useEffect(() => {
    if (!isFolderMode || photoPaths.length === 0) return;

    const fetchPhotos = async () => {
      const fetchedFolderData: FolderData[] = await Promise.all(
        photoPaths.map(async (path) => {
          const folderName = path.split("/").pop() || "";

          let allOriginalItems: StorageReference[] = [];
          let newestOriginal: StorageReference | null = null;

          try {
            const folderContents = await imageCache.listAll(path);

            if (!folderContents.items.length) {
              return {
                coverPhoto: "",
                allPhotos: [],
                folderName
              };
            }

            const itemsWithMeta = await Promise.all(
              folderContents.items.map(async (item) => {
                const meta = await imageCache.getMetadata(item);
                const dateString = meta.updated || meta.timeCreated;
                return {
                  ref: item,
                  date: new Date(dateString)
                };
              })
            );
            itemsWithMeta.sort((a, b) => b.date.getTime() - a.date.getTime());

            allOriginalItems = itemsWithMeta.map((obj) => obj.ref);
            newestOriginal = allOriginalItems[0] || null;
          } catch (error) {
            console.error(`Error listing original images from ${path}:`, error);
            return {
              coverPhoto: "",
              allPhotos: [],
              folderName
            };
          }

          let coverPhotoUrl = "";
          if (newestOriginal) {
            const originalName = newestOriginal.name;
            const lastDotIndex = originalName.lastIndexOf(".");

            if (lastDotIndex !== -1) {
              const baseFilename = originalName.substring(0, lastDotIndex);
              const extension = originalName.substring(lastDotIndex);
              const possibleThumbName = `${baseFilename}_300x300${extension}`;

              try {
                coverPhotoUrl = await imageCache.getDownloadURL(`${path}/thumbnails/${possibleThumbName}`);
                if (coverPhotoUrl) {
                  await imageCache.getImage(coverPhotoUrl);
                }
              } catch (error) {
                console.warn(`No matching thumbnail for newest original ${originalName}`, error);
              }
            } else {
              console.warn(`Original file "${originalName}" does not have an extension.`);
            }
          }

          return {
            coverPhoto: coverPhotoUrl,
            allPhotos: [],
            folderName
          };
        })
      );

      const validData = fetchedFolderData.filter((data) => data.coverPhoto !== "");
      setFolderData(validData);
    };

    fetchPhotos();
  }, [isFolderMode, photoPaths]);

  /**
   * Insert a single item into our array in descending order,
   * but only if it doesn't already exist (avoid duplicates).
   */
  function insertInDescendingOrder(existing: ImageItem[], item: ImageItem) {
    // Check if already present
    const alreadyIndex = existing.findIndex((x) => x.fullPath === item.fullPath);
    if (alreadyIndex !== -1) {
      // Already in the list
      return existing;
    }

    // Place item in descending order by lastModified
    const newTs = new Date(item.lastModified).getTime();
    let i = 0;
    while (i < existing.length) {
      const currentTs = new Date(existing[i].lastModified).getTime();
      if (currentTs <= newTs) {
        // item is newer than existing[i]
        break;
      }
      i++;
    }
    return [...existing.slice(0, i), item, ...existing.slice(i)];
  }

  const fetchThumbnailsIncremental = async () => {
    if (!photoPath) return;

    try {
      const { items: thumbRefs } = await imageCache.listAll(`${photoPath}/thumbnails`);

      // For each thumbnail, do the fetching
      thumbRefs.forEach(async (thumbRef) => {
        try {
          // e.g. "example_300x300.jpg"
          const thumbName = thumbRef.name;
          const baseName = thumbName.replace("_300x300", "");
          const originalFullPath = `${photoPath}/${baseName}`;

          // 1) Thumbnail URL
          const thumbUrl = await imageCache.getDownloadURL(thumbRef.fullPath);
          if (thumbUrl) {
            await imageCache.getImage(thumbUrl);
          }

          // 2) Original metadata (for lastModified)
          const originalRef = ref(storage, originalFullPath);
          const originalMeta = await imageCache.getMetadata(originalRef);

          const lastModified = originalMeta.updated || originalMeta.timeCreated;

          const newItem: ImageItem = {
            thumbUrl,
            fullPath: originalFullPath,
            lastModified
          };

          // Insert item in correct descending order, skipping duplicates
          setPhotos((prev) => insertInDescendingOrder(prev, newItem));
        } catch (innerErr) {
          console.error("Error fetching data for a thumbnail:", innerErr);
        }
      });
    } catch (error) {
      console.error("Error listing thumbnails:", error);
    }
  };

  // =============== On Click, Load the Full-Size ===============
  const handleHexClick = async (index: number) => {
    try {
      const item = photos[index];
      const fullRef = ref(storage, item.fullPath);
      const bigImageUrl = await getDownloadURL(fullRef);
      setSelectedIndex(index);
      setSelectedPhoto(bigImageUrl);
    } catch (error) {
      console.error("Error loading full-size image:", error);
    }
  };

  const handleFolderHexClick = async (folderIndex: number) => {
    const folder = folderData[folderIndex];
    if (folder.allPhotos.length > 0) {
      setSelectedFolder(folder);
      setSelectedPhotoIndex(0);
      return;
    }

    try {
      const allPhotos = await fetchAllPhotosForFolderPath(photoPaths[folderIndex]);
      setFolderData((prev) => {
        const newArr = [...prev];
        newArr[folderIndex] = {
          ...newArr[folderIndex],
          allPhotos
        };
        return newArr;
      });
      setSelectedFolder({
        ...folder,
        allPhotos
      });
      setSelectedPhotoIndex(0);
    } catch (err) {
      console.error("Error loading on-demand photos:", err);
    }
  };

  async function fetchAllPhotosForFolderPath(folderPath: string): Promise<string[]> {
    try {
      const result = await imageCache.listAll(folderPath);

      const itemsWithMeta = await Promise.all(
        result.items.map(async (item) => {
          const meta = await imageCache.getMetadata(item);
          const dateString = meta.updated || meta.timeCreated;
          return {
            ref: item,
            date: new Date(dateString)
          };
        })
      );

      itemsWithMeta.sort((a, b) => b.date.getTime() - a.date.getTime());

      const allPhotos = await Promise.all(
        itemsWithMeta.map(async (item) => {
          const url = await getDownloadURL(item.ref);
          await imageCache.getImage(url);
          return url;
        })
      );

      return allPhotos;
    } catch (error) {
      console.error("Error fetching all photos from", folderPath, error);
      return [];
    }
  }

  // =============== Next / Previous Full-Size ===============
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      const newIndex = selectedIndex + 1;
      handleHexClick(newIndex);
      setSelectedIndex(newIndex);
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      handleHexClick(newIndex);
      setSelectedIndex(newIndex);
    }
  };

  const closeFullscreen = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      setSelectedPhoto(null);
      setSelectedIndex(null);
    }
  };

  const handleFolderNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (selectedFolder && selectedPhotoIndex !== null) {
      const nextIndex = selectedPhotoIndex + 1;
      if (nextIndex < selectedFolder.allPhotos.length) {
        setIsLoading(true);
        setSelectedPhotoIndex(nextIndex);
      }
    }
  };

  const handleFolderPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (selectedFolder && selectedPhotoIndex !== null) {
      const prevIndex = selectedPhotoIndex - 1;
      if (prevIndex >= 0) {
        setIsLoading(true);
        setSelectedPhotoIndex(prevIndex);
      }
    }
  };

  const closeFolderFullscreen = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      setSelectedFolder(null);
      setSelectedPhotoIndex(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFolderMode) return;

    if (selectedFolder && selectedPhotoIndex !== null) {
      const preloadImage = (index: number) => {
        if (index >= 0 && index < selectedFolder.allPhotos.length) {
          const img = new Image();
          img.src = selectedFolder.allPhotos[index];
        }
      };
      preloadImage(selectedPhotoIndex + 1);
      preloadImage(selectedPhotoIndex - 1);
    }
  }, [isFolderMode, selectedFolder, selectedPhotoIndex]);

  // =============== Container Size ===============
  useEffect(() => {
    const updateContainerSize = () => {
      if (!containerRef.current) return;
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    };
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, []);

  const photoHexData = useMemo(() => {
    const { width, height } = containerSize;
    if (!width || !height || photos.length === 0) return [];

    const hexRadius = width > height ? height / 4 : width / 6;
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;

    const centerX = width / 2;
    const columnOffsetX = hexWidth * 0.75;
    const rowOffsetY = hexHeight;

    // 3 columns (center, left, right)
    const columns = [0, -1, 1];
    let photoIndex = 0;
    let row = 0;

    const tmp: { x: number; y: number; item: ImageItem; index: number }[] = [];

    while (photoIndex < photos.length) {
      for (const col of columns) {
        if (photoIndex >= photos.length) break;

        const x = centerX + col * columnOffsetX - hexWidth / 2;
        const y = row * rowOffsetY + (Math.abs(col) === 1 ? rowOffsetY / 2 : 0);

        tmp.push({
          x,
          y,
          item: photos[photoIndex],
          index: photoIndex
        });

        photoIndex++;
      }
      row++;
    }
    return tmp;
  }, [containerSize, photos]);

  interface HexDatum {
    x: number;
    y: number;
    folder: FolderData | null;
    index: number;
  }

  const folderHexData: HexDatum[] = useMemo(() => {
    const { width, height } = containerSize;
    if (!width || !height) return [];

    const itemCount = folderData.length > 0 ? folderData.length : skeletonCount;
    if (itemCount === 0) return [];

    const hexRadius = width > height ? height / 4 : width / 6;
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;

    const centerX = width / 2;
    const columnOffsetX = hexWidth * 0.75;
    const rowOffsetY = hexHeight;

    const columns = [0, -1, 1];
    let folderIndex = 0;
    let row = 0;

    const tmp: HexDatum[] = [];

    while (folderIndex < itemCount) {
      for (const col of columns) {
        if (folderIndex >= itemCount) break;

        const x = centerX + col * columnOffsetX - hexWidth / 2;
        const y = row * rowOffsetY + (Math.abs(col) % 2 === 1 ? rowOffsetY / 2 : 0);

        tmp.push({
          x,
          y,
          folder: folderData.length > 0 ? folderData[folderIndex] : null,
          index: folderIndex
        });

        folderIndex++;
      }
      row++;
    }

    return tmp;
  }, [containerSize, folderData, skeletonCount]);

  // =============== Hex Path ===============
  const hexPath = useMemo(() => {
    const { width, height } = containerSize;
    if (!width || !height) return "";

    const r = width > height ? height / 4 : width / 6;
    const side = r * 2;
    const h = (r * Math.sqrt(3)) / 2;
    return `M0,${r}
      l${side * 0.25},${h}
      l${side * 0.5},0
      l${side * 0.25},-${h}
      l-${side * 0.25},-${h}
      l-${side * 0.5},0
      Z`;
  }, [containerSize]);

  return (
    <div className="h-screen w-screen bg-black/90 flex flex-col items-center">
      {/* Back Button */}
      <div className="absolute top-[2vw] left-[2vw] z-10">
        <BackButton textColor={COLORS.BACK_BUTTON_TEXT} color={COLORS.BACK_BUTTON_PURPLE} to={backTo || ""} />
      </div>

      {/* Main Container */}
      <div ref={containerRef} className="w-screen flex-1 mt-[max(9vw,9vh)] mb-1 custom-scrollbar overflow-auto">
        {isFolderMode
          ? (() => {
              const { width, height } = containerSize;
              if (!width || !height || folderHexData.length === 0) return null;

              const itemCount = folderData.length > 0 ? folderData.length : skeletonCount;
              const rowCount = Math.ceil(itemCount / 3);
              const hexRadius = width > height ? height / 4 : width / 6;
              const singleHexHeight = hexRadius * Math.sqrt(3);
              const svgHeight = Math.max(height, rowCount * singleHexHeight + singleHexHeight);

              return (
                <svg width={width} height={svgHeight} className="mx-auto block" style={{ overflow: "visible" }}>
                  <defs>
                    {folderHexData.map((d) => (
                      <clipPath key={`clip-hex-${d.index}`} id={`clip-hex-${d.index}`}>
                        <path d={hexPath} transform={`translate(${d.x}, ${d.y})`} />
                      </clipPath>
                    ))}
                  </defs>

                  {folderHexData.map((d) => {
                    const r = width > height ? height / 4 : width / 6;
                    const side = r * 2;
                    const centerX = d.x + side / 2;
                    const centerY = d.y + r;
                    const isHovered = hoveredIndex === d.index;
                    const scale = isHovered ? 0.9 : 1;

                    const imgX = d.x;
                    const imgY = d.y;
                    const imgW = side;
                    const imgH = r * Math.sqrt(3);

                    const scaleX = imgW / 300;
                    const scaleY = imgH / 300;
                    const coverScale = Math.max(scaleX, scaleY);
                    const scaledW = 300 * coverScale;
                    const scaledH = 300 * coverScale;
                    const offsetX = (imgW - scaledW) / 2;
                    const offsetY = (imgH - scaledH) / 2;

                    if (!d.folder) {
                      return (
                        <g key={`hex-skeleton-${d.index}`}>
                          <path d={hexPath} fill="#2a2a2a" transform={`translate(${imgX}, ${imgY})`} style={{ pointerEvents: "none" }}>
                            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
                          </path>
                          <path
                            d={hexPath}
                            fill="none"
                            stroke="#3a3a3a"
                            strokeWidth={2}
                            transform={`translate(${imgX}, ${imgY})`}
                            style={{ pointerEvents: "none" }}
                          />
                        </g>
                      );
                    }

                    return (
                      <g key={`hex-${d.index}`}>
                        <path
                          d={hexPath}
                          fill="transparent"
                          transform={`translate(${imgX}, ${imgY})`}
                          onMouseEnter={() => setHoveredIndex(d.index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          onClick={() => handleFolderHexClick(d.index)}
                          style={{ cursor: "pointer" }}
                        />

                        <g
                          transform={`translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX}, ${-centerY})`}
                          style={{
                            transition: "transform 0.15s ease-out",
                            pointerEvents: "none"
                          }}
                        >
                          <g clipPath={`url(#clip-hex-${d.index})`}>
                            <g transform={`translate(${imgX}, ${imgY})`}>
                              <g transform={`translate(${offsetX}, ${offsetY}) scale(${coverScale})`}>
                                <image
                                  xlinkHref={d.folder.coverPhoto}
                                  width={300}
                                  height={300}
                                  preserveAspectRatio="none"
                                  style={{ pointerEvents: "none" }}
                                />
                              </g>
                            </g>
                          </g>

                          <path
                            d={hexPath}
                            fill="none"
                            stroke="black"
                            strokeWidth={2}
                            transform={`translate(${imgX}, ${imgY})`}
                            style={{ pointerEvents: "none" }}
                          />
                        </g>
                      </g>
                    );
                  })}
                </svg>
              );
            })()
          : (() => {
              const { width, height } = containerSize;
              if (!width || !height) return null;

              const rowCount = Math.ceil(photos.length / 3);
              const hexRadius = width > height ? height / 4 : width / 6;
              const singleHexHeight = hexRadius * Math.sqrt(3);
              const svgHeight = Math.max(height, rowCount * singleHexHeight + singleHexHeight);

              return (
                <svg width={width} height={svgHeight} className="mx-auto block" style={{ overflow: "visible" }}>
                  <defs>
                    {photoHexData.map((d) => (
                      <clipPath key={`clip-hex-${d.index}`} id={`clip-hex-${d.index}`}>
                        <path d={hexPath} transform={`translate(${d.x}, ${d.y})`} />
                      </clipPath>
                    ))}
                  </defs>

                  {photoHexData.map((d) => {
                    const hr = width > height ? height / 4 : width / 6;
                    const side = hr * 2;
                    const cx = d.x + side / 2;
                    const cy = d.y + hr;
                    const isHovered = hoveredIndex === d.index;
                    const scale = isHovered ? 0.92 : 1;

                    const imgX = d.x;
                    const imgY = d.y;
                    const imgW = side;
                    const imgH = hr * Math.sqrt(3);

                    const scaleX = imgW / 300;
                    const scaleY = imgH / 300;
                    const coverScale = Math.max(scaleX, scaleY);
                    const scaledW = 300 * coverScale;
                    const scaledH = 300 * coverScale;
                    const offsetX = (imgW - scaledW) / 2;
                    const offsetY = (imgH - scaledH) / 2;

                    return (
                      <g key={`hex-${d.index}`}>
                        <path
                          d={hexPath}
                          fill="transparent"
                          transform={`translate(${imgX}, ${imgY})`}
                          onMouseEnter={() => setHoveredIndex(d.index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          onClick={() => handleHexClick(d.index)}
                          style={{
                            pointerEvents: "all",
                            cursor: "pointer"
                          }}
                        />

                        <g
                          transform={`translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})`}
                          style={{
                            transition: "transform 0.15s ease-out",
                            pointerEvents: "none"
                          }}
                        >
                          <g clipPath={`url(#clip-hex-${d.index})`}>
                            <g transform={`translate(${imgX}, ${imgY})`}>
                              <g transform={`translate(${offsetX}, ${offsetY}) scale(${coverScale})`}>
                                <image
                                  xlinkHref={d.item.thumbUrl}
                                  width={300}
                                  height={300}
                                  preserveAspectRatio="none"
                                  style={{ pointerEvents: "none" }}
                                />
                              </g>
                            </g>
                          </g>

                          <path
                            d={hexPath}
                            fill="none"
                            stroke="black"
                            strokeWidth={2}
                            transform={`translate(${imgX}, ${imgY})`}
                            style={{ pointerEvents: "none" }}
                          />
                        </g>
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
      </div>

      {!isFolderMode && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-20" onClick={closeFullscreen}>
          <img src={selectedPhoto} alt="" className="max-w-[90%] max-h-[80%] object-contain mb-4" onClick={(e) => e.stopPropagation()} />
          <div className="flex justify-center items-center w-full">
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-[#ffebcd] text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${
                selectedIndex === 0 ? "opacity-0" : "opacity-100"
              }`}
              onClick={handlePrevious}
            >
              &lt;
            </button>
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-[#ffebcd] text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${
                selectedIndex === photos.length - 1 ? "opacity-0" : "opacity-100"
              }`}
              onClick={handleNext}
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      {isFolderMode && selectedFolder && selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20" onClick={closeFolderFullscreen}>
          <img
            src={selectedFolder.allPhotos[selectedPhotoIndex]}
            alt=""
            className="max-w-[90%] max-h-[70%] object-contain mb-4"
            onClick={(e) => e.stopPropagation()}
            onLoad={() => setIsLoading(false)}
          />
          <div className="text-[#ffebcd] font-mono text-xl mb-4">{selectedFolder.folderName}</div>

          <div className="flex justify-center items-center w-full">
            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${
                isLoading ? "text-[#a09f9e]" : "text-[#ffebcd]"
              } ${selectedPhotoIndex === 0 ? "opacity-0 cursor-default" : "opacity-100 cursor-pointer"}`}
              onClick={handleFolderPrevious}
              disabled={isLoading || selectedPhotoIndex === 0}
            >
              &lt;
            </button>

            <button
              className={`mx-4 w-12 h-12 rounded-full bg-transparent text-4xl font-bold font-mono flex items-center justify-center transition-opacity duration-300 ${
                isLoading ? "text-[#a09f9e]" : "text-[#ffebcd]"
              } ${selectedPhotoIndex === selectedFolder.allPhotos.length - 1 ? "opacity-0 cursor-default" : "opacity-100 cursor-pointer"}`}
              onClick={handleFolderNext}
              disabled={isLoading || selectedPhotoIndex === selectedFolder.allPhotos.length - 1}
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TiledPlane;
