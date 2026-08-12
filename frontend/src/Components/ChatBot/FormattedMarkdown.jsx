import React, { useState, useEffect } from "react";

/**
 * Renders inline formatting like **bold**, *italic*, and `code`
 */
function renderInlineFormatted(text) {
  if (typeof text !== "string") return text;

  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={idx} className="font-semibold text-slate-900 bg-emerald-50/60 px-0.5 rounded">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2 && !part.startsWith("**")) {
      return (
        <em key={idx} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={idx} className="bg-emerald-100/70 text-emerald-900 px-1.5 py-0.5 rounded text-[0.85em] font-mono font-medium">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/**
 * Built-in zero-dependency Markdown & Table Parser
 * Formats pipe tables, headings (###), bold text (**), bullet lists (-), and inline code.
 */
function CustomMarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let tableRows = [];
  let listItems = [];
  let keyCounter = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${keyCounter++}`} className="list-disc pl-5 my-2 space-y-1 text-slate-700">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderInlineFormatted(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const validRows = tableRows.filter((r) => !r.some((cell) => cell.includes("---")));
      if (validRows.length > 0) {
        const headerRow = validRows[0];
        const bodyRows = validRows.slice(1);

        elements.push(
          <div key={`table-${keyCounter++}`} className="my-3 overflow-x-auto rounded-xl border border-emerald-200/80 shadow-xs bg-white">
            <table className="min-w-full divide-y divide-emerald-100 text-xs text-left">
              <thead className="bg-emerald-50 font-semibold text-emerald-900 uppercase tracking-wider text-[11px]">
                <tr>
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} className="px-3.5 py-2.5 font-semibold text-emerald-900 border-r border-emerald-100 last:border-r-0">
                      {renderInlineFormatted(cell.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100/70 bg-white">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-emerald-50/30 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2 text-slate-700 border-r border-emerald-100/50 last:border-r-0">
                        {renderInlineFormatted(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check table line
    if (line.startsWith("|") && (line.endsWith("|") || line.includes("|"))) {
      flushList();
      const cells = line.split("|").map((c) => c.trim());
      if (cells[0] === "") cells.shift();
      if (cells[cells.length - 1] === "") cells.pop();
      tableRows.push(cells);
      continue;
    } else {
      flushTable();
    }

    // Check bullet item
    if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line.substring(2).trim());
      continue;
    } else {
      flushList();
    }

    // Check headers
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${keyCounter++}`} className="text-xs sm:text-sm font-bold text-emerald-800 mt-2.5 mb-1">
          {renderInlineFormatted(line.substring(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${keyCounter++}`} className="text-sm sm:text-base font-bold text-emerald-900 mt-3 mb-1">
          {renderInlineFormatted(line.substring(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${keyCounter++}`} className="text-base sm:text-lg font-bold text-emerald-900 mt-3 mb-1.5 border-b border-emerald-100 pb-1">
          {renderInlineFormatted(line.substring(2))}
        </h1>
      );
      continue;
    }

    if (line === "") {
      continue;
    }

    // Paragraph line
    elements.push(
      <p key={`p-${keyCounter++}`} className="mb-2 last:mb-0 leading-relaxed text-slate-700">
        {renderInlineFormatted(line)}
      </p>
    );
  }

  flushList();
  flushTable();

  return <div className="markdown-content text-slate-800 text-xs sm:text-sm leading-relaxed space-y-2 break-words">{elements}</div>;
}

export default function FormattedMarkdown({ content, isUser = false }) {
  const [ReactMarkdownModule, setReactMarkdownModule] = useState(null);
  const [RemarkGfmModule, setRemarkGfmModule] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      import("react-markdown").catch(() => null),
      import("remark-gfm").catch(() => null)
    ]).then(([rm, gfm]) => {
      if (isMounted && rm && gfm) {
        setReactMarkdownModule(() => rm.default || rm);
        setRemarkGfmModule(() => gfm.default || gfm);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!content) return null;

  if (isUser) {
    return <div className="whitespace-pre-wrap break-words">{content}</div>;
  }

  if (ReactMarkdownModule && RemarkGfmModule) {
    const ReactMarkdown = ReactMarkdownModule;
    const remarkGfm = RemarkGfmModule;

    return (
      <div className="markdown-content text-slate-800 text-xs sm:text-sm leading-relaxed space-y-2 break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-base sm:text-lg font-bold text-emerald-900 mt-3 mb-1.5 border-b border-emerald-100 pb-1" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-sm sm:text-base font-bold text-emerald-900 mt-3 mb-1" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xs sm:text-sm font-bold text-emerald-800 mt-2.5 mb-1" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-xs font-semibold text-emerald-800 mt-2 mb-1" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-2 last:mb-0 leading-relaxed text-slate-700" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-slate-900 bg-emerald-50/60 px-0.5 rounded" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="italic text-slate-800" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-5 my-2 space-y-1 text-slate-700" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-700" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="leading-relaxed" {...props} />
            ),
            table: ({ node, ...props }) => (
              <div className="my-3 overflow-x-auto rounded-xl border border-emerald-200/80 shadow-xs bg-white">
                <table className="min-w-full divide-y divide-emerald-100 text-xs text-left" {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-emerald-50 font-semibold text-emerald-900 uppercase tracking-wider text-[11px]" {...props} />
            ),
            tbody: ({ node, ...props }) => (
              <tbody className="divide-y divide-emerald-100/70 bg-white" {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr className="hover:bg-emerald-50/30 transition-colors" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th className="px-3.5 py-2.5 font-semibold text-emerald-900 border-r border-emerald-100 last:border-r-0" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="px-3.5 py-2 text-slate-700 border-r border-emerald-100/50 last:border-r-0" {...props} />
            ),
            code: ({ node, inline, className, children, ...props }) => {
              return inline ? (
                <code className="bg-emerald-100/70 text-emerald-900 px-1.5 py-0.5 rounded text-[0.85em] font-mono font-medium" {...props}>
                  {children}
                </code>
              ) : (
                <div className="my-2.5 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xs">
                  <pre className="p-3 text-slate-100 text-xs font-mono overflow-x-auto leading-normal">
                    <code {...props}>{children}</code>
                  </pre>
                </div>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-3 border-emerald-500 pl-3.5 py-1.5 my-2.5 bg-emerald-50/60 rounded-r-xl text-emerald-900 italic" {...props} />
            ),
            hr: ({ node, ...props }) => (
              <hr className="my-3 border-emerald-100" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-emerald-700 underline font-medium hover:text-emerald-900" target="_blank" rel="noopener noreferrer" {...props} />
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // Fallback to custom built-in parser
  return <CustomMarkdownRenderer content={content} />;
}
