import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';


const MarkdownPage: React.FC<{ source: string }> = ({ source }) => {

  useEffect(() => {
    fetch(source)
      .then((response) => response.text())
      .catch((error) => console.error('Error fetching markdown:', error));
  }, [source]);

  return (
    <div className="bg-black/90 text-white min-h-screen p-4">
      <div className="markdown-container">
        <ReactMarkdown className="markdown" children={"# TEST\n\n## TEST TEST"} />
      </div>
    </div>
  );
};

export default MarkdownPage;
