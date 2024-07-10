import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const MarkdownPage: React.FC<{ source: string }> = ({ source }) => {
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
    <div className="bg-black/90 text-white min-h-screen p-4">
      <div className="markdown-container">
        <ReactMarkdown className="markdown">{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownPage;