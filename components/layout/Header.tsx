"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import MobileMenu from "./MobileMenu";
import { Project } from "@/project";

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400 group-hover:text-white transition"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const navItems = [
  { href: "/docs", label: "Docs" },
  {
    href: "https://github.com/inject3r/fastapi-route/issues",
    label: "Issues",
    external: true,
  },
  {
    href: "https://github.com/inject3r/fastapi-route/releases",
    label: "Releases",
    external: true,
  },
  { href: "/changelog", label: "Changelog" },
];

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xl tracking-tight">
                  FastAPI Route
                </span>
                <div className="h-5 px-1.25 leading-[0.8] rounded-full bg-white/10 border border-white/20">
                  <span className="text-[9px] font-mono text-gray-300">
                    v{Project.version}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono text-gray-500">
                  File-Based Routing · Zero Config
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-gradient-to-r from-white to-white/50 transition-all duration-300 group-hover:w-6 group-hover:left-1/2 group-hover:-translate-x-1/2" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/inject3r/fastapi-route"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <GitHubIcon />
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-gray-300 group-hover:text-white">
                  Target
                </span>
                <span className="text-xs font-mono text-yellow-400">★</span>
                <span className="text-xs font-mono text-gray-400 font-semibold">
                  10k
                </span>
              </div>
            </a>

            <Link
              href={`/docs/${Project.version}/getting-started/index`}
              className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-all hover:scale-105"
            >
              <span>Get Started</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
