import { NextRequest, NextResponse } from "next/server";
import { analyzeIssue, analyzeSector } from "@/lib/ai-analyzer";
import { analyzeCorruptionStepByStep } from "@/lib/corruption-analyzer";
import { getFallbackCorruption } from "@/lib/corruption-fetcher";
import { getFallbackNews } from "@/lib/news-fetcher";
import type { Locale } from "@/i18n";
import { CorruptionItem, SectorId } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issueId, sectorId, newsItem, useAI, mode, locale: reqLocale } = body;
    const locale: Locale = reqLocale === "hi" ? "hi" : "en";

    if (mode === "step-by-step" && newsItem) {
      const analysis = await analyzeCorruptionStepByStep(
        newsItem as CorruptionItem,
        locale
      );
      return NextResponse.json({ analysis });
    }

    if (sectorId) {
      const analysis = await analyzeSector(sectorId as SectorId);
      return NextResponse.json({ analysis: { ...analysis, locale } });
    }

    let item = newsItem;
    if (!item && issueId) {
      const fallback = getFallbackNews();
      const corruptionFallback = getFallbackCorruption();
      item =
        fallback.find((n) => n.id === issueId) ||
        corruptionFallback.find((n) => n.id === issueId);
    }

    if (!item) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    if (item.sector === "corruption") {
      const analysis = await analyzeCorruptionStepByStep(
        item as CorruptionItem,
        locale
      );
      return NextResponse.json({ analysis });
    }

    const analysis = await analyzeIssue(item, useAI ?? false);
    return NextResponse.json({ analysis: { ...analysis, locale } });
  } catch (error) {
    return NextResponse.json(
      { error: "Analysis failed", details: String(error) },
      { status: 500 }
    );
  }
}