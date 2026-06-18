import { getAllDocs, getAvailableVersions, getLatestVersion } from "@/lib/docs";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Rocket,
  Zap,
  Settings,
  Box,
} from "lucide-react";
import { Project } from "@/project";

function groupDocsByCategory(docs: any[]) {
  const groups: { [key: string]: any[] } = {
    "Getting Started": [],
    Guides: [],
    "API Reference": [],
    Architecture: [],
    Other: [],
  };

  docs.forEach((doc) => {
    const slug = doc.slug;
    if (slug.includes("getting-started")) {
      groups["Getting Started"].push(doc);
    } else if (slug.includes("guide")) {
      groups["Guides"].push(doc);
    } else if (slug.includes("api")) {
      groups["API Reference"].push(doc);
    } else if (slug.includes("architecture")) {
      groups["Architecture"].push(doc);
    } else {
      groups["Other"].push(doc);
    }
  });

  return Object.fromEntries(
    Object.entries(groups).filter(([_, items]) => items.length > 0),
  );
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Getting Started":
      return <Rocket className="h-5 w-5" />;
    case "Guides":
      return <BookOpen className="h-5 w-5" />;
    case "API Reference":
      return <Zap className="h-5 w-5" />;
    case "Architecture":
      return <Settings className="h-5 w-5" />;
    default:
      return <Box className="h-5 w-5" />;
  }
}

interface Props {
  params: {
    version: string;
  };
}

export default async function DocsHomePage({ params }: Props) {
  const { version } = await params;
  const docs = getAllDocs(version);
  const groupedDocs = groupDocsByCategory(docs);
  const versions = getAvailableVersions();
  const latestVersion = getLatestVersion();

  const displayVersion = version === "latest" ? latestVersion : version;
  const isLatestVersion = version === "latest" || version === latestVersion;

  const projectName = "FastAPI Route";

  return (
    <div className="max-w-6xl mx-auto px-0 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
          <BookOpen className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">
            Documentation
            {!isLatestVersion && displayVersion && ` (v${displayVersion})`}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          {projectName}
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
          Build powerful APIs with file-based routing for FastAPI
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="inline-flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
          {versions.map((ver) => (
            <Link
              key={ver}
              href={`/docs/${ver}`}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                ver === version ||
                (version === "latest" && ver === latestVersion)
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              v{ver}
              {ver === latestVersion && (
                <span className="ml-1 text-xs text-emerald-400">(Latest)</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedDocs).map(([category, categoryDocs]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
              <div className="p-1.5 rounded-lg bg-white/5 text-gray-400">
                {getCategoryIcon(category)}
              </div>
              <h2 className="text-xl font-semibold text-white">{category}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryDocs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/docs/${version == null || version === undefined ? Project.version : version}/${doc.slug}`}
                  className="group block rounded-xl border border-gray-800 bg-black/40 backdrop-blur-sm p-5 transition-all duration-300 hover:border-gray-700 hover:bg-black/60 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-200 mb-2 group-hover:text-white transition-colors">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
