'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Pin,
  MoreVertical,
  Check,
  Copy,
  Layers,
  Edit2,
  Trash2,
  Activity,
} from 'lucide-react';
import { GithubIcon } from '@/components/GithubIcon';
import { SubdomainItem } from '@/types/subdomain';

interface SubdomainCardProps {
  item: SubdomainItem;
  rootDomain: string;
  onTogglePin: (id: string) => void;
  onEdit: (item: SubdomainItem) => void;
  onDelete: (id: string) => void;
  onViewEndpoints: (item: SubdomainItem) => void;
  onShowToast: (msg: string) => void;
}

export const SubdomainCard: React.FC<SubdomainCardProps> = ({
  item,
  rootDomain,
  onTogglePin,
  onEdit,
  onDelete,
  onViewEndpoints,
  onShowToast,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = item.customUrl || `https://${item.subdomain}.${rootDomain}`;
  const displayUrl = `${item.subdomain}.${rootDomain}`;

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      onShowToast(`Copied ${fullUrl}`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast(fullUrl);
    }
  };

  // Category color theme generator (muted, modern, elegant)
  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case 'security':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'showcase':
        return 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20';
      case 'games':
        return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700/90 hover:shadow-lg dark:hover:shadow-emerald-950/20 backdrop-blur-sm transition-all duration-200 overflow-hidden p-5 sm:p-6">
      {/* Top Section */}
      <div>
        {/* Header Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border ${getCategoryStyles(
                item.category
              )}`}
            >
              {item.category.toUpperCase()}
            </span>

            {/* Status & Latency */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  item.status === 'online'
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500'
                }`}
              />
              <span>{item.pingMs ? `${item.pingMs}ms` : 'active'}</span>
            </span>
          </div>

          {/* Quick Actions (Pin & More Menu) */}
          <div className="relative flex items-center gap-1">
            <button
              onClick={() => onTogglePin(item.id)}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                item.isPinned
                  ? 'text-amber-500 bg-amber-500/10'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={item.isPinned ? 'Unpin subdomain' : 'Pin subdomain'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="More options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 z-40 w-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl py-1 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95">
                  <button
                    onClick={(e) => {
                      handleCopyUrl(e);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy URL</span>
                  </button>

                  {item.endpoints && item.endpoints.length > 0 && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onViewEndpoints(item);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Endpoints ({item.endpoints.length})</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(item);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Details</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(item.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-left transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title & Domain URL */}
        <div className="space-y-1 mb-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {item.name}
          </h2>

          <div className="flex items-center gap-2">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>{displayUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handleCopyUrl}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Copy URL"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* GitHub link or endpoints */}
        <div className="flex items-center gap-1.5">
          {item.githubUrl ? (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              title="View GitHub Repository"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Repo</span>
            </a>
          ) : null}

          {item.endpoints && item.endpoints.length > 0 && (
            <button
              onClick={() => onViewEndpoints(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors cursor-pointer"
              title="View Endpoints"
            >
              <Layers className="w-3 h-3 text-slate-400" />
              <span className="font-mono text-[11px]">
                {item.endpoints.length} routes
              </span>
            </button>
          )}
        </div>

        {/* Primary Launch Action */}
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs hover:shadow transition-all group-hover:scale-[1.01]"
        >
          <span>Launch</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
};
