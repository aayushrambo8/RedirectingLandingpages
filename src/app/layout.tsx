import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aayush Babu — Subdomain Hub & Project Gateway',
  description:
    'Verified subdomain launchpad and service directory for exploitdb, portfolio, and games under aayushbabu.live.',
  authors: [{ name: 'Aayush Babu', url: 'https://aayushbabu.live' }],
  keywords: [
    'aayushbabu.live',
    'subdomain hub',
    'exploitdb',
    'media portfolio',
    'tictactoe',
    'developer tools',
    'CVE search',
  ],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'Aayush Babu — Subdomain Hub & Project Gateway',
    description:
      'Verified service directory for security engines, media showcases, and web applications on aayushbabu.live.',
    url: 'https://aayushbabu.live',
    siteName: 'Aayush Babu Hub',
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#080c14',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#080c14] text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
