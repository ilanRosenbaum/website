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

import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import BackButton from "./BackButton";
import { Footer } from "../Constants";

export type SortMapping = Record<string, number>;

export interface TableColumn {
  header: string;
  accessor: string;
  sortable: boolean;
  sortType?: "string" | "date" | "number" | "custom";
  sortMapping?: SortMapping;
  customSort?: (a: any, b: any) => number;
  fallbackSort?: boolean;
  fallbackOrder?: "asc" | "desc";
  default?: "asc" | "desc";
}

interface SortableTableProps {
  data: any[];
  columns: ReadonlyArray<TableColumn>;
}

function stripTrailingEmptyCells(cells: string[]): string[] {
  while (cells.length > 0 && cells[cells.length - 1].trim() === "") {
    cells.pop();
  }
  return cells;
}

function getComparisonValue(column: TableColumn, value: any): number {
  switch (column.sortType) {
    case "date":
      return new Date(value).getTime();
    case "number":
      return Number(value);
    case "custom":
      if (column.sortMapping) {
        return column.sortMapping[value.toLowerCase()] ?? Number.MAX_VALUE;
      }
      return 0;
    case "string":
    default:
      return 0;
  }
}

function compareValues(column: TableColumn, valueA: any, valueB: any, sortOrder: "asc" | "desc"): number {
  if (column.customSort) {
    return sortOrder === "asc" ? column.customSort(valueA, valueB) : column.customSort(valueB, valueA);
  }

  let comparison = 0;

  switch (column.sortType) {
    case "date":
    case "number":
    case "custom":
      const numA = getComparisonValue(column, valueA);
      const numB = getComparisonValue(column, valueB);
      comparison = numA - numB;
      break;
    case "string":
    default:
      comparison = String(valueA).localeCompare(String(valueB));
      break;
  }

  return sortOrder === "asc" ? comparison : -comparison;
}

function parseMarkdownTable(node: any): string[][] {
  if (!node || node.tagName !== "table") return [];

  const rowElements: any[] = [];
  node.children?.forEach((child: any) => {
    if (child.type === "element" && ["thead", "tbody", "tfoot"].includes(child.tagName)) {
      child.children?.forEach((tr: any) => {
        if (tr.type === "element" && tr.tagName === "tr") {
          rowElements.push(tr);
        }
      });
    }
  });

  const allRows: string[][] = rowElements.map((tr) => {
    const cells = tr.children
      ?.filter((tdOrTh: any) => tdOrTh.type === "element" && ["td", "th"].includes(tdOrTh.tagName))
      .map((tdOrTh: any) => {
        const textParts = tdOrTh.children
          ?.map((maybeParagraph: any) => {
            if (maybeParagraph.type === "element" && maybeParagraph.tagName === "p") {
              return maybeParagraph.children?.map((child: any) => (child.type === "text" ? child.value : "")).join("");
            } else if (maybeParagraph.type === "text") {
              return maybeParagraph.value;
            }
            return "";
          })
          .filter(Boolean);

        return textParts?.join("").trim() || "";
      });

    return stripTrailingEmptyCells(cells || []);
  });

  return allRows.filter((row) => !row.every((cell) => /^[-\s]+$/.test(cell)));
}

function isMatchingTable(parsedRows: string[][], columns: ReadonlyArray<TableColumn>): boolean {
  if (!parsedRows.length) return false;
  if (parsedRows[0].length !== columns.length) return false;
  return parsedRows[0].every((cell, idx) => cell === columns[idx].header);
}

function convertRowsToData(rows: string[][], columns: ReadonlyArray<TableColumn>): any[] {
  return rows.slice(1).map((row) => {
    const rowData: any = {};
    columns.forEach((col, idx) => {
      rowData[col.accessor] = row[idx] || "";
    });
    return rowData;
  });
}

const SortableTable: React.FC<SortableTableProps> = ({ data, columns }) => {
  // Find default sort column if it exists
  const defaultColumn = useMemo(() => columns.find((col) => col.default), [columns]);

  const [sortColumn, setSortColumn] = useState<string | null>(defaultColumn?.accessor || null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultColumn?.default || "asc");

  // Find the fallback sort column if one exists
  const fallbackColumn = useMemo(() => columns.find((col) => col.fallbackSort), [columns]);

  // Reset sort state when columns change
  useEffect(() => {
    setSortColumn(defaultColumn?.accessor || null);
    setSortOrder(defaultColumn?.default || "asc");
  }, [defaultColumn]);

  function handleSortClick(column: TableColumn) {
    if (!column.sortable) return;

    if (sortColumn === column.accessor) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column.accessor);
      setSortOrder(column.default || "asc");
    }
  }

  const sortedData = useMemo(() => {
    if (!sortColumn && !fallbackColumn) return data;

    return [...data].sort((a, b) => {
      // If we have an active sort column, use it first
      if (sortColumn) {
        const primaryColumn = columns.find((col) => col.accessor === sortColumn);
        if (!primaryColumn) return 0;

        const primaryComparison = compareValues(primaryColumn, a[sortColumn], b[sortColumn], sortOrder);

        // If there's a tie and we have a fallback column, use it
        if (primaryComparison === 0 && fallbackColumn && primaryColumn !== fallbackColumn) {
          return compareValues(
            fallbackColumn,
            a[fallbackColumn.accessor],
            b[fallbackColumn.accessor],
            fallbackColumn.fallbackOrder || "desc" // Use specified fallback order or default to desc
          );
        }

        return primaryComparison;
      }

      // If no active sort column but we have a fallback, use it
      if (fallbackColumn) {
        return compareValues(fallbackColumn, a[fallbackColumn.accessor], b[fallbackColumn.accessor], "desc");
      }

      return 0;
    });
  }, [data, sortColumn, sortOrder, columns, fallbackColumn]);
  function renderSortIndicator(column: TableColumn) {
    if (!column.sortable) return null;

    const triangleClass = "inline-block ml-1 align-middle";
    if (sortColumn === column.accessor) {
      return sortOrder === "asc" ? (
        <svg className={triangleClass} width="12" height="12" viewBox="0 0 24 24">
          <path d="M12 4 L22 18 L2 18 Z" fill="currentColor" />
        </svg>
      ) : (
        <svg className={triangleClass} width="12" height="12" viewBox="0 0 24 24">
          <path d="M12 20 L2 6 L22 6 Z" fill="currentColor" />
        </svg>
      );
    }
    return (
      <div className={triangleClass}>
        <svg width="12" height="16" viewBox="0 0 24 32">
          <path d="M12 4 L22 14 L2 14 Z" fill="currentColor" />
          <path d="M12 28 L2 18 L22 18 Z" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return (
    <table className="min-w-full border-collapse border border-gray-700 font-sans text-white">
      <thead className="bg-gray-800 text-white font-sans">
        <tr>
          {columns.map((column) => (
            <th
              key={column.accessor}
              className={`px-4 py-2 text-left border-b border-gray-700 font-sans text-white max-w-[40ch] ${column.sortable ? "cursor-pointer" : ""}`}
              onClick={() => handleSortClick(column)}
            >
              {column.header}
              {renderSortIndicator(column)}
              {column.fallbackSort && !sortColumn && <span className="ml-1 text-gray-400 text-sm">(default sort)</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-900 hover:bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}>
            {columns.map((column) => (
              <td key={column.accessor} className="px-4 py-2 border-t border-gray-700 font-sans text-white break-words max-w-[40ch]">
                {row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
interface WrapperProps {
  source?: string;
  backTo?: string;
  backButtonFill?: string;
  textColor?: string;
  useWideContainer?: boolean;
  columns: ReadonlyArray<TableColumn>;
  data?: any[];
}
interface WrapperProps {
  source?: string;
  backTo?: string;
  backButtonFill?: string;
  textColor?: string;
  useWideContainer?: boolean;
  columns: ReadonlyArray<TableColumn>;
  data?: any[];
}

const Wrapper: React.FC<WrapperProps> = ({
  source = "/content/MiscBooks.md",
  backTo = "/misc",
  backButtonFill = "#603b61",
  textColor = "#ffefdb",
  useWideContainer = true,
  columns,
  data: initialData
}) => {
  const [markdown, setMarkdown] = useState("");
  const [, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (initialData) {
      setTableData(initialData);
    } else if (source) {
      fetch(source)
        .then((res) => res.text())
        .then((text) => setMarkdown(text))
        .catch(console.error);
    }
  }, [source, initialData]);

  const components = useMemo(
    () => ({
      table({ node }: any) {
        const parsedRows = parseMarkdownTable(node);
        if (isMatchingTable(parsedRows, columns)) {
          const data = convertRowsToData(parsedRows, columns);
          return <SortableTable data={data} columns={columns} />;
        }

        // Render as normal table
        return (
          <table className="min-w-full border-collapse border border-gray-700 font-sans text-white">
            <thead className="bg-gray-800">
              <tr>
                {node.children[0]?.children[0]?.children?.map((th: any, index: number) => (
                  <th key={index} className="px-4 py-2 text-left border-b border-gray-700 font-sans text-white max-w-[40ch]">
                    {th.children?.[0]?.value || ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {node.children[1]?.children?.map((tr: any, rowIndex: number) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}>
                  {tr.children?.map((td: any, cellIndex: number) => (
                    <td key={cellIndex} className="px-4 py-2 border-t border-gray-700 font-sans text-white break-words max-w-[40ch]">
                      {td.children?.[0]?.value || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
    }),
    [columns]
  );

  return (
    <div className="h-screen w-screen bg-black/90 text-white overflow-hidden p-4">
      <div className="absolute top-8 left-8 z-10">
        <BackButton textColor={textColor} color={backButtonFill} to={backTo} />
      </div>

      <div className={`${useWideContainer ? "markdown-container-wide" : "markdown-container"} h-full overflow-auto`}>
        <ReactMarkdown className="markdown font-mono text-[#ffebcd]" components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {markdown}
        </ReactMarkdown>
      </div>

      <Footer />
    </div>
  );
};

export default Wrapper;
