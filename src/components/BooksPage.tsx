import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import BackButton from "./BackButton";

/** Shape of each row in the "Read" table. */
export interface BookData {
  Title: string;
  Rank: string;
  "Author(s)": string;
  "Date Finished": string;
  Notes: string;
}

/** Which columns we can sort by. */
type SortableColumn = "Rank" | "Date Finished";

/** A table specifically for “Read” books, with sorting by date/rank. */
const BooksTable: React.FC<{ data: BookData[] }> = ({ data }) => {
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  function handleSortClick(column: SortableColumn) {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  }

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (sortColumn === "Date Finished") {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortColumn === "Rank") {
        const rankOrder: Record<string, number> = {
          favorite: 1,
          great: 2,
          good: 3,
          "didn't like": 4
        };
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        const orderA = rankOrder[strA] ?? 9999;
        const orderB = rankOrder[strB] ?? 9999;
        return sortOrder === "asc" ? orderA - orderB : orderB - orderA;
      } else {
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortOrder === "asc" ? -1 : 1;
        if (strA > strB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
    });
  }, [data, sortColumn, sortOrder]);

  function renderSortIndicator(column: SortableColumn) {
    const triangleClass = "inline-block ml-1 align-middle";
    if (sortColumn === column) {
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
          <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700 font-sans text-white">Title</th>
          <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700 font-sans text-white cursor-pointer" onClick={() => handleSortClick("Rank")}>
            Rank{renderSortIndicator("Rank")}
          </th>
          <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700 font-sans text-white">Author(s)</th>
          <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700 font-sans text-white cursor-pointer" onClick={() => handleSortClick("Date Finished")}>
            Date Finished{renderSortIndicator("Date Finished")}
          </th>
          <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700 font-sans text-white">Notes</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-900 hover:bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap font-sans text-white">{row.Title}</td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap font-sans text-white">{row.Rank}</td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap font-sans text-white">{row["Author(s)"]}</td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap font-sans text-white">{row["Date Finished"]}</td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap font-sans text-white">{row.Notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/** The 5-column header that identifies the "Read" books table. */
const BOOKS_HEADER = ["Title", "Rank", "Author(s)", "Date Finished", "Notes"];

function stripTrailingEmptyCells(cells: string[]): string[] {
  while (cells.length > 0 && cells[cells.length - 1].trim() === "") {
    cells.pop();
  }
  return cells;
}

function parseMarkdownTable(node: any): string[][] {
  if (!node || node.tagName !== "table") return [];

  // Collect all rows by looking in thead/tbody/tfoot (whatever exists)
  const rowElements: any[] = [];
  node.children?.forEach((child: any) => {
    // child might be <thead>, <tbody>, or <tfoot>
    if (child.type === "element" && ["thead", "tbody", "tfoot"].includes(child.tagName)) {
      child.children?.forEach((tr: any) => {
        // Now tr should be your <tr>
        if (tr.type === "element" && tr.tagName === "tr") {
          rowElements.push(tr);
        }
      });
    }
  });

  // Convert each <tr> -> array of string cells
  const allRows: string[][] = rowElements.map((tr) => {
    // tr.children are the <td> or <th> elements
    const cells = tr.children
      ?.filter((tdOrTh: any) => tdOrTh.type === "element" && ["td", "th"].includes(tdOrTh.tagName))
      .map((tdOrTh: any) => {
        // Each <td>/<th> might contain a <p> or direct text
        const textParts = tdOrTh.children
          ?.map((maybeParagraph: any) => {
            if (maybeParagraph.type === "element" && maybeParagraph.tagName === "p") {
              // <p> might have a text node inside
              return maybeParagraph.children?.map((child: any) => (child.type === "text" ? child.value : "")).join("");
            } else if (maybeParagraph.type === "text") {
              // If directly text in <td>
              return maybeParagraph.value;
            }
            return "";
          })
          .filter(Boolean);

        // Combine any text nodes in that cell
        return textParts?.join("").trim() || "";
      });

    return stripTrailingEmptyCells(cells || []);
  });

  // Filter out alignment / separator rows
  return allRows.filter((row) => !row.every((cell) => /^[-\s]+$/.test(cell)));
}

/** Check if the first row matches `BOOKS_HEADER`. */
function isBooksTable(parsedRows: string[][]): boolean {
  console.log(parsedRows[0]);
  if (!parsedRows.length) return false;
  if (parsedRows[0].length !== BOOKS_HEADER.length) return false;
  return parsedRows[0].every((cell, idx) => cell === BOOKS_HEADER[idx]);
}

/** Convert the rest of the rows into BookData (skip the header row). */
function convertRowsToBooksData(rows: string[][]): BookData[] {
  return rows.slice(1).map((cols) => ({
    Title: cols[0] || "",
    Rank: cols[1] || "",
    "Author(s)": cols[2] || "",
    "Date Finished": cols[3] || "",
    Notes: cols[4] || ""
  }));
}

interface BooksPageProps {
  source?: string; // Path to the .md file
  backTo?: string; // Where to link "Back" button
  backButtonFill?: string; // Color of the back button icon
  textColor?: string; // Color for the button text
  useWideContainer?: boolean;
}

/**
 * The main page that fetches & displays an entire Markdown file.
 * - We look for any <table> that matches the "Read" table header
 * - If so, we turn it into a sortable BooksTable
 * - Everything else is displayed normally (including the "Unread" table)
 */
const BooksPage: React.FC<BooksPageProps> = ({ source = "/content/MiscBooks.md", backTo = "/misc", backButtonFill = "#603b61", textColor = "#ffefdb", useWideContainer = true }) => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(source)
      .then((res) => res.text())
      .then((text) => setMarkdown(text))
      .catch(console.error);
  }, [source]);

  // We only override the <table> (and related table elements) to detect if it’s the “Read” table.
  const components = {
    // Intercept any <table>, parse it, check if it's "books"
    table({ node, children }: any) {
      const parsed = parseMarkdownTable(node);
      if (isBooksTable(parsed)) {
        const bookData = convertRowsToBooksData(parsed);
        return <BooksTable data={bookData} />;
      }
      // Otherwise just render a normal table
      return <table className="min-w-full border-collapse border border-gray-700 font-sans text-white">{children}</table>;
    },

    thead({ children }: any) {
      return <thead className="bg-gray-800 text-white font-sans">{children}</thead>;
    },

    th({ children }: any) {
      return <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700 font-sans text-white">{children}</th>;
    },

    td({ children }: any) {
      return <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap font-sans text-white">{children}</td>;
    },

    // Make <a> tags open in a new tab
    a({ href, children, ...props }: any) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }
  };

  return (
    <div className="h-screen w-screen bg-black/90 text-white overflow-hidden p-4">
      {/* Back button */}
      <div className="absolute top-8 left-8 z-10">
        <BackButton textColor={textColor} color={backButtonFill} to={backTo} />
      </div>

      {/* Main scrollable container */}
      <div className={`${useWideContainer ? "markdown-container-wide" : "markdown-container"} h-full overflow-auto`}>
        <ReactMarkdown className="markdown font-mono text-[#ffebcd]" components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {markdown}
        </ReactMarkdown>
      </div>

      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">Copyright © 2024 Ilan Rosenbaum</div>
    </div>
  );
};

export default BooksPage;
