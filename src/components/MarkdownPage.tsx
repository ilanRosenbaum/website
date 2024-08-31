import React, { ReactNode, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import BackButton from "./BackButton";
import RestaurantTable from "./RestaurantTable";

interface MarkdownPageProps {
  source: string;
  backTo?: string;
  backButtonFill?: string;
  textColor?: string;
  googleSheetId?: string;
  googleSheetGids?: string[];
  useWideContainer?: boolean;
}

const MarkdownPage: React.FC<MarkdownPageProps> = ({ source, backTo, backButtonFill, textColor, googleSheetId, googleSheetGids, useWideContainer = false }) => {
  const [markdown, setMarkdown] = useState<string>("");
  const [tableDatas, setTableDatas] = useState<any[][]>([]);

  useEffect(() => {
    const fetchPublicGoogleSheetData = async (sheetId: string, gid: string): Promise<any[]> => {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
      const response = await fetch(url);
      const csvData = await response.text();
      return parseCSV(csvData);
    };

    const fetchMarkdownAndSheetData = async () => {
      try {
        const response = await fetch(source);
        let text = await response.text();

        if (googleSheetId && googleSheetGids && googleSheetGids.length > 0) {
          const sheetDatas = await Promise.all(googleSheetGids.map((gid) => fetchPublicGoogleSheetData(googleSheetId, gid)));
          setTableDatas(sheetDatas);

          // Replace placeholders for each table
          sheetDatas.forEach((_, index) => {
            text = text.replace(`{{GOOGLE_SHEETS_DATA_${index + 1}}}`, `{{TABLE_PLACEHOLDER_${index + 1}}}`);
          });
        }

        setMarkdown(text);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMarkdownAndSheetData();
  }, [source, googleSheetId, googleSheetGids]);

  const parseCSV = (csvText: string): any[] => {
    const rows = csvText.split("\n").map((row) => {
      const cells = [];
      let inQuotes = false;
      let currentCell = "";
      for (let i = 0; i < row.length; i++) {
        if (row[i] === '"') {
          inQuotes = !inQuotes;
        } else if (row[i] === "," && !inQuotes) {
          cells.push(currentCell.trim());
          currentCell = "";
        } else {
          currentCell += row[i];
        }
      }
      cells.push(currentCell.trim());
      return cells;
    });

    const headers = rows[0];
    return rows.slice(1).map((row) => {
      return headers.reduce((obj, header, index) => {
        obj[header.replace(/^"|"$/g, "")] = row[index]?.replace(/^"|"$/g, "") || "";
        return obj;
      }, {} as any);
    });
  };

  const renderContent = (): ReactNode => {
    if (!markdown) return null;

    const elements: ReactNode[] = [];
    let remainingMarkdown = markdown;

    tableDatas.forEach((tableData, index) => {
      const placeholder = `{{TABLE_PLACEHOLDER_${index + 1}}}`;
      const parts = remainingMarkdown.split(placeholder);

      if (parts.length > 1) {
        // Add the markdown before the placeholder
        if (parts[0]) {
          elements.push(
            <ReactMarkdown key={`md-${index}-before`} className="markdown font-mono text-[#ffebcd]">
              {parts[0]}
            </ReactMarkdown>
          );
        }

        // Add the table
        elements.push(<RestaurantTable key={`table-${index}`} data={tableData} />);

        // Update remainingMarkdown for the next iteration
        remainingMarkdown = parts.slice(1).join(placeholder);
      }
    });

    // Add any remaining markdown after the last table
    if (remainingMarkdown) {
      elements.push(
        <ReactMarkdown key="md-final" className="markdown font-mono text-[#ffebcd]">
          {remainingMarkdown}
        </ReactMarkdown>
      );
    }

    return elements;
  };

  return (
    <div className="h-screen w-screen bg-black/90 text-white overflow-hidden p-4">
      <div className="absolute top-8 left-8 z-10">
        <BackButton textColor={textColor || "#ffefdb"} color={backButtonFill || "#603b61"} to={backTo || "/"} />
      </div>
      <div className={`${useWideContainer ? "markdown-container-wide" : "markdown-container"} h-full overflow-auto`}>{renderContent()}</div>
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">Copyright © 2024 Ilan Rosenbaum All rights reserved.</div>
    </div>
  );
};

export default MarkdownPage;
