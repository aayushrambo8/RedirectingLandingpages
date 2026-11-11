'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Activity, Server, ShieldCheck, Cpu } from 'lucide-react';

interface HeroProps {
  rootDomain: string;
  totalSubdomains: number;
  onlineCount: number;
  avgLatency: number;
  onOpenDomainModal: () => void;
  onShowToast: (msg: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  rootDomain,
  totalSubdomains,
  onlineCount,
  avgLatency,
  onOpenDomainModal,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyDomain = async () => {
    try {
      await navigator.clipboard.writeText(`https://${rootDomain}`);
      setCopied(true);
      onShowToast(`Copied https://${rootDomain} to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast(`Domain: ${rootDomain}`);
    }
  };

  return (
    <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Gentle ambient glow - very subtle, non-intrusive */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-sky-500/5 dark:bg-sky-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative text-center max-w-3xl mx-auto space-y-4">
        {/* Status chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>PRODUCTION GATEWAY // VERIFIED SECURE</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Subdomain Hub &{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400 bg-clip-text text-transparent">
            Project Gateway
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Centralized directory and launcher for security vulnerability search portals, media showcases, and interactive web applications hosted under{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{rootDomain}</span>.
        </p>

        {/* Domain Interactive Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={handleCopyDomain}
            type="button"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-mono transition-all shadow-sm cursor-pointer"
            title="Click to copy root URL"
          >
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">https://</span>
            <span className="font-semibold tracking-tight">{rootDomain}</span>
            <span className="ml-1 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </span>
          </button>

          <button
            onClick={onOpenDomainModal}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Configure or test custom root domain"
          >
            <span>Change Base Domain</span>
          </button>
        </div>

        {/* Gateway Telemetry Strip */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1 font-mono">
              <Server className="w-3.5 h-3.5 text-emerald-500" />
              <span>ROUTED</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
              {totalSubdomains.toString().padStart(2, '0')} Subdomains
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
              <span>STATUS</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {onlineCount === totalSubdomains ? '100% ONLINE' : `${onlineCount}/${totalSubdomains} ACTIVE`}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1 font-mono">
              <Activity className="w-3.5 h-3.5 text-sky-500" />
              <span>AVG LATENCY</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
              ~{avgLatency}ms
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1 font-mono">
              <Cpu className="w-3.5 h-3.5 text-violet-500" />
              <span>RUNTIME</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
              Next.js 15
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
