"use client";

import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminLang } from "@/hooks/useAdminLang";
import { adminDict } from "@/lib/i18n/adminDict";
import type { AnalyticsPayload } from "@/app/api/admin/analytics/route";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Returns current business date (20:00 JST = new day)
// Matches the DB generated column formula
function getCurrentBusinessDate(): string {
  const shifted = new Date(Date.now() - 11 * 60 * 60 * 1000);
  return shifted.toISOString().split("T")[0];
}

function formatCurrency(v: number): string {
  return `¥${v.toLocaleString("ja-JP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type PeriodType = "today" | "week" | "month" | "custom";

interface AnalyticsViewProps {
  logoUrl?: string;
  username?: string;
  role?: "admin" | "crew";
}

// ---- KPI Card ----
function KPICard({
  label,
  value,
  change,
  changeLabel,
  positiveIsGood = true,
  subtitle,
}: {
  label: string;
  value: string;
  change: number | null;
  changeLabel: string;
  positiveIsGood?: boolean;
  subtitle?: string;
}) {
  const isPositive = change !== null && change > 0;
  const isGood = positiveIsGood ? isPositive : !isPositive;
  const changeColor =
    change === null ? "text-white/30"
    : change === 0 ? "text-white/30"
    : isGood ? "text-emerald-400"
    : "text-red-400";

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5 flex flex-col gap-1">
      <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">{label}</p>
      <p className="text-white text-xl sm:text-2xl font-bold leading-tight">{value}</p>
      {change !== null && (
        <p className={`text-xs ${changeColor}`}>
          {change >= 0 ? "+" : ""}{change.toFixed(1)}% {changeLabel}
        </p>
      )}
      {subtitle && (
        <p className="text-red-400 text-[11px] mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

// ---- Chart Tooltip styles ----
const tooltipStyle = {
  contentStyle: {
    background: "#0d0d1a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  labelStyle: { color: "rgba(255,255,255,0.4)" },
  cursor: { fill: "rgba(255,255,255,0.03)" },
};

const axisStyle = {
  tick: { fill: "rgba(255,255,255,0.3)", fontSize: 11 },
  axisLine: false as const,
  tickLine: false as const,
};

// ---- Empty state ----
function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-40 text-white/25 text-sm">{label}</div>
  );
}

// ---- Chart skeleton ----
function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div
      className="rounded-xl bg-white/[0.03] animate-pulse"
      style={{ height }}
    />
  );
}

export default function AnalyticsView({ logoUrl, username, role = "admin" }: AnalyticsViewProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useAdminLang();
  const t = adminDict[lang];

  const [period, setPeriod] = useState<PeriodType>("today");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [dateError, setDateError] = useState("");

  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [itemSortBy, setItemSortBy] = useState<"count" | "revenue">("count");

  const todayBiz = getCurrentBusinessDate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async (p: PeriodType, start?: string, end?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ period: p });
      if (p === "custom" && start && end) {
        params.set("start", start);
        params.set("end", end);
      }
      const res = await fetch(`/api/admin/analytics?${params}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData("today");
  }, [fetchData]);

  function handlePeriodChange(p: PeriodType) {
    setPeriod(p);
    setDateError("");
    if (p !== "custom") fetchData(p);
  }

  function handleCustomApply() {
    setDateError("");
    if (!customStart || !customEnd) {
      setDateError(t.dateRangeError);
      return;
    }
    if (customStart > todayBiz) {
      setDateError(t.futureDateError);
      return;
    }
    if (customStart > customEnd) {
      setDateError(t.dateRangeError);
      return;
    }
    fetchData("custom", customStart, customEnd);
  }

  const hasData = data
    ? data.summary.orderCount + data.summary.cancelledCount > 0
    : false;

  const peakHoursMax = Math.max(1, ...(data?.peakHours ?? []).map((h) => h.count));
  const peakHoursTicks = Array.from({ length: peakHoursMax + 1 }, (_, i) => i);

  // Prepare top-item chart data (show up to 7, sorted by active sort key)
  const itemChartData = [...(data?.topItems ?? [])]
    .sort((a, b) => b[itemSortBy] - a[itemSortBy])
    .slice(0, 7)
    .map((item) => ({
      name: lang === "ja" && item.item_name_ja ? item.item_name_ja : item.item_name_en,
      count: item.count,
      revenue: item.revenue,
    }));

  const periodLabels: Record<PeriodType, string> = {
    today: t.periodToday,
    week: t.periodWeek,
    month: t.periodMonth,
    custom: t.periodCustom,
  };

  const sidebarContent = (
    <AdminSidebar
      logoUrl={logoUrl}
      username={username}
      lang={lang}
      setLang={setLang}
      activePage="analytics"
      role={role}
      onMobileClose={() => setMobileOpen(false)}
    />
  );

  return (
    <div className="flex bg-dark-900 min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-dark-800/60 border-r border-white/5 sticky top-0 h-screen overflow-y-auto z-10">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-dark-800 border-r border-white/8 flex flex-col h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-dark-900/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 py-3">
          <p className="font-bold bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">Club Vanilla</p>
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 px-5 sm:px-8 py-6 sm:py-8 flex flex-col gap-6">

          {/* Header + period selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">{t.analytics}</h1>
              {data && (
                <p className="text-white/30 text-xs mt-0.5">
                  {data.period.start === data.period.end
                    ? data.period.start
                    : `${data.period.start} – ${data.period.end}`}
                </p>
              )}
            </div>

            {/* Period tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 gap-0.5 self-start sm:self-auto shrink-0">
              {(["today", "week", "month", "custom"] as PeriodType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    period === p
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {periodLabels[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Custom date range picker */}
          {period === "custom" && (
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex flex-col gap-1">
                <label className="text-white/40 text-xs font-medium">{t.startDate}</label>
                <input
                  type="date"
                  value={customStart}
                  max={todayBiz}
                  onChange={(e) => {
                    setCustomStart(e.target.value);
                    setDateError("");
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-pink/50 transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/40 text-xs font-medium">{t.endDate}</label>
                <input
                  type="date"
                  value={customEnd}
                  min={customStart}
                  max={todayBiz}
                  onChange={(e) => {
                    setCustomEnd(e.target.value);
                    setDateError("");
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-pink/50 transition-colors [color-scheme:dark]"
                />
              </div>
              <button
                onClick={handleCustomApply}
                disabled={!customStart || !customEnd}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40"
              >
                {t.applyRange}
              </button>
              {dateError && <p className="text-red-400 text-xs self-center">{dateError}</p>}
            </div>
          )}

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <KPICard
              label={t.totalRevenue}
              value={data ? formatCurrency(data.summary.revenue) : "—"}
              change={data?.summary.revenueChange ?? null}
              changeLabel={t.vsLastPeriod}
              positiveIsGood={true}
            />
            <KPICard
              label={t.completedOrders}
              value={data ? String(data.summary.orderCount) : "—"}
              change={data?.summary.orderCountChange ?? null}
              changeLabel={t.vsLastPeriod}
              positiveIsGood={true}
            />
            <KPICard
              label={t.cancellationRate}
              value={data
                ? (() => {
                    const total = data.summary.orderCount + data.summary.cancelledCount;
                    return total > 0
                      ? `${((data.summary.cancelledCount / total) * 100).toFixed(1)}%`
                      : "—";
                  })()
                : "—"}
              change={null}
              changeLabel=""
              positiveIsGood={false}
              subtitle={data
                ? `${data.summary.cancelledCount} cancelled`
                : undefined}
            />
            <KPICard
              label={t.cancellationLoss}
              value={data ? formatCurrency(data.summary.losses) : "—"}
              change={data?.summary.lossesChange ?? null}
              changeLabel={t.vsLastPeriod}
              positiveIsGood={false}
            />
          </div>

          {/* Revenue Over Time chart */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-white font-semibold mb-4">{t.revenueOverTime}</h2>
            {loading || !mounted ? (
              <ChartSkeleton />
            ) : !hasData ? (
              <EmptyState label={t.noDataForPeriod} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data?.trend ?? []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradLosses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="label" {...axisStyle} />
                  <YAxis
                    {...axisStyle}
                    width={50}
                    tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(v: unknown, name: unknown) => [
                      formatCurrency(typeof v === "number" ? v : 0),
                      name === "revenue" ? t.totalRevenue : t.cancellationLoss,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ec4899"
                    strokeWidth={2}
                    fill="url(#gradRevenue)"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="losses"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    fill="url(#gradLosses)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top items + Peak hours */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Top menu items */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6 flex flex-col min-h-[320px]">
              <div className="flex items-center justify-between mb-4 gap-3">
                <h2 className="text-white font-semibold">{t.topMenuItems}</h2>
                <div className="flex bg-white/5 rounded-lg p-0.5 gap-0.5 shrink-0">
                  <button
                    onClick={() => setItemSortBy("count")}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      itemSortBy === "count" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {t.sortByCount}
                  </button>
                  <button
                    onClick={() => setItemSortBy("revenue")}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      itemSortBy === "revenue" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {t.sortByRevenue}
                  </button>
                </div>
              </div>
              {loading || !mounted ? (
                <ChartSkeleton height={200} />
              ) : itemChartData.length === 0 ? (
                <EmptyState label={t.noDataForPeriod} />
              ) : (
                <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={itemChartData}
                    layout="vertical"
                    margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      type="number"
                      orientation="bottom"
                      domain={[0, 'dataMax']}
                      {...axisStyle}
                      tickFormatter={
                        itemSortBy === "revenue"
                          ? (v) => `¥${(v / 1000).toFixed(0)}k`
                          : undefined
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      {...tooltipStyle}
                      formatter={(v: unknown) => [
                        itemSortBy === "revenue" ? formatCurrency(typeof v === "number" ? v : 0) : `${v}`,
                        itemSortBy === "revenue" ? t.revenue : t.ordersCount,
                      ]}
                    />
                    <Bar
                      dataKey={itemSortBy}
                      fill="#a855f7"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Peak hours */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6 flex flex-col min-h-[320px]">
              <h2 className="text-white font-semibold mb-4">{t.peakHours}</h2>
              {loading || !mounted ? (
                <ChartSkeleton height={200} />
              ) : !hasData ? (
                <EmptyState label={t.noDataForPeriod} />
              ) : (
                <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.peakHours ?? []}
                    margin={{ top: 0, right: 4, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="label" {...axisStyle} />
                    <YAxis {...axisStyle} domain={[0, peakHoursMax]} ticks={peakHoursTicks} allowDecimals={false} width={28} />
                    <Tooltip
                      {...tooltipStyle}
                      formatter={(v: unknown) => [typeof v === "number" ? v : 0, t.ordersCount]}
                    />
                    <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Table performance */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-white font-semibold mb-4">{t.tablePerformance}</h2>
            {loading ? (
              <div className="h-24 bg-white/[0.03] animate-pulse rounded-xl" />
            ) : !hasData || (data?.tableStats ?? []).length === 0 ? (
              <EmptyState label={t.noDataForPeriod} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-white/30 text-[11px] font-semibold uppercase tracking-widest pb-3 pr-4">
                        {t.tableName}
                      </th>
                      <th className="text-right text-white/30 text-[11px] font-semibold uppercase tracking-widest pb-3 px-4">
                        {t.ordersCount}
                      </th>
                      <th className="text-right text-white/30 text-[11px] font-semibold uppercase tracking-widest pb-3 px-4">
                        {t.revenue}
                      </th>
                      <th className="text-right text-white/30 text-[11px] font-semibold uppercase tracking-widest pb-3 pl-4">
                        {t.topItem}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data?.tableStats.map((row) => (
                      <tr key={row.table_id}>
                        <td className="py-3 pr-4 text-white font-medium">{row.name}</td>
                        <td className="py-3 px-4 text-right text-white/60">{row.orderCount}</td>
                        <td className="py-3 px-4 text-right text-white/80 font-medium">
                          {formatCurrency(row.revenue)}
                        </td>
                        <td className="py-3 pl-4 text-right text-white/50">
                          {row.topItem
                            ? `${lang === "ja" && row.topItem.name_ja ? row.topItem.name_ja : row.topItem.name_en} x${row.topItem.count}`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
