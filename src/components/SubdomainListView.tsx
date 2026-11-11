'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Pin,
  Copy,
  Check,
  Edit2,
  Trash2,
  Layers,
} from 'lucide-react';
import { GithubIcon } from '@/components/GithubIcon';
import { SubdomainItem } from '@/types/subdomain';

interface SubdomainListViewProps {
  items: SubdomainItem[];
  rootDomain: string;
  onTogglePin: (id: string) => void;
  onEdit: (item: SubdomainItem) => void;
  onDelete: (id: string) => void;
  onViewEndpoints: (item: SubdomainItem) => void;
  onShowToast: (msg: string) => void;
}

export const SubdomainListView: React.FC<SubdomainListViewProps> = ({
  items,
  rootDomain,
  onTogglePin,
  onEdit,
  onDelete,
  onViewEndpoints,
  onShowToast,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (item: SubdomainItem) => {
    const url = item.customUrl || `https://${item.subdomain}.${rootDomain}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      onShowToast(`Copied ${url}`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      onShowToast(url);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              <th className="py-3 px-4 w-10">Pin</th>
              <th className="py-3 px-4">Subdomain & Service</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status / Latency</th>
              <th className="py-3 px-4 hidden md:table-cell">Stack</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {items.map((item) => {
              const fullUrl =
                item.customUrl || `https://${item.subdomain}.${rootDomain}`;
              const isCopied = copiedId === item.id;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Pin */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onTogglePin(item.id)}
                      className={`p-1 rounded cursor-pointer transition-colors ${
                        item.isPinned
                          ? 'text-amber-500'
                          : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                      }`}
                      title={item.isPinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  {/* Name & URL */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      <span>{item.subdomain}.{rootDomain}</span>
                      <button
                        onClick={() => handleCopy(item)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        title="Copy URL"
                      >
                        {isCopied ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                  </td>

                  {/* Status & Latency */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {item.status}
                      </span>
                      {item.pingMs && (
                        <span className="text-slate-400">({item.pingMs}ms)</span>
                      )}
                    </div>
                  </td>

                  {/* Stack */}
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.techStack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                      {item.techStack.length > 3 && (
                        <span className="text-[10px] font-mono text-slate-400">
                          +{item.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {item.endpoints && item.endpoints.length > 0 && (
                        <button
                          onClick={() => onViewEndpoints(item)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Endpoints"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="GitHub Repository"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
