'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/sessions', label: 'Sessions' },
  { href: '/earnings', label: 'Earnings' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A1128]/80 border-b border-[#00F5FF]/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="ORIEN" width={32} height={32} className="opacity-90" />
          <span className="text-lg font-semibold tracking-wider text-white">ORIEN</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map(link => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-[#00F5FF]'
                  : 'text-[#A2AAAD] hover:text-[#00F5FF]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <Link href="/register">
          <button className="px-5 py-2 text-sm font-medium bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/20 hover:border-[#00F5FF]/50 transition-all">
            Become Provider
          </button>
        </Link>
      </div>
    </nav>
  );
}
