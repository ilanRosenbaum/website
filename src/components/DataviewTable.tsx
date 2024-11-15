const DataviewTable: React.FC<{ content: string }> = ({ content }) => {
  const executeDataviewJS = (code: string) => {
    try {
      let renderedHTML = "";

      // Mock dv object
      const sandbox: any = {
        console: console, // Allow console logging
        dv: {
          table: (headers: string[], data: any[][]) => {
            const tableHTML = `
              <table class="min-w-full border-collapse border border-gray-700 font-sans text-white">
                <thead class="bg-gray-800 text-white font-sans">
                  <tr>
                    ${headers.map((header) => `<th class="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700 font-sans text-white">${header}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${data
                    .map(
                      (row, index) => `
                      <tr class="${index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"} hover:bg-gray-700">
                        ${row.map((cell) => `<td class="px-4 py-2 border-t border-gray-700 whitespace-nowrap font-sans text-white">${cell !== undefined && cell !== null ? cell : ""}</td>`).join("")}
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            `;
            return tableHTML;
          },
          markdownTable: (headers: string[], rows: any[][]) => {
            const tableHTML = `
              <table class="min-w-full border-collapse border border-gray-700 font-sans text-white">
                <thead class="bg-gray-800 text-white font-sans">
                  <tr>
                    ${headers.map((header) => `<th class="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700 font-sans text-white">${header}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${rows
                    .map(
                      (row, index) => `
                      <tr class="${index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"} hover:bg-gray-700">
                        ${row.map((cell) => `<td class="px-4 py-2 border-t border-gray-700 whitespace-nowrap font-sans text-white">${cell !== undefined && cell !== null ? cell : ""}</td>`).join("")}
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            `;
            return tableHTML;
          },
          el: (tag: string, content: any, attrs?: Record<string, any>) => {
            const attributes = attrs
              ? Object.entries(attrs)
                  .map(([key, value]) => {
                    if (key === 'cls') {
                      return `class="${value}"`; // Map 'cls' to 'class'
                    } else {
                      return `${key}="${value}"`;
                    }
                  })
                  .join(" ")
              : "";
            let innerContent = "";
      
            if (content === undefined || content === null) {
              innerContent = "";
            } else if (typeof content === "string") {
              innerContent = content;
            } else if (typeof content === "function") {
              const el = { innerHTML: "" };
              content(el);
              innerContent = el.innerHTML;
            } else if (content instanceof HTMLElement) {
              innerContent = content.outerHTML;
            } else {
              innerContent = String(content);
            }
      
            let toBeAdded = `<${tag} ${attributes}>${innerContent}</${tag}>`;
            toBeAdded = toBeAdded.replace(/\s+/g, " ").trim(); // Clean up any extra whitespace
      
            renderedHTML += toBeAdded;
            return ""; // Explicitly return an empty string
          }
        }
      };
      

      // Wrap the user's code in an IIFE
      const script = `
        (function() {
          ${code}
        })();
      `;

      // Get the keys and values from the sandbox to pass into Function
      const argNames = Object.keys(sandbox);
      const argValues = Object.values(sandbox);

      // Execute the user's code without appending its return value
      new Function(...argNames, script)(...argValues);

      console.log("renderedHTML:", renderedHTML);

      return renderedHTML;
    } catch (error) {
      console.error("Error executing dataviewjs:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `<div class="text-red-500">Error executing dataviewjs: ${errorMessage}</div>`;
    }
  };

  return (
    <div dangerouslySetInnerHTML={{ __html: executeDataviewJS(content) }} />
  );
};

export default DataviewTable;
