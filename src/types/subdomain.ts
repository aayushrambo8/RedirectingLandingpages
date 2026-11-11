export type SubdomainCategory = 'Security' | 'Showcase' | 'Games' | 'Tools' | 'API' | 'Other' | string;

export type SubdomainStatus = 'online' | 'degraded' | 'maintenance' | 'offline';

export interface SubdomainItem {
  id: string;
  name: string;
  subdomain: string; // prefix e.g. "exploitdb"
  category: SubdomainCategory;
  status: SubdomainStatus;
  description: string;
  githubUrl?: string;
  techStack: string[];
  icon?: string;
  pingMs?: number;
  isPinned?: boolean;
  colorAccent?: string;
  endpoints?: string[];
  customUrl?: string; // in case user overrides
  createdAt?: string;
}

export type ViewMode = 'grid' | 'list';

export type SortOption = 'default' | 'name-asc' | 'name-desc' | 'ping-asc' | 'category';
