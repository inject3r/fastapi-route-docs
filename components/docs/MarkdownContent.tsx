"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../ui/CodeBlock";

interface MarkdownContentProps {
  content: string;
}

interface CodeBlockProps {
  node?: any;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

function HeadingWithLink({
  level,
  children,
  ...props
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  const text =
    typeof children === "string"
      ? children
      : React.Children.toArray(children).join("");

  const id = String(text)
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return (
    <HeadingTag
      id={id}
      className={`scroll-mt-20 ${
        level === 1
          ? "text-3xl font-bold mt-8 mb-4"
          : level === 2
            ? "text-2xl font-bold mt-8 mb-3 pb-2 border-b border-gray-800"
            : level === 3
              ? "text-xl font-semibold mt-6 mb-2"
              : "text-lg font-medium mt-4 mb-2"
      }`}
      {...props}
    >
      {children}
    </HeadingTag>
  );
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="docs-content prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ className, children, ...props }: CodeBlockProps) => {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (!match) {
              return (
                <code
                  className="box-border bg-neutral-800 rounded-md items-center px-1.5 inline-flex text-[0.875em] font-mono text-gray-300"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return <CodeBlock code={code} language={match[1]} />;
          },

          h1: ({ children, ...props }) => (
            <HeadingWithLink level={1} {...props}>
              {children}
            </HeadingWithLink>
          ),

          h2: ({ children, ...props }) => (
            <HeadingWithLink level={2} {...props}>
              {children}
            </HeadingWithLink>
          ),

          h3: ({ children, ...props }) => (
            <HeadingWithLink level={3} {...props}>
              {children}
            </HeadingWithLink>
          ),

          h4: ({ children, ...props }) => (
            <HeadingWithLink level={4} {...props}>
              {children}
            </HeadingWithLink>
          ),

          p: ({ children, ...props }) => (
            <p className="text-gray-300 leading-relaxed my-4" {...props}>
              {children}
            </p>
          ),

          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside space-y-1 my-4" {...props}>
              {children}
            </ul>
          ),

          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 my-4" {...props}>
              {children}
            </ol>
          ),

          li: ({ children, ...props }) => (
            <li className="text-gray-300" {...props}>
              {children}
            </li>
          ),

          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 py-2 my-4 text-gray-400 bg-white/5 rounded-r-lg"
              {...props}
            >
              {children}
            </blockquote>
          ),

          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          ),

          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table
                className="min-w-full border-collapse border border-gray-800"
                {...props}
              >
                {children}
              </table>
            </div>
          ),

          th: ({ children, ...props }) => (
            <th
              className="border border-gray-800 px-4 py-2 text-left text-white font-medium bg-white/5"
              {...props}
            >
              {children}
            </th>
          ),

          td: ({ children, ...props }) => (
            <td
              className="border border-gray-800 px-4 py-2 text-gray-300"
              {...props}
            >
              {children}
            </td>
          ),

          hr: (props) => <hr className="my-8 border-gray-800" {...props} />,

          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
