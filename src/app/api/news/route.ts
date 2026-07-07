import { NextResponse } from "next/server";
import { fetchNews, getFallbackNews } from "@/lib/news-fetcher";

export const dynamic = "force-dynamic";
export const revalidate = 1800;

export async function GET() {
  try {
    const news = await fetchNews();
    if (news.length === 0) {
      return NextResponse.json(
        { news: getFallbackNews(), source: "fallback" },
        { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } }
      );
    }
    return NextResponse.json(
      { news, source: "live" },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } }
    );
  } catch {
    return NextResponse.json(
      { news: getFallbackNews(), source: "fallback" },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" } }
    );
  }
}