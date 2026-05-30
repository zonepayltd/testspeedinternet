"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdUnit({
  client,
  slot,
  format = "auto",
  responsive = true,
  style,
}: {
  client: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* adsbygoogle not ready / blocked */
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style || { display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
