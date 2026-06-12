"use client";

import { useState, useMemo } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({
  code,
  language = "bash",
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const linesCount = useMemo(() => code.split("\n").length, [code]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl my-6">
      {filename && (
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-gray-400">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {filename}
        </div>
      )}

      <button
        onClick={handleCopy}
        className="absolute right-4 top-4 z-30 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-mono text-gray-400 opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:border-white/20 hover:bg-black/80 hover:text-white max-sm:opacity-100"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>

      <div className="overflow-x-auto rounded-2xl">
        <div className="relative">
          <div className="sticky left-0 z-20 float-left -ml-[1px] shrink-0 select-none border-r border-white/10 bg-black/80 text-right font-mono text-sm text-gray-500 backdrop-blur-md">
            <div className="px-4 py-5 max-sm:px-2 max-sm:py-4">
              {Array.from({ length: linesCount }, (_, i) => (
                <div key={i} className="leading-[26px] max-sm:leading-[26px]">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-max">
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "1.25rem",
                  background: "transparent",
                  fontSize: "14px",
                  lineHeight: "26px",
                  fontFamily:
                    "'SF Mono', 'Menlo', 'Consolas', 'Monaco', 'Courier New', monospace",
                  whiteSpace: "pre",
                  overflow: "visible",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    lineHeight: "inherit",
                    whiteSpace: "pre",
                  },
                }}
                showLineNumbers={false}
                wrapLongLines={false}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}
