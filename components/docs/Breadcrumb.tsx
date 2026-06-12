"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter((p) => p && p !== "docs");
  const breadcrumbs = paths.map((path, index) => {
    const href = `/docs/${paths.slice(0, index + 1).join("/")}`;
    const label = path
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { href, label };
  });

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm">
      <Link
        href="/docs"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Docs
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <ChevronRight className="h-3 w-3 text-gray-600" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-white font-medium">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
