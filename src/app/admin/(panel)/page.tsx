"use client";

/** PRD §5 — the landing screen. Cards come from the API already role-filtered. */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  FileEdit,
  Image as ImageIcon,
  Inbox,
  Link2,
  MessageSquare,
} from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp } from "@/lib/admin/app-context";
import { humanise, timeAgo } from "@/lib/admin/format";
import { PageHeader, StatTile } from "@/components/admin/page-header";
import {
  CategoryBars,
  TimeSeriesChart,
  TrendPanel,
  type ChartDelta,
  type ChartPoint,
  type ChartUnit,
} from "@/components/admin/chart";
import { Badge, Card, ErrorState, Skeleton, cn } from "@/components/admin/ui";

interface DashboardCard {
  key: string;
  label: string;
  value: number;
  tone: "neutral" | "warn";
  href: string;
  hint?: string;
}

interface DashboardChart {
  key: string;
  label: string;
  hint?: string;
  value: number;
  valueLabel: string;
  kind: "area" | "column" | "bar";
  axis: "date" | "text";
  points: ChartPoint[];
  delta?: ChartDelta;
  /** Absent when there is no screen behind the figure — see the API. */
  href?: string;
  empty?: string;
}

interface ActivityEntry {
  id: string;
  userName: string | null;
  action: string;
  moduleKey: string | null;
  recordLabel: string | null;
  createdAt: string;
}

/** A recognisable glyph per card, so the grid is scannable at a glance. */
const CARD_ICONS: Record<string, React.ReactNode> = {
  "new-applications": <Inbox className="h-4 w-4" aria-hidden />,
  "open-jobs": <Briefcase className="h-4 w-4" aria-hidden />,
  "new-enquiries": <MessageSquare className="h-4 w-4" aria-hidden />,
  drafts: <FileEdit className="h-4 w-4" aria-hidden />,
  "missing-alt": <AlertTriangle className="h-4 w-4" aria-hidden />,
  "stock-live": <ImageIcon className="h-4 w-4" aria-hidden />,
  "placeholder-social": <Link2 className="h-4 w-4" aria-hidden />,
};

/**
 * One hue per trend, held steady across reloads so the shape of the row is
 * learnable — the blue panel is always sales, the red one always traffic.
 */
const CHART_COLORS: Record<string, string> = {
  "enquiries-month": "--a-chart-1",
  "site-visits": "--a-chart-2",
  "open-jobs-live": "--a-chart-3",
};

/** The noun each series counts, for the hover readout and the accessible summary. */
const CHART_UNITS: Record<string, ChartUnit> = {
  "enquiries-month": { one: "enquiry", many: "enquiries" },
  "site-visits": { one: "visit", many: "visits" },
  "open-jobs-live": { one: "role", many: "roles" },
};

/** Actions that deserve a colour in the feed; everything else stays neutral. */
const ACTION_TONE: Record<string, "ok" | "danger" | "warn" | "accent"> = {
  create: "ok",
  publish: "ok",
  restore: "ok",
  activate: "ok",
  delete: "danger",
  erase: "danger",
  deactivate: "warn",
  archive: "warn",
  login_failed: "danger",
  download_resume: "accent",
};

export default function DashboardPage() {
  const { user } = useApp();
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [charts, setCharts] = useState<DashboardChart[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{
        cards: DashboardCard[];
        charts: DashboardChart[];
        recentActivity: ActivityEntry[];
      }>("/dashboard");
      setCards(response.data.cards);
      setCharts(response.data.charts ?? []);
      setActivity(response.data.recentActivity);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow={today()}
        title={`${greeting()}, ${user?.name.split(" ")[0] ?? "there"} 👋`}
        description="Here's what needs your attention."
        infoLabel="About this dashboard"
        info={
          <>
            Every tile is live and counts only what your role is allowed to see,
            so two people can see different numbers here. A tile in amber is
            blocking something — an unanswered enquiry, a missing alt text, a
            stock image still on the live site. Select one to open the records
            behind it.
          </>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Skeleton key={index} className="h-[8.5rem]" />
          ))}
        </div>
      ) : cards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <Link
              key={card.key}
              href={`/admin${card.href}`}
              className="group block"
            >
              <StatTile
                label={card.label}
                value={card.value}
                hint={card.hint}
                tone={card.tone}
                icon={CARD_ICONS[card.key]}
                tint={index}
              />
            </Link>
          ))}
        </div>
      ) : null}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold tracking-tight text-content">
            Trends
          </h2>
          <p className="text-xs text-muted">Last 30 days, live from the database.</p>
        </div>

        {loading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-64" />
            ))}
          </div>
        ) : charts.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {charts.map((chart) => {
              const color = CHART_COLORS[chart.key] ?? "--a-chart-1";
              const unit = CHART_UNITS[chart.key] ?? {
                one: "record",
                many: "records",
              };
              const hasData = chart.points.some((point) => point.value > 0);

              const panel = (
                <TrendPanel
                  label={chart.label}
                  hint={chart.hint}
                  value={chart.value}
                  valueLabel={chart.valueLabel}
                  delta={chart.delta}
                >
                  {!hasData ? (
                    <p className="py-8 text-center text-[13px] text-muted">
                      {chart.empty ?? "Nothing to chart yet."}
                    </p>
                  ) : chart.kind === "bar" ? (
                    <CategoryBars points={chart.points} color={color} />
                  ) : (
                    <TimeSeriesChart
                      points={chart.points}
                      kind={chart.kind}
                      axis={chart.axis}
                      color={color}
                      unit={unit}
                    />
                  )}
                </TrendPanel>
              );

              /*
               * Only the panels with records behind them become links. Website
               * traffic has none — a visit is a counted event, not something
               * anyone opens — and a card that looks clickable and goes nowhere
               * is worse than one that never claimed to.
               */
              return chart.href ? (
                <Link
                  key={chart.key}
                  href={`/admin${chart.href}`}
                  className="group block rounded-[var(--radius-card)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {panel}
                </Link>
              ) : (
                <div key={chart.key}>{panel}</div>
              );
            })}
          </div>
        ) : null}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold tracking-tight text-content">
            Recent activity
          </h2>
          {/*
            Shown to everyone. The feed above is capped at the latest 15; the
            screen behind this link gives an Admin the whole log and everyone
            else their own history, so neither is left at a dead end.
          */}
          <Link
            href="/admin/activity"
            className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <Card padded={false}>
          {loading ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2, 3].map((index) => (
                <Skeleton key={index} className="h-5" />
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              Nothing recorded yet.
            </p>
          ) : (
            <ul className="divide-y divide-line-soft">
              {activity.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-surface-hover"
                >
                  <Badge tone={ACTION_TONE[entry.action] ?? "neutral"} dot>
                    {humanise(entry.action)}
                  </Badge>

                  <span className="min-w-0 flex-1 truncate text-content-soft">
                    {entry.recordLabel ? (
                      <span className="font-medium text-content">
                        {entry.recordLabel}
                      </span>
                    ) : null}
                    {entry.moduleKey ? (
                      <span
                        className={cn(
                          entry.recordLabel && "ml-1.5",
                          "text-muted",
                        )}
                      >
                        in {humanise(entry.moduleKey)}
                      </span>
                    ) : null}
                  </span>

                  <span className="hidden w-32 shrink-0 truncate text-right text-xs text-muted sm:block">
                    {entry.userName ?? "System"}
                  </span>
                  <span className="w-24 shrink-0 text-right text-xs text-muted">
                    {timeAgo(entry.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** The eyebrow above the greeting — "Saturday, 8 August 2026". */
function today(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
