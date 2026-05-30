// Social platforms the admin can add in Settings. Icons are resolved in the
// SocialLinks component (lucide), with a generic fallback for any others.
export const SOCIAL_PLATFORMS: { value: string; label: string }[] = [
  { value: "twitter", label: "Twitter / X" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "github", label: "GitHub" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "website", label: "Website / Other" },
];

export const platformLabel = (v: string) =>
  SOCIAL_PLATFORMS.find((p) => p.value === v)?.label || v;
