import { NextResponse } from "next/server";
import { fetchDailyCorruption, groupByNewspaper } from "@/lib/corruption-fetcher";

export const dynamic = "force-dynamic";
export const revalidate = 1800;

export async function GET() {
  try {
    const { items, source } = await fetchDailyCorruption();
    const grouped = groupByNewspaper(items);
    const newspapers = Object.keys(grouped).sort();

    return NextResponse.json(
      {
        items,
        grouped,
        newspapers,
        meta: {
          fetchedAt: new Date().toISOString(),
          totalCases: items.length,
          newspaperCount: newspapers.length,
          source,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch corruption feed", details: String(error) },
      { status: 500 }
    );
  }
}