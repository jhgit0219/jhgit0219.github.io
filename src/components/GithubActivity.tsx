"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaGithub,
  FaCodeBranch,
  FaCodeCommit,
  FaPlus,
  FaStar,
  FaArrowRight,
} from "react-icons/fa6";

const GITHUB_USERNAME = "jhgit0219";

// jogruber's public contributions API — no auth, no rate limit issues for
// portfolio-scale traffic. Returns 365 days of contribution counts + levels.
const HEATMAP_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

// GitHub's public events API — gives lifecycle events (PR/issue/star/release/
// fork/create). We deliberately drop PushEvent from here and source commits
// from the per-repo endpoint instead, because /events only surfaces pushes
// to PUBLIC repos and most active work tends to live in private ones.
const EVENTS_API = `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=40`;
const REPOS_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=10`;

// How many of the user's most-recently-pushed public repos to scrape for
// commits, and how many commits to pull from each. Total cost in the
// unauthenticated /repos/.../commits bucket: TOP_REPOS_FOR_COMMITS calls per
// visit, well within the 60/hr per-IP budget alongside heatmap + events +
// the separate GithubRepos fetch.
const TOP_REPOS_FOR_COMMITS = 4;
const COMMITS_PER_REPO = 6;
const FEED_MAX = 8;

type Contribution = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type HeatmapResponse = {
  total: Record<string, number>;
  contributions: Contribution[];
};

type GhEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    commits?: Array<{ message: string; sha: string }>;
    ref_type?: string;
    ref?: string;
    action?: string;
    pull_request?: { title: string; html_url: string; number: number };
    issue?: { title: string; html_url: string; number: number };
    release?: { name: string | null; tag_name: string; html_url: string };
    forkee?: { full_name: string; html_url: string };
  };
};

type GhRepo = {
  name: string;
  full_name: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
  pushed_at: string;
};

type GhCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string; name: string };
  };
};

type FeedEntry = {
  id: string;
  repo: string;
  url: string;
  icon: "commit" | "create" | "pr" | "issue" | "star" | "fork" | "release";
  title: string;
  detail?: string;
  createdAt: string;
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function eventToEntry(e: GhEvent): FeedEntry | null {
  const base = { id: e.id, repo: e.repo.name, createdAt: e.created_at };
  const repoUrl = `https://github.com/${e.repo.name}`;
  switch (e.type) {
    case "PushEvent": {
      const commits = e.payload.commits ?? [];
      if (commits.length === 0) return null;
      const last = commits[commits.length - 1]!;
      return {
        ...base,
        url: `${repoUrl}/commit/${last.sha}`,
        icon: "commit",
        title: `Pushed ${commits.length} commit${commits.length === 1 ? "" : "s"}`,
        detail: last.message.split("\n")[0]!.slice(0, 80),
      };
    }
    case "CreateEvent":
      if (e.payload.ref_type === "repository") {
        return { ...base, url: repoUrl, icon: "create", title: "Created repository" };
      }
      if (e.payload.ref_type === "branch" && e.payload.ref) {
        return {
          ...base,
          url: repoUrl,
          icon: "create",
          title: `Created branch ${e.payload.ref}`,
        };
      }
      if (e.payload.ref_type === "tag" && e.payload.ref) {
        return {
          ...base,
          url: repoUrl,
          icon: "create",
          title: `Tagged ${e.payload.ref}`,
        };
      }
      return null;
    case "PullRequestEvent":
      if (e.payload.action === "opened" && e.payload.pull_request) {
        return {
          ...base,
          url: e.payload.pull_request.html_url,
          icon: "pr",
          title: `Opened PR #${e.payload.pull_request.number}`,
          detail: e.payload.pull_request.title.slice(0, 80),
        };
      }
      return null;
    case "IssuesEvent":
      if (e.payload.action === "opened" && e.payload.issue) {
        return {
          ...base,
          url: e.payload.issue.html_url,
          icon: "issue",
          title: `Opened issue #${e.payload.issue.number}`,
          detail: e.payload.issue.title.slice(0, 80),
        };
      }
      return null;
    case "WatchEvent":
      return { ...base, url: repoUrl, icon: "star", title: "Starred" };
    case "ForkEvent":
      return {
        ...base,
        url: e.payload.forkee?.html_url ?? repoUrl,
        icon: "fork",
        title: "Forked",
      };
    case "ReleaseEvent":
      if (e.payload.action === "published" && e.payload.release) {
        return {
          ...base,
          url: e.payload.release.html_url,
          icon: "release",
          title: `Released ${e.payload.release.tag_name}`,
          detail: e.payload.release.name ?? undefined,
        };
      }
      return null;
    default:
      return null;
  }
}

function EventIcon({ kind }: { kind: FeedEntry["icon"] }) {
  switch (kind) {
    case "commit":
      return <FaCodeCommit />;
    case "create":
      return <FaPlus />;
    case "pr":
      return <FaCodeBranch />;
    case "issue":
      return <FaGithub />;
    case "star":
      return <FaStar />;
    case "fork":
      return <FaCodeBranch />;
    case "release":
      return <FaStar />;
  }
}

// Build a 53-week × 7-day matrix from the day-keyed contribution list.
// Pads the leading week with nulls so the first column's day-of-week
// alignment is correct.
function buildWeeks(contribs: Contribution[]): Array<Array<Contribution | null>> {
  if (contribs.length === 0) return [];
  const first = new Date(contribs[0]!.date);
  const leadPad = first.getDay();
  const padded: Array<Contribution | null> = [
    ...Array(leadPad).fill(null),
    ...contribs,
  ];
  const weeks: Array<Array<Contribution | null>> = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

function computeStats(contribs: Contribution[]) {
  const last30 = contribs.slice(-30).reduce((sum, c) => sum + c.count, 0);
  let currentStreak = 0;
  for (let i = contribs.length - 1; i >= 0; i--) {
    if (contribs[i]!.count > 0) currentStreak++;
    else break;
  }
  let longestStreak = 0;
  let run = 0;
  for (const c of contribs) {
    if (c.count > 0) {
      run++;
      if (run > longestStreak) longestStreak = run;
    } else {
      run = 0;
    }
  }
  return { last30, currentStreak, longestStreak };
}

// Solid rgba fills work better in SVG than Tailwind class strings on <rect>.
const LEVEL_FILL: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "rgba(239, 68, 68, 0.07)",
  1: "rgba(239, 68, 68, 0.3)",
  2: "rgba(239, 68, 68, 0.55)",
  3: "rgba(239, 68, 68, 0.8)",
  4: "rgba(239, 68, 68, 1)",
};

const CELL_SIZE = 10;
const CELL_GAP = 3;
const CELL_STRIDE = CELL_SIZE + CELL_GAP;

export default function GithubActivity() {
  const [heatmap, setHeatmap] = useState<HeatmapResponse | null>(null);
  const [heatmapErr, setHeatmapErr] = useState(false);
  const [feed, setFeed] = useState<FeedEntry[] | null>(null);
  const [feedErr, setFeedErr] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(HEATMAP_API)
      .then((r) => {
        if (!r.ok) throw new Error(`heatmap ${r.status}`);
        return r.json() as Promise<HeatmapResponse>;
      })
      .then((d) => !cancelled && setHeatmap(d))
      .catch(() => !cancelled && setHeatmapErr(true));

    // Two-source feed: lifecycle events (PR/issue/star/release/fork/create)
    // from /events, plus individual commits scraped from the top N
    // recently-pushed public repos. Pushes to private repos don't appear in
    // /events for unauthenticated callers, so the per-repo fetch is what
    // makes the feed feel live for users whose work mostly lives in private.
    (async () => {
      try {
        const [eventsJson, reposJson] = await Promise.all([
          fetch(EVENTS_API)
            .then((r) => (r.ok ? (r.json() as Promise<GhEvent[]>) : []))
            .catch(() => [] as GhEvent[]),
          fetch(REPOS_API)
            .then((r) => (r.ok ? (r.json() as Promise<GhRepo[]>) : []))
            .catch(() => [] as GhRepo[]),
        ]);

        const eventEntries: FeedEntry[] = (eventsJson as GhEvent[])
          .filter((e) => e.type !== "PushEvent")
          .map(eventToEntry)
          .filter((e): e is FeedEntry => e !== null);

        const topRepos = (reposJson as GhRepo[])
          .filter((r) => !r.fork && !r.archived && !r.private)
          .slice(0, TOP_REPOS_FOR_COMMITS);

        const commitFetches = await Promise.all(
          topRepos.map((repo) =>
            fetch(
              `https://api.github.com/repos/${repo.full_name}/commits?author=${GITHUB_USERNAME}&per_page=${COMMITS_PER_REPO}`,
            )
              .then((r) => (r.ok ? (r.json() as Promise<GhCommit[]>) : []))
              .catch(() => [] as GhCommit[]),
          ),
        );

        const commitEntries: FeedEntry[] = commitFetches.flatMap(
          (commits, i) =>
            commits.map((c) => ({
              id: c.sha,
              repo: topRepos[i]!.full_name,
              url: c.html_url,
              icon: "commit" as const,
              title:
                c.commit.message.split("\n")[0]!.slice(0, 80) || "Commit",
              createdAt: c.commit.author.date,
            })),
        );

        const merged = [...eventEntries, ...commitEntries]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, FEED_MAX);

        if (cancelled) return;
        setFeed(merged);
      } catch {
        if (!cancelled) setFeedErr(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const weeks = useMemo(
    () => (heatmap ? buildWeeks(heatmap.contributions) : []),
    [heatmap],
  );

  const stats = useMemo(
    () =>
      heatmap
        ? computeStats(heatmap.contributions)
        : { last30: 0, currentStreak: 0, longestStreak: 0 },
    [heatmap],
  );

  const totalLastYear = heatmap?.total
    ? Object.values(heatmap.total).reduce((a, b) => a + b, 0)
    : 0;

  if (heatmapErr && feedErr) return null;

  const heatmapWidth = weeks.length * CELL_STRIDE - CELL_GAP;
  const heatmapHeight = 7 * CELL_STRIDE - CELL_GAP;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 items-start">
      {/* Heatmap card */}
      {!heatmapErr && (
        <div className="cursor-card relative flex flex-col rounded-sm border border-red-500/20 frost p-5 md:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-red-300">
              <FaGithub className="text-red-400/80" />
              Contributions · last 12 mo
            </div>
            {heatmap && (
              <div className="font-mono text-xs text-gray-400">
                <span className="text-white">{totalLastYear.toLocaleString()}</span>{" "}
                total
              </div>
            )}
          </div>

          {heatmap ? (
            <svg
              viewBox={`0 0 ${heatmapWidth} ${heatmapHeight}`}
              preserveAspectRatio="xMidYMid meet"
              width="100%"
              className="block"
              role="img"
              aria-label={`GitHub contribution heatmap, ${totalLastYear} total contributions in the last year`}
            >
              {weeks.map((week, wi) =>
                week.map((cell, di) => {
                  if (!cell) return null;
                  return (
                    <rect
                      key={`${wi}-${di}`}
                      x={wi * CELL_STRIDE}
                      y={di * CELL_STRIDE}
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      rx={2}
                      fill={LEVEL_FILL[cell.level]}
                    >
                      <title>{`${cell.date} · ${cell.count} contribution${cell.count === 1 ? "" : "s"}`}</title>
                    </rect>
                  );
                }),
              )}
            </svg>
          ) : (
            <div className="h-[100px] animate-pulse bg-red-500/[0.04] rounded-sm" />
          )}

          {heatmap && (
            <>
              <div className="mt-4 flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-wider text-gray-500">
                <span>less</span>
                {([0, 1, 2, 3, 4] as const).map((lvl) => (
                  <div
                    key={lvl}
                    className="w-[10px] h-[10px] rounded-[2px]"
                    style={{ backgroundColor: LEVEL_FILL[lvl] }}
                  />
                ))}
                <span>more</span>
              </div>

              <div className="mt-5 pt-5 grid grid-cols-3 gap-3 border-t border-red-500/10">
                <Stat label="Last 30 days" value={stats.last30} suffix="commits" />
                <Stat label="Current streak" value={stats.currentStreak} suffix={stats.currentStreak === 1 ? "day" : "days"} />
                <Stat label="Longest streak" value={stats.longestStreak} suffix={stats.longestStreak === 1 ? "day" : "days"} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Events feed card */}
      {!feedErr && (
        <div className="cursor-card relative flex flex-col rounded-sm border border-red-500/20 frost p-5 md:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-red-300">
              <FaCodeCommit className="text-red-400/80" />
              Recent activity
            </div>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-gray-400 hover:text-red-300 transition"
            >
              @{GITHUB_USERNAME}
            </a>
          </div>

          {feed ? (
            feed.length > 0 ? (
              <ul className="space-y-1.5">
                {feed.map((entry) => (
                  <li key={entry.id}>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-3 items-start rounded-sm p-2 -mx-2 hover:bg-red-500/[0.08] transition-colors"
                    >
                      <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-sm border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-300 text-[10px] group-hover:border-red-500/50 group-hover:bg-red-500/20 transition-colors">
                        <EventIcon kind={entry.icon} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-mono text-sm text-white group-hover:text-red-300 transition-colors truncate">
                            {entry.title}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500 flex-shrink-0">
                            {relativeTime(entry.createdAt)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {entry.repo}
                          {entry.detail && (
                            <span className="text-gray-500"> · {entry.detail}</span>
                          )}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No recent public activity.
              </div>
            )
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse bg-red-500/[0.04] rounded-sm"
                />
              ))}
            </div>
          )}

          {/* Footer CTA — anchored to the bottom so the card fills its
              column height even when the feed is short. */}
          <a
            href={`https://github.com/${GITHUB_USERNAME}?tab=overview`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto pt-5 border-t border-red-500/10 flex items-center justify-between text-red-300 hover:text-white transition group"
          >
            <span className="font-mono text-xs uppercase tracking-wider">
              Full activity on GitHub
            </span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition" />
          </a>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
        <span className="text-[11px] text-gray-400">{suffix}</span>
      </div>
    </div>
  );
}
