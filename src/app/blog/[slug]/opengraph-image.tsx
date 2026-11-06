import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
import { OgCard } from "@/lib/ogTemplate";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TestSpeedInternet article";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return new ImageResponse(
    <OgCard
      eyebrow={post?.category || "Blog"}
      title={post?.title || "Internet speed tips & guides"}
      footer={`testspeedinternet.com/blog${post ? ` · ${post.readingMinutes} min read` : ""}`}
    />,
    { ...size },
  );
}
