import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import BackButton from "./BackButton";

const MarkdownPage: React.FC<{ source: string; backTo?: string; backButtonFill?: string; textColor?: string }> = ({ source, backTo, backButtonFill, textColor }) => {
  const [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    console.log("Fetching from source:", source);

    fetch(source)
      .then(async (response) => {
        const text = await response.text();
        console.log("Response:", text);
        setMarkdown(text);
      })
      .catch((error) => console.error("Error fetching markdown:", error));
  }, [source]);

  return (
    <div className="bg-black/90 min-h-screen p-4">
      <div className="absolute top-8 left-8 z-10">
        <BackButton textColor={textColor || "#ffefdb"} color={backButtonFill || "#603b61"} to={backTo || "/"} />
      </div>
      <div className="markdown-container">
        <ReactMarkdown className="markdown font-mono text-[#ffebcd]">{markdown}</ReactMarkdown>
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-50">Copyright © 2024 Ilan Rosenbaum All rights reserved.</div>
    </div>
  );
};

export default MarkdownPage;
