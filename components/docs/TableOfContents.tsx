"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ArrowUp, Menu, X } from "lucide-react";

interface Heading {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 },
    );

    const elements = headings.map((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
      return element;
    });

    return () => {
      elements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 left-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full bg-black/90 backdrop-blur-md border border-gray-700 px-4 py-2.25 text-sm font-medium text-gray-300 shadow-lg transition-all duration-300 hover:border-gray-500 hover:bg-black hover:text-white max-sm:pl-12"
        >
          <Menu className="max-sm:hidden h-4 w-4" />
          <span>Contents</span>
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          />
        </button>

        <div
          className={`absolute bottom-14 left-0 w-80 overflow-hidden rounded-xl border border-gray-700 bg-black/95 backdrop-blur-md shadow-2xl transition-all duration-300 ${
            isOpen
              ? "max-h-[500px] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white/30"></div>
                <span className="text-sm font-semibold text-gray-300">
                  On this page
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600 px-2 py-0.5 rounded bg-gray-900/50">
                  {headings.length} sections
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ul className="max-h-[400px] overflow-y-auto styled-scrollbar space-y-1 pr-2">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-all duration-200 ${
                      activeId === heading.id
                        ? "bg-white/10 text-white"
                        : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                    } ${heading.level === 3 ? "pl-7" : heading.level === 4 ? "pl-9" : ""}`}
                  >
                    <span className="truncate block">{heading.text}</span>
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsOpen(false);
              }}
              className="mt-3 w-full rounded-md border border-gray-800 bg-black/40 px-3 py-2 text-xs text-gray-500 transition-all duration-200 hover:border-gray-700 hover:bg-black/60 hover:text-gray-300 flex items-center justify-center gap-2"
            >
              <ArrowUp className="h-3 w-3" />
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .styled-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .styled-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 10px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.6);
          border-radius: 10px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </>
  );
}
