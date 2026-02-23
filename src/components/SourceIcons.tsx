import { FaXTwitter, FaInstagram, FaFacebook, FaRedditAlien, FaAmazon, FaYelp, FaAppStoreIos } from "react-icons/fa6";
import type { ComponentType } from "react";

export interface SourceInfo {
  name: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export const sourceMap: Record<string, SourceInfo> = {
  Twitter: {
    name: "Twitter / X",
    icon: FaXTwitter,
    color: "text-foreground",
    bgColor: "bg-foreground/10",
  },
  Instagram: {
    name: "Instagram",
    icon: FaInstagram,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
  Facebook: {
    name: "Facebook",
    icon: FaFacebook,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  Reddit: {
    name: "Reddit",
    icon: FaRedditAlien,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
  Amazon: {
    name: "Amazon",
    icon: FaAmazon,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  Yelp: {
    name: "Yelp",
    icon: FaYelp,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  "App Store": {
    name: "App Store",
    icon: FaAppStoreIos,
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
  },
};

export const SourceIcon = ({ source, size = "sm" }: { source: string; size?: "sm" | "md" | "lg" }) => {
  const info = sourceMap[source];
  if (!info) return null;
  const Icon = info.icon;
  const sizeClasses = size === "lg" ? "w-6 h-6" : size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  
  return <Icon className={`${sizeClasses} ${info.color}`} />;
};

export const SourceBadge = ({ source }: { source: string }) => {
  const info = sourceMap[source];
  if (!info) return <span className="text-xs text-muted-foreground">{source}</span>;
  const Icon = info.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono ${info.bgColor} ${info.color}`}>
      <Icon className="w-3 h-3" />
      {source}
    </span>
  );
};
