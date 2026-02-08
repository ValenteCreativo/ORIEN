import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { ThreeBackground } from '@/components/ui/ThreeBackground';
import { DemoToggle } from '@/components/ui/DemoToggle';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy">
      <ThreeBackground />
      <DemoToggle />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <Image 
              src="/logo.png" 
              alt="ORIEN" 
              width={120} 
              height={120}
              className="mx-auto drop-shadow-[0_0_30px_rgba(0,245,255,0.6)]"
            />
          </div>

          <h1 className="text-7xl md:text-9xl font-bold mb-8 animate-slide-in">
            <span className="bg-gradient-to-r from-cyan via-white to-gray bg-clip-text text-transparent">
              ORIEN
            </span>
          </h1>
          
          <div className="space-y-4 mb-12 animate-fade-in">
            <p className="text-3xl md:text-4xl text-cyan font-light tracking-wide">
              Compute for Autonomous Agents
            </p>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Specialized hardware. Pre-configured software. Pay per execution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in">
            <Link href="/marketplace">
              <Button 
                variant="primary" 
                size="lg" 
                className="px-10 bg-cyan text-navy hover:bg-cyan/90 shadow-[0_0_20px_rgba(0,245,255,0.5)] hover:shadow-[0_0_30px_rgba(0,245,255,0.7)] transition-all font-bold"
              >
                Launch App →
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button 
                variant="ghost" 
                size="lg" 
                className="px-10 border-2 border-gray text-gray hover:border-cyan hover:text-cyan transition-all"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="p-6 bg-navy/80 backdrop-blur border border-cyan/30 rounded-xl hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] transition-all">
              <div className="text-5xl font-bold text-cyan mb-2">0%</div>
              <div className="text-sm text-gray">Idle Charges</div>
            </div>
            <div className="p-6 bg-navy/80 backdrop-blur border border-cyan/30 rounded-xl hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] transition-all">
              <div className="text-5xl font-bold text-cyan mb-2">90%</div>
              <div className="text-sm text-gray">Provider Share</div>
            </div>
            <div className="p-6 bg-navy/80 backdrop-blur border border-cyan/30 rounded-xl hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] transition-all">
              <div className="text-5xl font-bold text-cyan mb-2">USDC</div>
              <div className="text-sm text-gray">Settlement</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-32 px-4 border-t border-cyan/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl font-bold text-center mb-20 bg-gradient-to-r from-cyan to-white bg-clip-text text-transparent">
            The Flow
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '👤', title: 'User', desc: 'Mission requiring specialized tools' },
              { icon: '🤖', title: 'Agent', desc: 'Finds optimal compute provider' },
              { icon: '💻', title: 'Provider', desc: 'Pre-configured hardware + software' },
              { icon: '💎', title: 'DeFi', desc: 'Auto-reinvest earnings' },
            ].map((item, i) => (
              <div 
                key={i}
                className="group relative"
              >
                <div className="text-center p-8 bg-navy/70 backdrop-blur border-2 border-gray/30 rounded-2xl hover:border-cyan hover:shadow-[0_0_40px_rgba(0,245,255,0.3)] transition-all duration-500">
                  <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="text-2xl font-bold mb-3 text-cyan">{item.title}</div>
                  <p className="text-sm text-gray">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Compute */}
      <section className="relative py-32 px-4 border-t border-cyan/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan to-white bg-clip-text text-transparent">
              Specialized Compute
            </h2>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Pre-configured stacks. Zero setup. Instant execution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎨', title: 'Creative Suite', tools: ['Adobe CC', 'Final Cut Pro', 'Cinema 4D', 'Blender'], hw: 'Mac Studio M2 Ultra' },
              { icon: '🧪', title: 'Dev & CI/CD', tools: ['Docker + K8s', 'Playwright', 'Multi-OS', 'Build Pipelines'], hw: 'Dedicated Server' },
              { icon: '🤖', title: 'ML & AI', tools: ['CUDA / ROCm', 'PyTorch', 'Pre-loaded Models', 'Datasets'], hw: 'RTX 4090 / A100' },
              { icon: '🎵', title: 'Media & Audio', tools: ['Logic Pro X', 'Ableton Live', 'FFmpeg', 'Audio Plugins'], hw: 'Mac Studio / Pro Tools' },
            ].map((stack, i) => (
              <div 
                key={i}
                className="group p-8 bg-navy/50 backdrop-blur border-2 border-gray/30 rounded-2xl hover:border-cyan hover:shadow-[0_0_40px_rgba(0,245,255,0.2)] transition-all duration-500"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{stack.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-cyan">{stack.title}</h3>
                <ul className="space-y-2 mb-6">
                  {stack.tools.map((tool, j) => (
                    <li key={j} className="text-sm text-gray flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan rounded-full" />
                      {tool}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-gray/30 text-xs text-gray/70">
                  {stack.hw}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-4 border-t border-cyan/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-8 bg-gradient-to-r from-cyan to-white bg-clip-text text-transparent">
            Get Started
          </h2>
          <p className="text-xl text-gray mb-12 max-w-2xl mx-auto">
            Browse compute or become a provider
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/marketplace">
              <Button 
                variant="primary" 
                size="lg" 
                className="px-12 bg-cyan text-navy hover:bg-cyan/90 shadow-[0_0_20px_rgba(0,245,255,0.5)] hover:shadow-[0_0_30px_rgba(0,245,255,0.7)] transition-all font-bold"
              >
                Marketplace
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                variant="ghost" 
                size="lg" 
                className="px-12 border-2 border-gray text-gray hover:border-cyan hover:text-cyan transition-all"
              >
                Become Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
