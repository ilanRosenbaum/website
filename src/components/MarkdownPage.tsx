import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownPage: React.FC = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/content/Test.md')
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return <ReactMarkdown children={markdown} />;
};

export default MarkdownPage;