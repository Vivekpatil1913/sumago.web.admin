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
import { Badge, Card, ErrorState, Skeleton, cn } from "@/components/admin/ui";

interface DashboardCard {
  key: string;
  label: string;
  value: number;
  tone: "neutral" | "warn";
  href: string;
  hint?: string;
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
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ cards: DashboardCard[]; recentActivity: ActivityEntry[] }>(
        "/dashboard",
      );
      setCards(response.data.cards);
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
        title={`${greeting()}, ${user?.name.split(" ")[0] ?? "there"}`}
        description="Here's what needs your attention."
      />

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Skeleton key={index} className="h-[6.5rem]" />
          ))}
        </div>
      ) : cards.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.key} href={`/admin${card.href}`} className="group block">
              <StatTile
                label={card.label}
                value={card.value}
                hint={card.hint}
                tone={card.tone}
                icon={CARD_ICONS[card.key]}
              />
            </Link>
          ))}
        </div>
      ) : null}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-content">Recent activity</h2>
          {user?.isAdmin ? (
            <Link
              href="/admin/activity"
              className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : null}
        </div>

        <Card padded={false}>
          {loading ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2, 3].map((index) => (
                <Skeleton key={index} className="h-5" />
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">Nothing recorded yet.</p>
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
                      <span className="font-medium text-content">{entry.recordLabel}</span>
                    ) : null}
                    {entry.moduleKey ? (
                      <span className={cn(entry.recordLabel && "ml-1.5", "text-muted")}>
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
