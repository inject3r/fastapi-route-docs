"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Check,
} from "lucide-react";
import { Project } from "@/project";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  items?: NavItem[];
}

interface SidebarProps {
  items: NavItem[];
}

function VersionSelector({
  selectedVersion,
  onVersionChange,
}: {
  selectedVersion: string;
  onVersionChange: (version: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const versions = Project.versions.map((version) => ({
    id: version,
    name: `v${version}`,
    icon: Sparkles,
    description:
      version === Project.version
        ? "Latest stable release"
        : "Previous release",
  }));

  const currentVersion =
    versions.find((v) => v.id === selectedVersion) || versions[0];
  const CurrentIcon = currentVersion.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group w-full rounded-lg border border-gray-800 bg-black p-3 text-left transition-all duration-200 hover:border-gray-700 hover:bg-black/80"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-900/50 text-gray-400 group-hover:border-gray-600 group-hover:text-white">
              <CurrentIcon className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">
                {currentVersion.name}
              </p>
              <p className="text-xs text-gray-500">
                {currentVersion.description}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-all duration-300 ${
              isOpen ? "rotate-180 text-white" : "group-hover:text-gray-400"
            }`}
          />
        </div>
      </button>

      <div
        className={`absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-gray-800 bg-black shadow-xl transition-all duration-300 ${
          isOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-1">
          {versions.map((version) => {
            const Icon = version.icon;
            const isSelected = selectedVersion === version.id;
            return (
              <button
                key={version.id}
                onClick={() => {
                  onVersionChange(version.id);
                  setIsOpen(false);
                }}
                className={`group relative flex w-full items-center gap-3 rounded-md p-2 transition-all duration-200 ${
                  isSelected ? "bg-gray-800" : "hover:bg-gray-900"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 ${
                    isSelected
                      ? "bg-gray-700 text-white"
                      : "bg-gray-900 text-gray-500 group-hover:bg-gray-800 group-hover:text-gray-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className={`text-sm font-medium ${
                      isSelected ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {version.name}
                  </p>
                  <p className="text-xs text-gray-600">{version.description}</p>
                </div>
                {isSelected && <Check className="h-4 w-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  const getCurrentVersionFromPath = () => {
    const match = pathname?.match(/\/(\d+\.\d+\.\d+)\//);
    return match ? match[1] : Project.version;
  };

  const [selectedVersion, setSelectedVersion] = useState(
    getCurrentVersionFromPath(),
  );

  useEffect(() => {
    const versionFromPath = getCurrentVersionFromPath();
    setSelectedVersion(versionFromPath);
  }, [pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sidebarRef.current) {
      observer.observe(sidebarRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      setShowTopShadow(scrollTop > 5);
      setShowBottomShadow(scrollTop + clientHeight < scrollHeight - 10);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};

    const findActivePath = (navItems: NavItem[], parentPath: string[] = []) => {
      for (const item of navItems) {
        if (item.items) {
          const hasActiveChild = item.items.some(
            (child) =>
              pathname === getVersionedHref(child.href) ||
              pathname?.startsWith(getVersionedHref(child.href) + "/"),
          );

          if (hasActiveChild) {
            initialOpenState[item.title] = true;
            findActivePath(item.items, [...parentPath, item.title]);
          } else {
            initialOpenState[item.title] = false;
          }
        }
      }
    };

    findActivePath(items);
    setOpenItems(initialOpenState);
  }, [pathname, items]);

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (href: string) => {
    if (href === "/docs") return pathname === "/docs";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const handleVersionChange = (newVersion: string) => {
    if (newVersion === selectedVersion) return;

    const newPathname = pathname?.replace(
      /\/(\d+\.\d+\.\d+)\//,
      `/${newVersion}/`,
    );
    if (newPathname) {
      router.push(newPathname);
    }
  };

  const getVersionedHref = (href: string) => {
    if (href.startsWith("/docs")) {
      const withoutDocs = href.replace("/docs", "");
      return `/docs/${selectedVersion}${withoutDocs}`;
    }
    if (href.startsWith("/")) {
      return `/docs/${selectedVersion}${href}`;
    }
    return href;
  };

  const renderNavItems = (navItems: NavItem[], depth = 0) => {
    return navItems.map((item) => {
      const versionedHref = getVersionedHref(item.href);
      const active = isActive(versionedHref);
      const hasChildren = item.items && item.items.length > 0;
      const isOpen = openItems[item.title] ?? false;

      return (
        <li
          key={item.title}
          className="my-1.5"
          style={{ marginLeft: depth > 0 ? "3px" : "0" }}
        >
          {hasChildren ? (
            <>
              <button
                onClick={() => toggleItem(item.title)}
                className={`group relative flex w-full cursor-pointer items-center justify-between rounded-md py-1.5 pl-2 pr-2 text-left text-sm transition-all duration-200 hover:bg-white/5 ${
                  active
                    ? "text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {item.icon && (
                    <span className="shrink-0 text-gray-500 group-hover:text-gray-400 transition-colors">
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate text-pretty">{item.title}</span>
                </div>
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 text-gray-500 transition-all duration-300 ${
                    isOpen ? "rotate-90 text-white" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="relative overflow-hidden border-l border-gray-800 ml-4 pl-3 mt-1">
                  {renderNavItems(item.items!, depth + 1)}
                </ul>
              </div>
            </>
          ) : (
            <Link
              href={versionedHref}
              onClick={() => setMobileMenuOpen(false)}
              className={`group relative flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 pl-2 pr-2 text-left text-sm transition-all duration-200 hover:bg-white/5 ${
                active
                  ? "text-white font-medium bg-white/5"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item.icon && (
                <span className="shrink-0 text-gray-500 group-hover:text-gray-400 transition-colors">
                  {item.icon}
                </span>
              )}
              <span className="truncate text-pretty">{item.title}</span>
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
              )}
            </Link>
          )}
        </li>
      );
    });
  };

  const SidebarContent = () => (
    <>
      <div className="space-y-3 pb-5">
        <VersionSelector
          selectedVersion={selectedVersion}
          onVersionChange={handleVersionChange}
        />
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className={`absolute left-0 right-0 top-0 z-10 h-8 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${
            showTopShadow ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={scrollContainerRef}
          className="styled-scrollbar h-full overflow-y-auto pb-6 pr-2"
          style={{ height: "calc(100% - 20px)" }}
        >
          <nav className="relative">
            <ul className="space-y-0.5">{renderNavItems(items)}</ul>
          </nav>
        </div>

        <div
          aria-hidden="true"
          className={`absolute bottom-0 left-0 right-0 z-10 h-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${
            showBottomShadow ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </>
  );

  return (
    <>
      <div className="fixed bottom-6 left-4 max-sm:bottom-6.5 max-sm:left-5.5 z-50 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-10 w-10 max-sm:h-9 max-sm:w-9 items-center justify-center rounded-full border border-gray-700 max-sm:border-none bg-black/80 backdrop-blur-sm text-white shadow-lg transition-all duration-300 hover:border-gray-500 hover:bg-black hover:scale-105 active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={sidebarRef}
        className={`sticky top-[121px] hidden h-[calc(100vh-121px)] w-[284px] flex-col md:flex transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <SidebarContent />
      </div>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${
          mobileMenuOpen
            ? "pointer-events-auto visible"
            : "pointer-events-none invisible"
        }`}
      >
        <div
          className={`absolute inset-0 backdrop-blur-sm transition-all duration-500 ${
            mobileMenuOpen ? "bg-black/60" : "bg-black/0 backdrop-blur-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`absolute left-0 top-0 h-full w-[280px] bg-black shadow-2xl transition-all duration-500 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <div>
                <span className="font-semibold text-white">Documentation</span>
                <p className="text-xs text-gray-500">v{selectedVersion}</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-black text-gray-400 transition-all duration-200 hover:border-gray-600 hover:bg-gray-900 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="h-[calc(100%-69px)] overflow-y-auto px-3 py-4 styled-scrollbar">
            <SidebarContent />
          </div>
        </div>
      </div>

      <style jsx>{`
        .styled-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .styled-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 10px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb {
          background: #3a3a3a;
          border-radius: 10px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a4a4a;
        }
      `}</style>
    </>
  );
}
