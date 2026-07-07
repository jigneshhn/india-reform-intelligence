"use client";

import { CheckCircle2, Globe, Target, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnalysisResult } from "@/lib/types";

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  onClose: () => void;
  isLoading: boolean;
  isStepByStep?: boolean;
}

export default function AnalysisPanel({
  analysis,
  onClose,
  isLoading,
  isStepByStep = false,
}: AnalysisPanelProps) {
  const { t } = useLanguage();

  if (!analysis && !isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[var(--bg-primary)] border-l border-[var(--border)] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 py-3 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-medium">
              {isStepByStep ? t("stepByStep") : t("aiAnalysis")}
            </p>
            <h2 className="text-sm font-medium text-[var(--text-primary)]">
              {t("reformRoadmap")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors"
            aria-label={t("close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse"
                style={{ width: `${90 - i * 10}%` }}
              />
            ))}
            <p className="text-center text-[var(--text-muted)] text-xs pt-4">
              {isStepByStep ? t("analyzingCorruption") : t("analyzing")}
            </p>
          </div>
        ) : analysis ? (
          <div className="p-4 sm:p-5 space-y-5">
            <div className="pb-4 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--accent)]">
                {analysis.sectorName}
              </span>
              <h3 className="text-sm sm:text-base font-medium text-[var(--text-primary)] mt-1 leading-snug">
                {analysis.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-muted)]">
                <span>{t("confidence")}</span>
                <div className="flex-1 h-1 bg-[var(--bg-elevated)] rounded-sm max-w-[100px]">
                  <div
                    className="h-full bg-[var(--accent)] rounded-sm"
                    style={{ width: `${analysis.confidenceScore}%` }}
                  />
                </div>
                <span className="font-mono">{analysis.confidenceScore}%</span>
              </div>
            </div>

            {analysis.steps && analysis.steps.length > 0 && (
              <section>
                <h4 className="text-xs uppercase tracking-wide text-[var(--accent)] mb-3 font-medium">
                  {t("stepByStep")}
                </h4>
                <div className="space-y-3">
                  {analysis.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="border border-[var(--border-subtle)] rounded-md overflow-hidden"
                    >
                      <div className="px-3 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
                        <div className="flex items-start gap-2">
                          <span className="font-mono text-xs text-[var(--accent)] shrink-0 mt-0.5">
                            {String(step.stepNumber).padStart(2, "0")}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                              {step.title}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                              {step.timeframe} · {t("responsibleParty")}: {step.responsibleParty}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                          {step.description}
                        </p>
                        <ol className="space-y-1.5">
                          {step.actions.map((action, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0 mt-0.5" />
                              {action}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h4 className="flex items-center gap-2 text-xs uppercase tracking-wide text-[var(--error)] mb-2 font-medium">
                <Target className="w-3.5 h-3.5" />
                {t("rootCauses")}
              </h4>
              <ol className="space-y-1.5">
                {analysis.rootCauses.map((cause, i) => (
                  <li
                    key={i}
                    className="text-sm text-[var(--text-secondary)] pl-4 border-l border-[var(--border)] py-1"
                  >
                    <span className="font-mono text-[var(--text-muted)] text-xs mr-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {cause}
                  </li>
                ))}
              </ol>
            </section>

            {analysis.legalFramework && (
              <section>
                <h4 className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2 font-medium">
                  {t("legalFramework")}
                </h4>
                <ul className="space-y-1">
                  {analysis.legalFramework.map((law, i) => (
                    <li key={i} className="text-xs text-[var(--text-secondary)] py-1 border-b border-[var(--border-subtle)] last:border-0">
                      {law}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md">
              <h4 className="flex items-center gap-2 text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2 font-medium">
                <Globe className="w-3.5 h-3.5" />
                {t("benchmark")} — {analysis.globalBenchmark.country}
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                {analysis.globalBenchmark.approach}
              </p>
              <p className="text-xs text-[var(--success)]">
                → {analysis.globalBenchmark.outcome}
              </p>
            </section>

            {!analysis.steps && (
              <section>
                <h4 className="text-xs uppercase tracking-wide text-[var(--success)] mb-2 font-medium">
                  {t("phasedSolutions")}
                </h4>
                <div className="space-y-2">
                  {analysis.solutions.map((solution, i) => (
                    <div
                      key={i}
                      className="border border-[var(--border-subtle)] rounded-md overflow-hidden"
                    >
                      <div className="px-3 py-2 bg-[var(--bg-secondary)] text-xs font-medium text-[var(--text-primary)] border-b border-[var(--border-subtle)]">
                        {solution.phase}
                        <span className="text-[var(--text-muted)] ml-2 font-normal">
                          {solution.timeline}
                        </span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        {solution.actions.map((action, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0 mt-0.5" />
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {analysis.preventionMeasures && (
              <section>
                <h4 className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2 font-medium">
                  {t("prevention")}
                </h4>
                <ul className="space-y-1">
                  {analysis.preventionMeasures.map((m, i) => (
                    <li key={i} className="text-sm text-[var(--text-secondary)] py-1.5 border-b border-[var(--border-subtle)] last:border-0">
                      {m}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h4 className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2 font-medium">
                {t("policyRecommendations")}
              </h4>
              <ul className="space-y-1">
                {analysis.policyRecommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] py-1.5 border-b border-[var(--border-subtle)] last:border-0">
                    {rec}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2 font-medium">
                {t("citizenActions")}
              </h4>
              <ul className="space-y-1">
                {analysis.citizenActions.map((action, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] py-1.5 border-b border-[var(--border-subtle)] last:border-0">
                    {action}
                  </li>
                ))}
              </ul>
            </section>

            <section className="p-3 border border-[var(--accent)] bg-[var(--accent-soft)] rounded-md">
              <h4 className="text-xs uppercase tracking-wide text-[var(--accent)] mb-1 font-medium">
                {t("estimatedImpact")}
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {analysis.estimatedImpact}
              </p>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}