"use client";

import { useEffect, useState } from "react";
import { FaGithub, FaStar, FaCodeBranch } from "react-icons/fa";
import projects from "@/data/projects.json";
import type { Project } from "@/class/project";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
};

const GITHUB_USERNAME = "jhgit0219";
const REPO_COUNT = 6;

// URLs of repos already shown in the featured Projects + Lab sections, so
// the "More on GitHub" list doesn't duplicate them.
const featuredUrls = new Set(
  (projects as Project[])
    .map((p) => p.links?.github)
    .filter((u): u is string => Boolean(u))
    .map((u) => u.replace(/\/$/, "")),
);

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function GithubRepos() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=20`,
    )
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API ${r.status}`);
        return r.json() as Promise<Repo[]>;
      })
      .then((data) => {
        if (cancelled) return;
        const filtered = data
          .filter(
            (r) =>
              !r.fork &&
              !r.archived &&
              !r.private &&
              !featuredUrls.has(r.html_url.replace(/\/$/, "")),
          )
          .slice(0, REPO_COUNT);
        setRepos(filtered);
      })
      .catch(() => {
        if (cancelled) return;
        setErrored(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Silent fail — don't show anything if GitHub's rate-limited the visitor
  // or the network blip'd. Better than a broken section.
  if (errored || !repos || repos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {repos.map((repo) => (
        <a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-glow
          className="cursor-card group relative h-full flex flex-col rounded-sm border border-red-500/20 frost p-5 md:p-6 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
        >
          <div className="flex items-center gap-2 mb-3">
            <FaGithub className="text-red-400/80 text-sm" />
            <span className="font-mono text-sm text-white font-semibold group-hover:text-red-300 transition-colors truncate">
              {repo.name}
            </span>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed mb-5 min-h-[3rem]">
            {repo.description || (
              <span className="text-gray-600 italic">No description</span>
            )}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-red-500/10 font-mono text-[11px] uppercase tracking-wider text-gray-400">
            <div className="flex items-center gap-3">
              {repo.language && (
                <span className="text-red-200/80">{repo.language}</span>
              )}
              {repo.stargazers_count > 0 && (
                <span className="inline-flex items-center gap-1">
                  <FaStar className="text-[9px]" />
                  {repo.stargazers_count}
                </span>
              )}
              {repo.forks_count > 0 && (
                <span className="inline-flex items-center gap-1">
                  <FaCodeBranch className="text-[9px]" />
                  {repo.forks_count}
                </span>
              )}
            </div>
            <span className="text-gray-500">{relativeTime(repo.pushed_at)}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
