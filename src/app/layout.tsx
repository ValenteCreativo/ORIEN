import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DemoProvider } from '@/components/ui/DemoToggle';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ORIEN - Compute Marketplace for Agents',
  description: 'Specialized compute infrastructure for autonomous agents. Pay per execution, not per month.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'ORIEN - Compute Marketplace for Agents',
    description: 'Specialized compute infrastructure for autonomous agents',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-navy text-white`}>
        <DemoProvider>
          {children}
        </DemoProvider>
      </body>
    </html>
  );
}
