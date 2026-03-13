import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { verifyAdminCookie, getAdminTokenPayload } from "@/app/api/admin-auth/route";

// Business day starts at 20:00 JST — orders from 20:00 day N to 19:59 day N+1
// belong to day N's business_date. Formula matches the generated column:
// (created_at AT TIME ZONE 'Asia/Tokyo' - INTERVAL '20 hours')::date
function currentBusinessDate(): string {
  // +9h for JST, -20h for business day shift = net -11h from UTC
  const shifted = new Date(Date.now() - 11 * 60 * 60 * 1000);
  return shifted.toISOString().split("T")[0];
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}

function firstOfMonth(dateStr: string): string {
  return dateStr.slice(0, 8) + "01";
}

interface OrderItemRow {
  item_key: string;
  item_name_en: string;
  item_name_ja: string | null;
  price: number;
  quantity: number;
}

interface RawOrder {
  id: string;
  status: string;
  total: number;
  created_at: string;
  business_date: string;
  table_id: string;
  // Supabase returns joined relations as object or array depending on client inference
  table: { name: string } | { name: string }[] | null;
  items: OrderItemRow[];
}

function resolveTableName(table: RawOrder["table"]): string {
  if (!table) return "Unknown";
  if (Array.isArray(table)) return table[0]?.name ?? "Unknown";
  return table.name ?? "Unknown";
}

export interface AnalyticsSummary {
  revenue: number;
  losses: number;
  orderCount: number;
  cancelledCount: number;
  avgOrderValue: number;
  revenueChange: number | null;
  lossesChange: number | null;
  orderCountChange: number | null;
}

export interface TrendPoint {
  label: string;
  revenue: number;
  losses: number;
}

export interface TopItem {
  item_key: string;
  item_name_en: string;
  item_name_ja: string | null;
  count: number;
  revenue: number;
}

export interface PeakHour {
  hour: number;
  label: string;
  count: number;
}

export interface TableStat {
  table_id: string;
  name: string;
  orderCount: number;
  revenue: number;
  topItem: { name_en: string; name_ja: string | null; count: number } | null;
}

export interface AnalyticsPayload {
  period: { start: string; end: string; type: string };
  summary: AnalyticsSummary;
  trend: TrendPoint[];
  topItems: TopItem[];
  peakHours: PeakHour[];
  tableStats: TableStat[];
}

function pctChange(current: number, prior: number): number {
  if (prior === 0) return current > 0 ? 100 : 0;
  return ((current - prior) / prior) * 100;
}

function computeAnalytics(
  orders: RawOrder[],
  periodType: string,
  startDate: string,
  endDate: string,
  prior: { revenue: number; losses: number; orderCount: number } | null
): Omit<AnalyticsPayload, "period"> {
  const done = orders.filter((o) => o.status === "done");
  const cancelled = orders.filter((o) => o.status === "cancelled");

  const revenue = done.reduce((s, o) => s + (o.total || 0), 0);
  const losses = cancelled.reduce((s, o) => s + (o.total || 0), 0);
  const orderCount = done.length;
  const cancelledCount = cancelled.length;
  const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

  // Trend
  let trend: TrendPoint[];

  if (periodType === "today") {
    // Show hours 20-28 (hour 24=0, 25=1, ...28=4) in business-day order
    const hourData: Record<number, { revenue: number; losses: number }> = {};
    for (let h = 20; h <= 28; h++) hourData[h] = { revenue: 0, losses: 0 };

    for (const order of orders) {
      const jstHour = (new Date(order.created_at).getUTCHours() + 9) % 24;
      const bizH = jstHour >= 20 ? jstHour : jstHour + 24;
      if (bizH >= 20 && bizH <= 28) {
        if (order.status === "done") hourData[bizH].revenue += order.total || 0;
        else if (order.status === "cancelled") hourData[bizH].losses += order.total || 0;
      }
    }

    trend = Object.entries(hourData)
      .sort((a, b) => +a[0] - +b[0])
      .map(([h, v]) => ({ label: `${+h % 24}:00`, ...v }));
  } else {
    // Group by business_date, fill all dates in range
    const dateData: Record<string, { revenue: number; losses: number }> = {};
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    for (let ms = startMs; ms <= endMs; ms += 86400000) {
      dateData[new Date(ms).toISOString().split("T")[0]] = { revenue: 0, losses: 0 };
    }
    for (const order of orders) {
      const d = order.business_date;
      if (d && dateData[d] !== undefined) {
        if (order.status === "done") dateData[d].revenue += order.total || 0;
        else if (order.status === "cancelled") dateData[d].losses += order.total || 0;
      }
    }
    trend = Object.entries(dateData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, v]) => ({ label: date.slice(5).replace("-", "/"), ...v }));
  }

  // Top items (from done orders only)
  const itemMap: Record<string, TopItem> = {};
  for (const order of done) {
    for (const item of order.items ?? []) {
      if (!itemMap[item.item_key]) {
        itemMap[item.item_key] = {
          item_key: item.item_key,
          item_name_en: item.item_name_en,
          item_name_ja: item.item_name_ja ?? null,
          count: 0,
          revenue: 0,
        };
      }
      itemMap[item.item_key].count += item.quantity || 1;
      itemMap[item.item_key].revenue += (item.price || 0) * (item.quantity || 1);
    }
  }
  const topItems = Object.values(itemMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Peak hours (JST, all orders)
  const hourCount = new Array(24).fill(0);
  for (const order of orders) {
    const jstHour = (new Date(order.created_at).getUTCHours() + 9) % 24;
    hourCount[jstHour]++;
  }
  const peakHours: PeakHour[] = hourCount
    .map((count, hour) => ({ hour, label: `${hour}:00`, count }))
    .filter(({ count }) => count > 0);

  // Table stats (done orders)
  const tableMap: Record<string, {
    name: string;
    orderCount: number;
    revenue: number;
    items: Record<string, { name_en: string; name_ja: string | null; count: number }>;
  }> = {};
  for (const order of done) {
    const id = order.table_id;
    const name = resolveTableName(order.table);
    if (!tableMap[id]) tableMap[id] = { name, orderCount: 0, revenue: 0, items: {} };
    tableMap[id].orderCount++;
    tableMap[id].revenue += order.total || 0;
    for (const item of order.items ?? []) {
      if (!tableMap[id].items[item.item_key]) {
        tableMap[id].items[item.item_key] = { name_en: item.item_name_en, name_ja: item.item_name_ja ?? null, count: 0 };
      }
      tableMap[id].items[item.item_key].count += item.quantity || 1;
    }
  }
  const tableStats: TableStat[] = Object.entries(tableMap)
    .map(([table_id, v]) => {
      const itemEntries = Object.values(v.items);
      const topItem = itemEntries.length > 0
        ? itemEntries.reduce((a, b) => b.count > a.count ? b : a)
        : null;
      return { table_id, name: v.name, orderCount: v.orderCount, revenue: v.revenue, topItem };
    })
    .sort((a, b) => b.revenue - a.revenue);

  return {
    summary: {
      revenue,
      losses,
      orderCount,
      cancelledCount,
      avgOrderValue,
      revenueChange: prior ? pctChange(revenue, prior.revenue) : null,
      lossesChange: prior ? pctChange(losses, prior.losses) : null,
      orderCountChange: prior ? pctChange(orderCount, prior.orderCount) : null,
    },
    trend,
    topItems,
    peakHours,
    tableStats,
  };
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("cv_admin")?.value;
  if (!(await verifyAdminCookie(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await getAdminTokenPayload(token);
  if (payload?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const periodType = searchParams.get("period") ?? "today";
  let startDate = searchParams.get("start") ?? "";
  let endDate = searchParams.get("end") ?? "";

  const todayBiz = currentBusinessDate();

  if (periodType === "today") {
    startDate = todayBiz;
    endDate = todayBiz;
  } else if (periodType === "week") {
    startDate = shiftDate(todayBiz, -6);
    endDate = todayBiz;
  } else if (periodType === "month") {
    startDate = firstOfMonth(todayBiz);
    endDate = todayBiz;
  } else if (periodType === "custom") {
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "start and end required for custom period" }, { status: 400 });
    }
    if (startDate > todayBiz) {
      return NextResponse.json({ error: "Start date cannot be in the future" }, { status: 400 });
    }
    if (startDate > endDate) {
      return NextResponse.json({ error: "Start date must be before end date" }, { status: 400 });
    }
    if (endDate > todayBiz) endDate = todayBiz;
  } else {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "id, status, total, created_at, business_date, table_id, table:tables(name), items:order_items(item_key, item_name_en, item_name_ja, price, quantity)"
    )
    .gte("business_date", startDate)
    .lte("business_date", endDate);

  if (error) {
    console.error("[analytics] DB error:", error.message);
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 });
  }

  let priorSummary: { revenue: number; losses: number; orderCount: number } | null = null;
  if (periodType !== "custom") {
    const days =
      Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1;
    const priorEnd = shiftDate(startDate, -1);
    const priorStart = shiftDate(priorEnd, -(days - 1));

    const { data: priorOrders } = await supabase
      .from("orders")
      .select("status, total")
      .gte("business_date", priorStart)
      .lte("business_date", priorEnd);

    if (priorOrders) {
      const priorDone = priorOrders.filter((o) => o.status === "done");
      const priorCancelled = priorOrders.filter((o) => o.status === "cancelled");
      priorSummary = {
        revenue: priorDone.reduce((s, o) => s + (o.total || 0), 0),
        losses: priorCancelled.reduce((s, o) => s + (o.total || 0), 0),
        orderCount: priorDone.length,
      };
    }
  }

  const result = computeAnalytics(
    (orders ?? []) as unknown as RawOrder[],
    periodType,
    startDate,
    endDate,
    priorSummary
  );

  return NextResponse.json({
    ...result,
    period: { start: startDate, end: endDate, type: periodType },
  } satisfies AnalyticsPayload);
}
