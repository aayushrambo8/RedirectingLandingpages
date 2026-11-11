'use client';

import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  FileJson,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { SubdomainItem } from '@/types/subdomain';

interface ConfigManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomains: SubdomainItem[];
  rootDomain: string;
  onImportConfig: (items: SubdomainItem[]) => void;
  onResetDefaults: () => void;
  onShowToast: (msg: string) => void;
}

export const ConfigManagerModal: React.FC<ConfigManagerModalProps> = ({
  isOpen,
  onClose,
  subdomains,
  rootDomain,
  onImportConfig,
  onResetDefaults,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const data = {
      rootDomain,
      exportedAt: new Date().toISOString(),
      subdomains,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subdomains-${rootDomain}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported JSON backup file.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const list = Array.isArray(parsed)
          ? parsed
          : parsed.subdomains || [];
        if (!Array.isArray(list) || list.length === 0) {
          throw new Error('Invalid subdomain configuration file structure.');
        }
        onImportConfig(list);
        onShowToast(`Successfully imported ${list.length} subdomains!`);
        onClose();
      } catch (err: any) {
        setError(err.message || 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handlePasteImport = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput.trim());
      const list = Array.isArray(parsed) ? parsed : parsed.subdomains || [];
      if (!Array.isArray(list) || list.length === 0) {
        throw new Error('Invalid JSON format.');
      }
      onImportConfig(list);
      onShowToast(`Successfully imported ${list.length} subdomains!`);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Configuration & Data
              </h3>
              <p className="text-xs text-slate-500">Backup, restore, or reset directory data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export */}
          <button
            onClick={handleExportJSON}
            className="flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
          >
            <Download className="w-4 h-4 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-xs text-slate-900 dark:text-white">
              Export Backup
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Download JSON file ({subdomains.length} entries)
            </div>
          </button>

          {/* Import File */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
          >
            <Upload className="w-4 h-4 text-sky-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-xs text-slate-900 dark:text-white">
              Import File
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Load subdomains from JSON
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </button>
        </div>

        {/* Paste JSON */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Or Paste JSON Configuration:
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setError('');
            }}
            placeholder='[ { "name": "...", "subdomain": "..." } ]'
            rows={3}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
          {jsonInput.trim() && (
            <button
              onClick={handlePasteImport}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
            >
              Parse & Import JSON
            </button>
          )}
        </div>

        {/* Reset to Factory Defaults */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Reset subdomains to default verified configuration?')) {
                onResetDefaults();
                onShowToast('Reset to original default configuration.');
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Factory Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
