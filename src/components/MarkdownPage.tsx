import React, { ReactNode, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import BackButton from "./BackButton";
import RestaurantTable from "./RestaurantTable";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

        setMarkdown(text);

        if (googleSheetId && googleSheetGids && googleSheetGids.length > 0) {
          const sheetDatas = await Promise.all(
            googleSheetGids.map(async (gid) => {
              return await fetchPublicGoogleSheetData(googleSheetId, gid);
            })
          );

          setTableDatas(sheetDatas);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
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

  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  const renderContent = (): ReactNode => {
    if (!markdown) return null;

    const elements: ReactNode[] = [];
    const placeholderRegex = /{{GOOGLE_SHEETS_DATA_\d+}}/g;
    const parts = markdown.split(placeholderRegex);

    parts.forEach((part, index) => {
      if (part) {
        elements.push(
          <ReactMarkdown key={`md-${index}`} className="markdown font-mono text-[#ffebcd]" components={components} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
            {part}
          </ReactMarkdown>
        );
      }

      if (index < parts.length - 1) {
        const placeholderIndex = parseInt(markdown.match(placeholderRegex)?.[index]?.match(/\d+/)?.[0] || "1") - 1;
        elements.push(
          isLoading ? (
            <div key={`loading-${index}`} className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <RestaurantTable key={`table-${index}`} data={tableDatas[placeholderIndex] || []} />
          )
        );
      }
    });

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
