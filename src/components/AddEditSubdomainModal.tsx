'use client';

import React, { useState, useEffect } from 'react';
import { X, Globe } from 'lucide-react';
import { SubdomainItem, SubdomainStatus } from '@/types/subdomain';

interface AddEditSubdomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: SubdomainItem) => void;
  editingItem: SubdomainItem | null;
  rootDomain: string;
}

export const AddEditSubdomainModal: React.FC<AddEditSubdomainModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  rootDomain,
}) => {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [category, setCategory] = useState('Security');
  const [status, setStatus] = useState<SubdomainStatus>('online');
  const [pingMs, setPingMs] = useState(14);
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [endpointsInput, setEndpointsInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setSubdomain(editingItem.subdomain);
      setCategory(editingItem.category);
      setStatus(editingItem.status);
      setPingMs(editingItem.pingMs || 14);
      setDescription(editingItem.description);
      setGithubUrl(editingItem.githubUrl || '');
      setTechStackInput(editingItem.techStack.join(', '));
      setEndpointsInput((editingItem.endpoints || []).join(', '));
    } else {
      setName('');
      setSubdomain('');
      setCategory('Security');
      setStatus('online');
      setPingMs(15);
      setDescription('');
      setGithubUrl('');
      setTechStackInput('');
      setEndpointsInput('');
    }
    setError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subdomain.trim() || !description.trim()) {
      setError('Please fill in the required fields (Name, Subdomain, Description).');
      return;
    }

    const cleanSubdomain = subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

    const tags = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const endpoints = endpointsInput
      .split(',')
      .map((ep) => {
        let clean = ep.trim();
        if (clean && !clean.startsWith('/')) clean = '/' + clean;
        return clean;
      })
      .filter(Boolean);

    const savedItem: SubdomainItem = {
      id: editingItem ? editingItem.id : `sub-${cleanSubdomain}-${Date.now().toString(36)}`,
      name: name.trim(),
      subdomain: cleanSubdomain,
      category: category.trim(),
      status,
      pingMs: Number(pingMs) || 14,
      description: description.trim(),
      githubUrl: githubUrl.trim() || undefined,
      techStack: tags.length ? tags : ['Web'],
      endpoints: endpoints.length ? endpoints : ['/'],
      isPinned: editingItem ? editingItem.isPinned : false,
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Subdomain' : 'Add New Subdomain'}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              target: {subdomain || 'sub'}.{rootDomain}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Subdomain & URL Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subdomain Prefix *
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/40">
              <span className="pl-3 text-xs font-mono text-slate-400 select-none">https://</span>
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="e.g. exploitdb"
                className="flex-1 px-1.5 py-2 text-xs font-mono bg-transparent text-slate-900 dark:text-white focus:outline-none"
                required
              />
              <span className="pr-3 text-xs font-mono text-emerald-600 dark:text-emerald-400 select-none">
                .{rootDomain}
              </span>
            </div>
          </div>

          {/* Service Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Service / Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ExploitDB Search Directory"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              required
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="Security">Security</option>
                <option value="Showcase">Showcase</option>
                <option value="Games">Games</option>
                <option value="Tools">Tools</option>
                <option value="API">API</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SubdomainStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="online">Online</option>
                <option value="degraded">Degraded</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the service and capabilities..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              required
            />
          </div>

          {/* GitHub Repository URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              GitHub URL (Optional)
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/aayushrambo8/..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* Tech Stack Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tech Stack Tags (Comma separated)
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="e.g. Python, REST API, CVE Search"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* Endpoints */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Endpoints / Routes (Comma separated)
            </label>
            <input
              type="text"
              value={endpointsInput}
              onChange={(e) => setEndpointsInput(e.target.value)}
              placeholder="e.g. /search, /cve/lookup, /api/v1"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm"
            >
              {editingItem ? 'Save Changes' : 'Add Subdomain'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
