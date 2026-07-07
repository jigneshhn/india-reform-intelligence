"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar, { Tab } from "@/components/Sidebar";
import StatsOverview from "@/components/StatsOverview";
import SectorGrid from "@/components/SectorGrid";
import NewsFeed from "@/components/NewsFeed";
import CorruptionFeed from "@/components/CorruptionFeed";
import AnalysisPanel from "@/components/AnalysisPanel";
import BenchmarkChart from "@/components/BenchmarkChart";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AnalysisResult,
  CorruptionItem,
  DashboardStats,
  NewsItem,
  Sector,
  SectorId,
} from "@/lib/types";

export default function Home() {
  const { locale, t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [corruption, setCorruption] = useState<CorruptionItem[]>([]);
  const [corruptionGrouped, setCorruptionGrouped] = useState<Record<string, CorruptionItem[]>>({});
  const [corruptionPapers, setCorruptionPapers] = useState<string[]>([]);
  const [corruptionFetchedAt, setCorruptionFetchedAt] = useState<string>("");
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [dataSource, setDataSource] = useState("loading");
  const [corruptionSource, setCorruptionSource] = useState("loading");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("corruption");
  const [selectedSector, setSelectedSector] = useState<SectorId | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [corruptionView, setCorruptionView] = useState<"list" | "grouped">("grouped");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStepByStep, setIsStepByStep] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [newsRes, sectorsRes, corruptionRes] = await Promise.all([
        fetch("/api/news"),
        fetch("/api/sectors"),
        fetch("/api/corruption"),
      ]);
      const newsData = await newsRes.json();
      const sectorsData = await sectorsRes.json();
      const corruptionData = await corruptionRes.json();

      setNews(newsData.news);
      setDataSource(newsData.source);
      setSectors(sectorsData.sectors);
      setCorruption(corruptionData.items || []);
      setCorruptionGrouped(corruptionData.grouped || {});
      setCorruptionPapers(corruptionData.newspapers || []);
      setCorruptionFetchedAt(corruptionData.meta?.fetchedAt || "");
      setCorruptionSource(corruptionData.meta?.source || "live");
    } catch {
      setDataSource("fallback");
      setCorruptionSource("fallback");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats: DashboardStats = {
    totalIssues: news.length,
    criticalIssues: news.filter((n) => n.severity === "critical").length,
    sectorsAffected: new Set(news.map((n) => n.sector)).size,
    avgGapPercent: sectors.length
      ? Math.round(sectors.reduce((sum, s) => sum + s.gapPercent, 0) / sectors.length)
      : 0,
  };

  const runAnalysis = async (
    item: NewsItem | CorruptionItem,
    stepByStep: boolean
  ) => {
    setAnalyzingId(item.id);
    setIsAnalyzing(true);
    setIsStepByStep(stepByStep);
    setAnalysis(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsItem: item,
          mode: stepByStep ? "step-by-step" : undefined,
          locale,
        }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch {
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
      setAnalyzingId(null);
    }
  };

  const handleAnalyzeSector = async (sectorId: SectorId) => {
    setIsAnalyzing(true);
    setIsStepByStep(false);
    setAnalysis(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectorId, locale }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch {
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-[100dvh] bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={fetchData}
        isRefreshing={isRefreshing}
        dataSource={dataSource === "loading" ? corruptionSource : dataSource}
        issueCount={stats.totalIssues}
        criticalCount={stats.criticalIssues}
        corruptionCount={corruption.length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          selectedSector={selectedSector}
          onClearFilter={() => setSelectedSector(null)}
          onMenuOpen={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
          <StatsOverview
            stats={stats}
            corruptionCount={corruption.length}
            showCorruption={activeTab === "corruption"}
          />

          {activeTab === "corruption" && (
            <CorruptionFeed
              items={corruption}
              grouped={corruptionGrouped}
              newspapers={corruptionPapers}
              selectedPaper={selectedPaper}
              onSelectPaper={setSelectedPaper}
              onAnalyze={(item) => runAnalysis(item, true)}
              analyzingId={analyzingId}
              viewMode={corruptionView}
              onViewModeChange={setCorruptionView}
              fetchedAt={corruptionFetchedAt}
            />
          )}

          {activeTab === "issues" && (
            <NewsFeed
              news={news}
              selectedSector={selectedSector}
              onAnalyze={(item) => runAnalysis(item, false)}
              analyzingId={analyzingId}
            />
          )}

          {activeTab === "sectors" && (
            <SectorGrid
              sectors={sectors}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
              onAnalyzeSector={handleAnalyzeSector}
            />
          )}

          {activeTab === "benchmarks" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BenchmarkChart sectors={sectors} />
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md">
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                  {t("priorityReform")}
                </h3>
                <div className="space-y-1">
                  {sectors
                    .sort((a, b) => b.gapPercent - a.gapPercent)
                    .slice(0, 6)
                    .map((sector, i) => (
                      <button
                        key={sector.id}
                        onClick={() => handleAnalyzeSector(sector.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[var(--bg-elevated)] transition-colors text-left"
                      >
                        <span className="font-mono text-xs text-[var(--text-muted)] w-5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-primary)] truncate">
                            {sector.name}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] font-mono">
                            #{sector.indiaRank} · {sector.leaderCountry}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-[var(--error)]">
                          −{sector.gapPercent}%
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="px-4 sm:px-6 py-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)]">
          {t("footer")}
        </footer>
      </div>

      <AnalysisPanel
        analysis={analysis}
        onClose={() => setAnalysis(null)}
        isLoading={isAnalyzing}
        isStepByStep={isStepByStep}
      />
    </div>
  );
}