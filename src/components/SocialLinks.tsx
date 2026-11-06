"use client";

import { useEffect, useState } from "react";
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Send,
  MessageCircle,
  Music2,
  Globe,
} from "lucide-react";
import { platformLabel } from "@/lib/socials";

type Social = { platform: string; url: string };

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  github: Github,
  telegram: Send,
  whatsapp: MessageCircle,
  tiktok: Music2,
  website: Globe,
};

export default function SocialLinks() {
  const [socials, setSocials] = useState<Social[]>([]);

  useEffect(() => {
    fetch("/api/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setSocials(Array.isArray(d?.socials) ? d.socials.filter((s: Social) => s?.url) : []))
      .catch(() => {});
  }, []);

  if (socials.length === 0) return null;

  return (
    <div className="mt-5 flex items-center gap-2">
      {socials.map((s, i) => {
        const Icon = ICONS[s.platform] || Globe;
        return (
          <a
            key={`${s.platform}-${i}`}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platformLabel(s.platform)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-brand-400/40 dark:hover:text-brand-300"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
