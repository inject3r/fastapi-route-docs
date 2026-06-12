import { notFound } from "next/navigation";
import { getAllDocs, getDocBySlug, getAdjacentDocs } from "@/lib/docs";
import Breadcrumb from "@/components/docs/Breadcrumb";
import TableOfContents from "@/components/docs/TableOfContents";
import MarkdownContent from "@/components/docs/MarkdownContent";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "@/project";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  try {
    const docs = getAllDocs();

    if (!docs || docs.length === 0) {
      return [
        { slug: [Project.version] },
        { slug: [Project.version, "getting-started"] },
      ];
    }

    const params = [];

    for (const version of Project.versions) {
      params.push({ slug: [version] });

      for (const doc of docs) {
        params.push({
          slug: [version, ...doc.slug.split("/")],
        });
      }
    }

    return params;
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [
      { slug: [Project.version] },
      { slug: [Project.version, "getting-started"] },
    ];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return {
      title: "Documentation Not Found",
    };
  }

  const version = slug[0];
  const docSlug = slug.slice(1).join("/") || "index";

  const doc = getDocBySlug(docSlug);

  if (!doc) {
    return {
      title: "Documentation Not Found",
    };
  }

  return {
    title: `${doc.title} | FastAPI Route Docs (${version})`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    notFound();
  }

  const version = slug[0];
  const docSlug = slug.slice(1).join("/") || "index";

  if (!Project.versions.includes(version)) {
    notFound();
  }

  const doc = getDocBySlug(docSlug);

  if (!doc) {
    notFound();
  }

  const { prev, next } = getAdjacentDocs(docSlug);

  return (
    <>
      <div className="mb-6">
        <Breadcrumb />
      </div>

      <div className="max-w-none">
        <MarkdownContent content={doc.content} />
      </div>

      <nav
        aria-label="pagination"
        className="relative flex justify-between flex-wrap items-start w-full my-12 border-t border-gray-800 pt-8"
      >
        {prev ? (
          <Link
            href={`/docs/${version}/${prev.slug}`}
            className="group p-1 rounded-md pr-2 pl-7 hover:bg-white/5 transition-all duration-200"
            aria-label={`Go to previous page: ${prev.title}`}
          >
            <span className="text-sm text-gray-500 mb-0.5 transition-colors duration-200 group-hover:text-gray-300 block">
              Previous
            </span>
            <div className="relative flex items-center gap-2">
              <ChevronLeft className="absolute -left-6 h-5 w-5 text-gray-600 transition-colors duration-200 group-hover:text-white" />
              <span className="text-base font-medium text-gray-300 group-hover:text-white transition-colors duration-200 max-w-[20em] truncate">
                {prev.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="invisible" />
        )}

        {next ? (
          <Link
            href={`/docs/${version}/${next.slug}`}
            className="group p-1 rounded-md pl-2 pr-7 ml-auto hover:bg-white/5 transition-all duration-200"
            aria-label={`Go to next page: ${next.title}`}
          >
            <span className="text-sm text-gray-500 mb-0.5 transition-colors duration-200 group-hover:text-gray-300 block text-right">
              Next
            </span>
            <div className="relative flex items-center gap-2">
              <span className="text-base font-medium text-gray-300 group-hover:text-white transition-colors duration-200 max-w-[20em] truncate">
                {next.title}
              </span>
              <ChevronRight className="absolute -right-6 h-5 w-5 text-gray-600 transition-colors duration-200 group-hover:text-white" />
            </div>
          </Link>
        ) : (
          <div className="invisible" />
        )}
      </nav>

      <TableOfContents headings={doc.headings} />
    </>
  );
}
