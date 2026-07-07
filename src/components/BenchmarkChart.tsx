"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sector } from "@/lib/types";

interface BenchmarkChartProps {
  sectors: Sector[];
}

export default function BenchmarkChart({ sectors }: BenchmarkChartProps) {
  const { t } = useLanguage();

  const data = sectors
    .sort((a, b) => b.gapPercent - a.gapPercent)
    .slice(0, 8)
    .map((s) => ({
      name: s.name.split(" ")[0],
      fullName: s.name,
      india: Math.max(10, 100 - s.gapPercent),
      leader: s.leaderScore,
    }));

  return (
    <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md">
      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
        {t("indiaVsLeaders")}
      </h3>
      <p className="text-xs text-[var(--text-muted)] mb-4">{t("performanceScore")}</p>
      <div className="w-full h-[240px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" fontSize={10} />
            <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={10} width={60} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "12px",
                color: "var(--text-primary)",
              }}
              formatter={(value, name) => [
                `${value ?? 0}`,
                name === "india" ? t("india") : t("globalLeader"),
              ]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ""}
            />
            <Bar dataKey="india" fill="#d77757" radius={[0, 2, 2, 0]} barSize={8} />
            <Bar dataKey="leader" fill="#4eba65" radius={[0, 2, 2, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-2 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#d77757]" />
          {t("india")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#4eba65]" />
          {t("globalLeader")}
        </span>
      </div>
    </div>
  );
}