import { SubdomainItem } from '@/types/subdomain';

export const DEFAULT_ROOT_DOMAIN = 'aayushbabu.live';

export const DEFAULT_SUBDOMAINS: SubdomainItem[] = [
  {
    id: 'sub-exploitdb',
    name: 'ExploitDB Search Directory',
    subdomain: 'exploitdb',
    category: 'Security',
    status: 'online',
    description:
      'High-performance search portal and vulnerability inspector for browsing CVEs, security exploits, and proof-of-concept security code.',
    githubUrl: 'https://github.com/aayushrambo8/ExploitDB-Website',
    techStack: ['Security', 'ExploitDB', 'CVE Search', 'Python', 'REST API'],
    icon: 'shield',
    pingMs: 14,
    isPinned: true,
    colorAccent: '#10b981',
    endpoints: ['/search', '/cve/lookup', '/exploits/raw', '/api/v1/search'],
  },
  {
    id: 'sub-portfolio',
    name: 'Media Portfolio Showcase',
    subdomain: 'portfolio',
    category: 'Showcase',
    status: 'online',
    description:
      'Interactive digital media showcase featuring creative visual design assets, artwork galleries, UI components, and video productions.',
    githubUrl: 'https://github.com/aayushrambo8/Media-Portfolio',
    techStack: ['JavaScript', 'CSS3', 'HTML5', 'UI/UX Design', 'Media Engine'],
    icon: 'sparkles',
    pingMs: 18,
    isPinned: true,
    colorAccent: '#8b5cf6',
    endpoints: ['/gallery', '/projects', '/video-showcase', '/about'],
  },
  {
    id: 'sub-tictactoe',
    name: 'TicTacToe Web Game',
    subdomain: 'tictactoe',
    category: 'Games',
    status: 'online',
    description:
      'Sleek interactive Tic-Tac-Toe web game featuring single player AI, canvas animations, and local multiplayer modes.',
    githubUrl: 'https://github.com/aayushrambo8/TicTacToe',
    techStack: ['JavaScript', 'HTML5 Canvas', 'CSS Animations', 'Game Logic'],
    icon: 'gamepad',
    pingMs: 12,
    isPinned: true,
    colorAccent: '#06b6d4',
    endpoints: ['/play', '/singleplayer', '/multiplayer', '/stats'],
  },
];
