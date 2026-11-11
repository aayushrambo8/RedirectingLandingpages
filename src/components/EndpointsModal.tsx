'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, Terminal, Layers } from 'lucide-react';
import { SubdomainItem } from '@/types/subdomain';

interface EndpointsModalProps {
  item: SubdomainItem | null;
  onClose: () => void;
  rootDomain: string;
  onShowToast: (msg: string) => void;
}

export const EndpointsModal: React.FC<EndpointsModalProps> = ({
  item,
  onClose,
  rootDomain,
  onShowToast,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!item) return null;

  const baseUrl = item.customUrl || `https://${item.subdomain}.${rootDomain}`;
  const endpoints = item.endpoints && item.endpoints.length > 0 ? item.endpoints : ['/'];

  const handleCopy = async (ep: string, index: number) => {
    const fullUrl = `${baseUrl}${ep.startsWith('/') ? ep : '/' + ep}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedIndex(index);
      onShowToast(`Copied ${fullUrl}`);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      onShowToast(fullUrl);
    }
  };

  const handleCopyCurl = async (ep: string) => {
    const fullUrl = `${baseUrl}${ep.startsWith('/') ? ep : '/' + ep}`;
    const cmd = `curl -s "${fullUrl}"`;
    try {
      await navigator.clipboard.writeText(cmd);
      onShowToast('Copied cURL command');
    } catch {
      onShowToast(cmd);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {item.name} Endpoints
              </h3>
              <p className="text-xs text-slate-500 font-mono">{baseUrl}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {endpoints.map((ep, idx) => {
            const epUrl = `${baseUrl}${ep.startsWith('/') ? ep : '/' + ep}`;
            const isCopied = copiedIndex === idx;

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs font-mono"
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    GET
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 truncate font-semibold">
                    {ep}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopyCurl(ep)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Copy cURL command"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopy(ep, idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Copy full URL"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={epUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Open Route"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
