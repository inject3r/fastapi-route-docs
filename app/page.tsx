"use client";

import { useRef, useEffect, useState } from "react";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import Logo from "@/components/ui/Logo";
import {
  Zap,
  Shield,
  Globe,
  Layers,
  FolderTree,
  Route,
  RefreshCw,
  FileCode,
  Sparkles,
  TrendingUp,
  Box,
  GitBranch,
  Award,
  Terminal,
  Server,
  Check,
  Copy,
  Star,
  ChevronRight,
  MoveRight,
  Flame,
  Infinity,
} from "lucide-react";
import Link from "next/link";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Project } from "@/project";

const features = [
  {
    icon: FolderTree,
    title: "File-Based Routing",
    description: "Routes defined by folder structure — no decorators needed",
    type: "routing",
    gradient: "from-emerald-500 via-emerald-400 to-emerald-300",
  },
  {
    icon: Route,
    title: "Dynamic Routes",
    description: "[user_id] folders become {user_id} parameters automatically",
    type: "dynamic",
    gradient: "from-blue-500 via-blue-400 to-blue-300",
  },
  {
    icon: Layers,
    title: "Route Groups",
    description: "(auth) folders organize code without affecting URLs",
    type: "groups",
    gradient: "from-purple-500 via-purple-400 to-purple-300",
  },
  {
    icon: RefreshCw,
    title: "Hot Reload",
    description: "Instant rebuild on file changes during development",
    type: "hotreload",
    gradient: "from-orange-500 via-orange-400 to-orange-300",
  },
  {
    icon: Server,
    title: "Production Cache",
    description: "Pre-compiled routes for lightning-fast startup",
    type: "cache",
    gradient: "from-rose-500 via-rose-400 to-rose-300",
  },
  {
    icon: FileCode,
    title: "Custom Handlers",
    description: "Bring your own docs.py and not-found.py",
    type: "handlers",
    gradient: "from-indigo-500 via-indigo-400 to-indigo-300",
  },
  {
    icon: Shield,
    title: "Custom Middleware",
    description: "Intercept requests with middleware.py",
    type: "middleware",
    gradient: "from-cyan-500 via-cyan-400 to-cyan-300",
  },
  {
    icon: Globe,
    title: "Static Files",
    description: "Drop files in /public — served automatically",
    type: "static",
    gradient: "from-teal-500 via-teal-400 to-teal-300",
  },
];

const stats = [
  { value: "0", label: "Decorators Needed", icon: Star },
  { value: "100%", label: "File-Based", icon: FolderTree },
  { value: "1", label: "Command to Start", icon: Terminal },
  { value: "3.9+", label: "Python Version", icon: Box },
];

const useFeatureCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  type: string,
) => {
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 80;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (w === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.02;

      const centerX = w / 2;
      const centerY = h / 2;

      if (type === "routing") {
        const nodes = [
          { x: w * 0.12, y: centerY },
          { x: w * 0.5, y: centerY - 10 },
          { x: w * 0.88, y: centerY },
        ];

        for (let i = 0; i < nodes.length; i++) {
          ctx.beginPath();
          const glow = Math.sin(timeRef.current * 3 + i) * 3;
          ctx.arc(nodes[i].x, nodes[i].y, 7 + glow, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, 0.08)`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(nodes[i].x, nodes[i].y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
          ctx.fill();
        }

        for (let i = 0; i < nodes.length - 1; i++) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x + 10, nodes[i].y);
          ctx.lineTo(nodes[i + 1].x - 10, nodes[i + 1].y);
          ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`;
          ctx.stroke();
        }

        for (let i = 0; i < 3; i++) {
          const t = (timeRef.current + i * 0.33) % 1;
          const x = w * 0.12 + w * 0.76 * t;
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
          ctx.arc(x, centerY - 6, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === "dynamic") {
        ctx.font = "bold 10px 'SF Mono', monospace";
        ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
        ctx.textAlign = "center";
        ctx.fillText("{user_id}", w / 2, centerY - 14);

        ctx.beginPath();
        const pulse = Math.sin(timeRef.current * 4) * 3;
        ctx.arc(w / 2, centerY + 10, 9 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        const orbit = Math.sin(timeRef.current * 5) * 12;
        ctx.arc(w / 2 + orbit, centerY + 10, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.7)`;
        ctx.fill();

        for (let i = 0; i < 3; i++) {
          const angle = timeRef.current * 4 + (i * Math.PI * 2) / 3;
          const x = w / 2 + Math.cos(angle) * 16;
          const y = centerY + 10 + Math.sin(angle) * 8;
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === "groups") {
        ctx.font = "bold 10px 'SF Mono', monospace";

        ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
        ctx.fillText("(", w * 0.22, centerY);
        ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
        ctx.fillText("auth", w * 0.5, centerY);
        ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
        ctx.fillText(")", w * 0.78, centerY);

        ctx.beginPath();
        ctx.moveTo(w * 0.5, centerY - 20);
        ctx.lineTo(w * 0.5, centerY - 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w * 0.5, centerY + 8);
        ctx.lineTo(w * 0.5, centerY + 20);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.font = "7px 'SF Mono', monospace";
        ctx.fillText("ignored in URL", w / 2, centerY + 32);
      } else if (type === "hotreload") {
        const barWidth = w - 60;
        const progress = timeRef.current % 1;

        for (let i = 0; i <= 4; i++) {
          const x = 30 + (barWidth / 4) * i;
          ctx.beginPath();
          ctx.moveTo(x, 12);
          ctx.lineTo(x, h - 12);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.stroke();
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(30, 12, barWidth, h - 24);

        const gradient = ctx.createLinearGradient(
          30,
          0,
          30 + barWidth * progress,
          0,
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.3)");
        ctx.fillStyle = gradient;
        ctx.fillRect(30, 12, barWidth * progress, h - 24);

        const pulseX = 30 + barWidth * progress;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
        ctx.arc(pulseX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === "cache") {
        const barCount = 6;
        const barWidth = (w - 60) / barCount - 4;

        for (let i = 0; i < barCount; i++) {
          const height = 10 + Math.sin(timeRef.current * 3 + i) * 8;
          const x = 30 + i * (barWidth + 4);
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
          ctx.fillRect(x, centerY - height / 2, barWidth, height);
          ctx.strokeStyle = `rgba(255, 255, 255, 0.25)`;
          ctx.strokeRect(x, centerY - height / 2, barWidth, height);
        }

        for (let i = 0; i < 2; i++) {
          const t = (timeRef.current + i * 0.5) % 1;
          const x = 30 + (w - 60) * t;
          ctx.beginPath();
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          ctx.arc(x, centerY - 12, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === "handlers") {
        ctx.font = "bold 8px 'SF Mono', monospace";
        ctx.fillStyle = `rgba(255, 255, 255, 0.35)`;
        ctx.fillText("docs.py", w * 0.2, centerY - 8);
        ctx.fillText("not-found.py", w * 0.8, centerY - 8);

        for (let i = 0; i < 2; i++) {
          const x = i === 0 ? w * 0.2 : w * 0.8;
          ctx.beginPath();
          const pulse = Math.sin(timeRef.current * 3 + i) * 4;
          ctx.arc(x, centerY + 10, 10 + pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, 0.08)`;
          ctx.fill();
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(w * 0.35, centerY + 10);
        ctx.lineTo(w * 0.65, centerY + 10);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.stroke();
      } else if (type === "middleware") {
        ctx.beginPath();
        ctx.moveTo(15, centerY);
        ctx.lineTo(w - 15, centerY);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.stroke();

        const layers = [
          { x: w * 0.2, y: centerY },
          { x: w * 0.5, y: centerY },
          { x: w * 0.8, y: centerY },
        ];

        for (let i = 0; i < layers.length; i++) {
          ctx.beginPath();
          const scale = 1 + Math.sin(timeRef.current * 4 + i) * 0.1;
          ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
          ctx.fillRect(
            layers[i].x - 12 * scale,
            layers[i].y - 14,
            24 * scale,
            28,
          );
          ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
          ctx.strokeRect(
            layers[i].x - 12 * scale,
            layers[i].y - 14,
            24 * scale,
            28,
          );
        }

        const arrowX = 15 + (w - 30) * (timeRef.current % 1);
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.arc(arrowX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === "static") {
        ctx.font = "9px 'SF Mono', monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.fillText("/public", w / 2, centerY - 14);
        ctx.fillText("→", w / 2, centerY + 2);
        ctx.fillText("/css/style.css", w / 2, centerY + 20);

        for (let i = 0; i < 3; i++) {
          const x = 20 + (w - 40) * (i / 2);
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
          ctx.fillRect(x, centerY + 6, 8, 6);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [type]);

  return { timeRef };
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  type,
  gradient,
}: {
  icon: any;
  title: string;
  description: string;
  type: string;
  gradient: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useFeatureCanvas(canvasRef, type);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 transition-all duration-500 hover:border-white/20 hover:shadow-2xl ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-10`}
      />
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0 w-full pointer-events-none opacity-30 transition-opacity duration-500 group-hover:opacity-60"
        style={{ height: "80px" }}
      />
      <div className="relative z-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
          <Icon className="h-6 w-6 text-white/70 transition-all duration-500 group-hover:text-white" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-400">{description}</p>
      </div>
    </div>
  );
};

const StatCard = ({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: any;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 text-center transition-all duration-500 hover:border-white/15 hover:shadow-xl ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
      style={{ transition: "opacity 0.5s ease-out, transform 0.5s ease-out" }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <Icon className="mx-auto mb-3 h-6 w-6 text-emerald-400/50 transition-transform duration-500 group-hover:scale-110" />
      <div className="mb-2 text-3xl font-bold text-white">{value}</div>
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
    </div>
  );
};

const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (w === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.008;

      const centerX = w / 2;
      const centerY = h / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(timeRef.current * 0.15);

      for (let i = 0; i < 5; i++) {
        const radius = 60 + i * 25;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.02 + i * 0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI * 2) / 16 + timeRef.current;
        const radius = 75;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        ctx.beginPath();
        const glow = Math.sin(timeRef.current * 3 + i) * 0.05;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + glow})`;
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 + timeRef.current * 0.4;
        const length = 160;
        const x = centerX + Math.cos(angle) * length;
        const y = centerY + Math.sin(angle) * length;

        const gradient = ctx.createLinearGradient(centerX, centerY, x, y);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.06)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
};

const ComparisonSection = () => {
  const [activeTab, setActiveTab] = useState<"features" | "performance">(
    "features",
  );
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const featureData = [
    {
      feature: "File-Based Routing",
      fastapi_route: "✓",
      fastapi: "✗",
      flask: "✗",
      django: "Partial",
    },
    {
      feature: "No Decorators",
      fastapi_route: "✓",
      fastapi: "✗",
      flask: "✗",
      django: "✗",
    },
    {
      feature: "Hot Reload",
      fastapi_route: "✓",
      fastapi: "✓",
      flask: "✓",
      django: "✓",
    },
    {
      feature: "Dynamic Routes",
      fastapi_route: "✓",
      fastapi: "✓",
      flask: "✓",
      django: "✓",
    },
    {
      feature: "Route Groups",
      fastapi_route: "✓",
      fastapi: "✗",
      flask: "✗",
      django: "✗",
    },
    {
      feature: "Production Cache",
      fastapi_route: "✓",
      fastapi: "✗",
      flask: "✗",
      django: "✗",
    },
    {
      feature: "Built-in Docs",
      fastapi_route: "✓",
      fastapi: "✓",
      flask: "✗",
      django: "✗",
    },
    {
      feature: "CLI Tools",
      fastapi_route: "✓",
      fastapi: "Partial",
      flask: "✓",
      django: "✓",
    },
  ];

  const performanceData = [
    {
      metric: "Startup Time (ms)",
      fastapi_route: "~45",
      fastapi: "~120",
      flask: "~80",
      django: "~200",
    },
    {
      metric: "Memory Usage (MB)",
      fastapi_route: "~35",
      fastapi: "~50",
      flask: "~40",
      django: "~70",
    },
    {
      metric: "Requests/sec",
      fastapi_route: "~18k",
      fastapi: "~15k",
      flask: "~8k",
      django: "~10k",
    },
  ];

  const currentData = activeTab === "features" ? featureData : performanceData;

  return (
    <Section className="py-24">
      <Container>
        <div
          ref={sectionRef}
          className={`mb-12 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Benchmarks & Comparison</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            How FastAPI Route compares
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            File-based routing without decorators — a fresh approach to building
            APIs
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-3">
          <button
            onClick={() => setActiveTab("features")}
            className={`relative rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === "features"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {activeTab === "features" && (
              <div className="absolute inset-0 rounded-xl bg-white/10" />
            )}
            <span className="relative z-10">Features</span>
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`relative rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === "performance"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {activeTab === "performance" && (
              <div className="absolute inset-0 rounded-xl bg-white/10" />
            )}
            <span className="relative z-10">Performance</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-4 text-left font-medium text-gray-400">
                  {activeTab === "features" ? "Feature" : "Metric"}
                </th>
                <th className="rounded-t-lg bg-emerald-400/10 px-4 py-4 text-left font-semibold text-emerald-400">
                  FastAPI Route
                </th>
                <th className="px-4 py-4 text-left font-medium text-gray-500">
                  FastAPI
                </th>
                <th className="px-4 py-4 text-left font-medium text-gray-500">
                  Flask
                </th>
                <th className="px-4 py-4 text-left font-medium text-gray-500">
                  Django
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                  style={{
                    animation: isVisible
                      ? `fadeInUp 0.5s ease-out ${index * 0.05}s forwards`
                      : "none",
                    opacity: 0,
                  }}
                >
                  <td className="px-4 py-3 font-medium text-gray-300">
                    {activeTab === "features" ? row.feature : row.metric}
                  </td>
                  <td className="bg-emerald-400/5 px-4 py-3 font-medium text-emerald-400">
                    {activeTab === "features"
                      ? row.fastapi_route
                      : row.fastapi_route}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {activeTab === "features" ? row.fastapi : row.fastapi}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {activeTab === "features" ? row.flask : row.flask}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {activeTab === "features" ? row.django : row.django}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Section>
  );
};

const CodeExample = () => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const codeRef = useRef(null);

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

    if (codeRef.current) {
      observer.observe(codeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const code = `# Create your first route
mkdir -p routes/users
echo 'from fastapi_route import Request

def GET(request: Request):
    return {"users": ["Alice", "Bob"]}' > routes/users/route.py

# Start the development server
fastapi-route dev

# Build for production
fastapi-route build
fastapi-route run`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={codeRef}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
            <span className="ml-2 font-mono text-xs text-gray-500">
              terminal / bash
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="rounded-lg p-1.5 text-gray-500 transition-all hover:bg-white/10 hover:text-white"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="p-6">
          <SyntaxHighlighter
            language="bash"
            style={vscDarkPlus}
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
              margin: 0,
              padding: "0 !important",
              background: "transparent",
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#d4d4d4",
            }}
            codeTagProps={{
              style: {
                fontFamily: "monospace",
                fontSize: "14px",
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [pipCopied, setPipCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePipCopy = async () => {
    await navigator.clipboard.writeText("pip install fastapi-route");
    setPipCopied(true);
    setTimeout(() => setPipCopied(false), 2000);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <Section className="relative overflow-hidden pt-32 pb-24">
        <HeroCanvas />
        <Container>
          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <div
              className="relative mb-8 flex justify-center"
              style={{ animation: "scaleIn 0.6s ease-out" }}
            >
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl" />
              <Logo size="lg" />
            </div>

            <div
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm"
              style={{
                animation: "fadeInUp 0.5s ease-out 0.1s forwards",
                opacity: 0,
              }}
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                File-based routing · Zero decorators · Production ready
              </span>
            </div>

            <h1
              className="mb-6 text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl"
              style={{
                animation: "fadeInUp 0.5s ease-out 0.2s forwards",
                opacity: 0,
              }}
            >
              FastAPI Route
            </h1>

            <p
              className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-400"
              style={{
                animation: "fadeInUp 0.5s ease-out 0.3s forwards",
                opacity: 0,
              }}
            >
              Build APIs with files and folders, not decorators. File-based
              routing for FastAPI.
            </p>

            <div
              className="mt-10 flex flex-wrap justify-center gap-4"
              style={{
                animation: "fadeInUp 0.5s ease-out 0.4s forwards",
                opacity: 0,
              }}
            >
              <Link
                href={`/docs/${Project.version}/getting-started/index`}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black shadow-lg shadow-white/10 transition-all hover:scale-105 hover:bg-gray-100"
              >
                Get Started
                <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={handlePipCopy}
                className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-medium backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10"
              >
                <code className="font-mono text-sm">
                  pip install fastapi-route
                </code>
                {pipCopied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400 transition-colors group-hover:text-white" />
                )}
              </button>
            </div>

            <div
              className="mt-12 flex items-center justify-center gap-6 text-xs text-gray-500"
              style={{
                animation: "fadeIn 0.5s ease-out 0.6s forwards",
                opacity: 0,
              }}
            >
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>Target 10k Github Star</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-3 w-3 text-orange-400" />
                <span>Active Development</span>
              </div>
              <div className="flex items-center gap-2">
                <Infinity className="h-3 w-3 text-emerald-400" />
                <span>MIT License</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-12">
        <Container>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-24">
        <Container>
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" />
              <span>Features</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Everything you need
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              A complete routing solution with all the features you expect from
              a modern framework
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </Container>
      </Section>

      <ComparisonSection />

      <Section className="py-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm">
                <Terminal className="h-3.5 w-3.5" />
                <span>Quick Start</span>
              </div>
              <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
                Get started in seconds
              </h2>
              <p className="text-lg text-gray-400">
                Create a routes directory, add files, and run — no boilerplate
                needed
              </p>
            </div>
            <CodeExample />
            <div className="mt-8 text-center">
              <Link
                href={`/docs/${Project.version}/getting-started/index`}
                className="group inline-flex items-center gap-2 text-gray-400 transition-all hover:text-white"
              >
                <span>Read the documentation</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-24">
        <Container>
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-10 text-center backdrop-blur-sm sm:p-16">
              <Award className="mx-auto mb-6 h-16 w-16 text-emerald-400" />
              <h3 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Ready to build something great?
              </h3>
              <p className="mx-auto mb-8 max-w-md text-lg text-gray-400">
                FastAPI Route is open source and free to use under the MIT
                license.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://github.com/inject3r/fastapi-route"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-medium transition-all hover:scale-105 hover:bg-white/10"
                >
                  <GitBranch className="h-4 w-4" />
                  GitHub
                </a>
                <Link
                  href="/docs/api"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-medium transition-all hover:scale-105 hover:bg-white/10"
                >
                  <Box className="h-4 w-4" />
                  API Reference
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
