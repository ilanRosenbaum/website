import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownPageProps {
  url: string;
}

const MarkdownPage: React.FC<MarkdownPageProps> = ({ url }) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    fetch(url)
      .then((response) => response.text())
      .then((text) => setContent(text));
  }, [url]);

  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default MarkdownPage;
