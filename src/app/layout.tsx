import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORIEN - The Compute Marketplace for Agents",
  description: "Orchestration Rail for Infrastructure & Execution Networks. Rent specialized compute infrastructure for autonomous agent missions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <a href="/" className="text-xl font-bold text-white">
                  ORIEN
                </a>
                <div className="flex gap-6">
                  <a href="/marketplace" className="text-zinc-400 hover:text-white transition-colors">
                    Marketplace
                  </a>
                  <a href="/sessions" className="text-zinc-400 hover:text-white transition-colors">
                    Sessions
                  </a>
                  <a href="/earnings" className="text-zinc-400 hover:text-white transition-colors">
                    Earnings
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500">MVP v0.1.0</span>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
