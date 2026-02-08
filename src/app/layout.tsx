import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DemoProvider } from '@/components/ui/DemoToggle';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ORIEN - Compute Marketplace for Agents',
  description: 'Specialized compute infrastructure for autonomous agents. Pay per execution, not per month. USDC settlements.',
  keywords: ['compute', 'marketplace', 'agents', 'AI', 'infrastructure', 'USDC', 'blockchain'],
  authors: [{ name: 'ORIEN' }],
  creator: 'ORIEN',
  publisher: 'ORIEN',
  metadataBase: new URL('https://orien.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ORIEN - Compute Marketplace for Agents',
    description: 'Specialized compute infrastructure for autonomous agents. Pay per execution.',
    url: 'https://orien.vercel.app',
    siteName: 'ORIEN',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'ORIEN Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORIEN - Compute Marketplace for Agents',
    description: 'Specialized compute infrastructure for autonomous agents',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased bg-navy text-white`}>
        <DemoProvider>
          {children}
        </DemoProvider>
      </body>
    </html>
  );
}
