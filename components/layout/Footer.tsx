import Logo from "@/components/ui/Logo";
import { Project } from "@/project";
import Link from "next/link";
import { BookOpen, FileCode, Heart, Star } from "lucide-react";

const GitHub = () => (
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

const docLinks = [
  {
    href: `/docs/${Project.version}/getting-started/index`,
    label: "Getting Started",
    icon: BookOpen,
  },
  {
    href: `/docs/${Project.version}/core-concepts/index`,
    label: "Core Concepts",
    icon: FileCode,
  },
  {
    href: `/docs/${Project.version}/advanced/index`,
    label: "Advanced",
    icon: FileCode,
  },
  {
    href: `/docs/${Project.version}/cli/index`,
    label: "CLI",
    icon: FileCode,
  },
];

const resourceLinks = [
  {
    href: "https://github.com/inject3r/fastapi-route",
    label: "GitHub Repository",
    icon: GitHub,
  },
  {
    href: "https://github.com/inject3r/fastapi-route/issues",
    label: "Issues",
    icon: GitHub,
  },
  {
    href: "https://github.com/inject3r/fastapi-route/releases",
    label: "Releases",
    icon: GitHub,
  },
  { href: "/changelog", label: "Changelog", icon: FileCode },
];

const communityLinks = [
  {
    href: "https://github.com/inject3r/fastapi-route/discussions",
    label: "Discussions",
  },
  {
    href: "https://github.com/inject3r/fastapi-route/blob/main/CONTRIBUTING.md",
    label: "Contributing",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-white/[0.02] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-white font-medium">FastAPI Route</span>
              <span className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                v{Project.version}
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              File-based routing for FastAPI — build APIs with files and
              folders, not decorators.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://github.com/inject3r/fastapi-route"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors group"
              >
                <GitHub />
              </a>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-500">Target:</span>
                <span className="text-yellow-400 font-semibold">10k</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">
              Documentation
            </h4>
            <ul className="space-y-2">
              {docLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <link.icon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1.5 group"
                    >
                      <link.icon />
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1.5 group"
                    >
                      <link.icon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Community</h4>
            <ul className="space-y-2">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>MIT License</span>
            <span>•</span>
            <span>© {currentYear} Abolfazl Hosseini</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500/50" />
            <span>in Iran</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
