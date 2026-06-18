import { getDocNav, getAvailableVersions } from "@/lib/docs";
import Sidebar from "@/components/docs/Sidebar";
import { ReactNode } from "react";
import { Rocket, BookOpen, Zap, Settings, Box } from "lucide-react";

const iconMap: Record<string, ReactNode> = {
  Rocket: <Rocket className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
  Box: <Box className="h-4 w-4" />,
};

function getIconComponent(iconName?: string): ReactNode {
  if (!iconName) return <Box className="h-4 w-4" />;
  return iconMap[iconName] || <Box className="h-4 w-4" />;
}

interface Props {
  children: ReactNode;
  params: {
    version: string;
  };
}

export default async function DocsLayout({ children, params }: Props) {
  const { version } = await params;
  const nav = getDocNav(version);

  const sidebarItems = nav.items.map((item) => ({
    title: item.title,
    href: item.href,
    icon: getIconComponent(item.icon),
    items: item.items?.map((sub) => ({
      title: sub.title,
      href: sub.href,
      icon: getIconComponent(sub.icon),
    })),
  }));

  return (
    <div className="px-6">
      <div className="relative max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-18 md:flex md:flex-row">
        <Sidebar items={sidebarItems} />
        <div className="flex-1 min-w-0">
          <div className="mt-4 w-full min-w-0 md:px-12 md:pr-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
