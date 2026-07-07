import type { Locale } from "@/i18n";

export type SectorId =
  | "corruption"
  | "education"
  | "healthcare"
  | "infrastructure"
  | "economy"
  | "governance"
  | "environment"
  | "technology"
  | "agriculture"
  | "judiciary"
  | "women-safety"
  | "poverty";

export interface Sector {
  id: SectorId;
  name: string;
  icon: string;
  description: string;
  indiaRank: number;
  globalAverage: number;
  leaderCountry: string;
  leaderScore: number;
  gapPercent: number;
  keyIssues: string[];
  trend: "improving" | "declining" | "stable";
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  sector: SectorId;
  severity: "critical" | "high" | "medium" | "low";
}

export interface CorruptionItem extends NewsItem {
  newspaper: string;
  newspaperId: string;
  region?: string;
}

export interface SolutionPhase {
  phase: string;
  timeline: string;
  actions: string[];
  expectedImpact: string;
}

export interface AnalysisStep {
  stepNumber: number;
  title: string;
  description: string;
  actions: string[];
  timeframe: string;
  responsibleParty: string;
}

export interface AnalysisResult {
  issueId: string;
  title: string;
  sector: SectorId;
  sectorName: string;
  rootCauses: string[];
  globalBenchmark: {
    country: string;
    approach: string;
    outcome: string;
  };
  solutions: SolutionPhase[];
  policyRecommendations: string[];
  citizenActions: string[];
  estimatedImpact: string;
  confidenceScore: number;
  analyzedAt: string;
  locale: Locale;
  steps?: AnalysisStep[];
  legalFramework?: string[];
  preventionMeasures?: string[];
}

export interface DashboardStats {
  totalIssues: number;
  criticalIssues: number;
  sectorsAffected: number;
  avgGapPercent: number;
}

export interface CorruptionFeedMeta {
  fetchedAt: string;
  totalCases: number;
  newspaperCount: number;
  source: "live" | "fallback" | "cache";
}