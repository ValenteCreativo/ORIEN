import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { DemoProvider } from '@/components/ui/DemoToggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'ORIEN - Compute Marketplace for Agents',
  description: 'Specialized compute infrastructure for autonomous agents. Pay per execution.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-navy text-white`}>
        <DemoProvider>
          {children}
        </DemoProvider>
      </body>
    </html>
  );
}
