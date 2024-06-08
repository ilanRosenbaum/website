import React, { useState } from "react";
import SierpinskiHexagon from "./components/SierpinskiHexagon";
import MarkdownPage from "./components/MarkdownPage";

const App: React.FC = () => {
  const [page, setPage] = useState<string | null>(null);

  const handleSectionClick = (x: number, y: number, size: number) => {
    // Logic to determine which section was clicked
    // For demonstration, we'll just set a static markdown page
    setPage("content/Test.md");
  };

  return <SierpinskiHexagon />;
};

export default App;
