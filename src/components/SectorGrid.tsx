"use client";

import {
  Building2,
  Cpu,
  Gavel,
  GraduationCap,
  Heart,
  Landmark,
  Leaf,
  Scale,
  Shield,
  TrendingUp,
  Users,
  Wheat,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sector, SectorId } from "@/lib/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale, GraduationCap, Heart, Building2, TrendingUp, Landmark, Leaf, Cpu, Wheat, Gavel, Shield, Users,
};

interface SectorGridProps {
  sectors: Sector[];
  selectedSector: SectorId | null;
  onSelectSector: (id: SectorId) => void;
  onAnalyzeSector: (id: SectorId) => void;
}

export default function SectorGrid({
  sectors,
  selectedSector,
  onSelectSector,
  onAnalyzeSector,
}: SectorGridProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {sectors.map((sector) => {
        const Icon = ICON_MAP[sector.icon] || Scale;
        const isSelected = selectedSector === sector.id;

        return (
          <div
            key={sector.id}
            onClick={() => onSelectSector(sector.id)}
            className={`group p-4 border cursor-pointer transition-colors rounded-md ${
              isSelected
                ? "bg-[var(--accent-soft)] border-[var(--accent)]"
                : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--border)]"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <Icon className={`w-4 h-4 ${isSelected ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
              <span
                className={`font-mono text-[10px] uppercase tracking-wide ${
                  sector.trend === "improving"
                    ? "text-[var(--success)]"
                    : sector.trend === "declining"
                      ? "text-[var(--error)]"
                      : "text-[var(--text-muted)]"
                }`}
              >
                {sector.trend === "improving"
                  ? t("improving")
                  : sector.trend === "declining"
                    ? t("declining")
                    : t("stable")}
              </span>
            </div>

            <h3 className="font-medium text-[var(--text-primary)] text-sm mb-1">{sector.name}</h3>
            <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2 leading-relaxed">
              {sector.description}
            </p>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)]">
                {t("globalRank")} <span className="text-[var(--error)]">#{sector.indiaRank}</span>
              </span>
              <span className="text-[var(--text-muted)]">
                {t("gap")} <span className="text-[var(--warning)]">{sector.gapPercent}%</span>
              </span>
            </div>

            <div className="mt-2 h-1 bg-[var(--bg-primary)] rounded-sm overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-sm"
                style={{ width: `${Math.max(8, 100 - sector.gapPercent)}%` }}
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAnalyzeSector(sector.id);
              }}
              className="mt-3 w-full py-2 text-xs font-medium rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
            >
              {t("analyzeSector")}
            </button>
          </div>
        );
      })}
    </div>
  );
}