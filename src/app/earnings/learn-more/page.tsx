'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Header */}
      <header className="border-b border-gray/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="ORIEN" className="w-10 h-10" />
            <span className="text-xl font-bold">ORIEN</span>
          </Link>
          <Link href="/earnings">
            <Button variant="ghost">Back to Earnings</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-cyan to-white bg-clip-text text-transparent">
            Passive Earnings on Idle Capital
          </h1>
          <p className="text-xl text-gray/80 max-w-2xl mx-auto">
            Transform your USDC earnings into yield-generating assets while maintaining liquidity and control.
          </p>
        </div>

        {/* The Problem */}
        <Card className="mb-8 p-8 border-cyan/20">
          <h2 className="text-2xl font-bold mb-4 text-cyan">Why Reinvest?</h2>
          <p className="text-gray/90 leading-relaxed mb-4">
            As a provider, you earn USDC for every minute your infrastructure executes agent missions. 
            But capital sitting idle in a wallet generates zero returns.
          </p>
          <p className="text-gray/90 leading-relaxed">
            ORIEN enables you to <strong className="text-white">reinvest your earnings automatically</strong> into 
            battle-tested DeFi protocols—earning passive yield while keeping your capital liquid and accessible.
          </p>
        </Card>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          
          <div className="space-y-6">
            {/* Step 1: Yellow */}
            <Card className="p-6 border-l-4 border-cyan">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center text-cyan font-bold text-xl">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    Yellow Session Ledger
                    <span className="text-xs bg-cyan/20 text-cyan px-2 py-1 rounded">Metering</span>
                  </h3>
                  <p className="text-gray/80 mb-3">
                    Yellow tracks usage-based debits in real-time during agent execution sessions. 
                    Every tool call, every execution minute is logged with precision.
                  </p>
                  <div className="bg-navy-light/30 p-3 rounded border border-gray/10">
                    <code className="text-sm text-cyan">
                      Session #42 → Tool: browser.act → 2.3 min → $0.46 USDC
                    </code>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 2: Arc/Circle */}
            <Card className="p-6 border-l-4 border-cyan">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center text-cyan font-bold text-xl">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    Arc (Circle) Settlement
                    <span className="text-xs bg-cyan/20 text-cyan px-2 py-1 rounded">USDC</span>
                  </h3>
                  <p className="text-gray/80 mb-3">
                    At session end, Arc settles the final balance in USDC. The payout is split transparently:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-cyan/5 p-3 rounded border border-cyan/20 text-center">
                      <div className="text-2xl font-bold text-cyan">90%</div>
                      <div className="text-xs text-gray/70 mt-1">Provider</div>
                    </div>
                    <div className="bg-cyan/5 p-3 rounded border border-cyan/20 text-center">
                      <div className="text-2xl font-bold text-cyan">7%</div>
                      <div className="text-xs text-gray/70 mt-1">Platform</div>
                    </div>
                    <div className="bg-cyan/5 p-3 rounded border border-cyan/20 text-center">
                      <div className="text-2xl font-bold text-cyan">3%</div>
                      <div className="text-xs text-gray/70 mt-1">Reserve</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 3: LI.FI */}
            <Card className="p-6 border-l-4 border-cyan">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center text-cyan font-bold text-xl">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    LI.FI Reinvestment Engine
                    <span className="text-xs bg-cyan/20 text-cyan px-2 py-1 rounded">DeFi</span>
                  </h3>
                  <p className="text-gray/80 mb-3">
                    LI.FI is a cross-chain liquidity aggregator that routes your USDC into yield-generating protocols 
                    across multiple chains—automatically finding the best rates.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="bg-navy-light/30 p-4 rounded border border-gray/10">
                      <h4 className="font-semibold text-sm mb-2 text-cyan">Multi-Chain Access</h4>
                      <p className="text-sm text-gray/70">
                        Access lending protocols on Ethereum, Polygon, Arbitrum, Optimism—all through one interface.
                      </p>
                    </div>
                    
                    <div className="bg-navy-light/30 p-4 rounded border border-gray/10">
                      <h4 className="font-semibold text-sm mb-2 text-cyan">Optimal Routing</h4>
                      <p className="text-sm text-gray/70">
                        LI.FI automatically compares rates across Aave, Compound, Yearn, and other battle-tested protocols.
                      </p>
                    </div>
                    
                    <div className="bg-navy-light/30 p-4 rounded border border-gray/10">
                      <h4 className="font-semibold text-sm mb-2 text-cyan">No Lock-Ups</h4>
                      <p className="text-sm text-gray/70">
                        Your capital remains liquid. Withdraw earnings or reinvest at any time—no vesting, no penalties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Example Flow */}
        <Card className="mb-8 p-8 bg-gradient-to-br from-cyan/5 to-transparent border-cyan/30">
          <h2 className="text-2xl font-bold mb-6 text-center">Example: $1,000 Monthly Earnings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-navy-light/40 rounded">
              <span className="text-gray/80">Gross earnings (USDC)</span>
              <span className="font-mono text-xl text-white">$1,000.00</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-navy-light/40 rounded">
              <span className="text-gray/80">Your share (90%)</span>
              <span className="font-mono text-xl text-cyan">$900.00</span>
            </div>
            
            <div className="border-t border-gray/20 pt-4">
              <div className="flex items-center justify-between p-4 bg-cyan/10 rounded">
                <div>
                  <div className="font-semibold text-white">Reinvested → Aave USDC (via LI.FI)</div>
                  <div className="text-sm text-gray/70 mt-1">Estimated APY: 4.2%</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl text-cyan">$900.00</div>
                  <div className="text-sm text-cyan/70 mt-1">+$3.15/month passive</div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray/60 pt-4">
              *APY rates are variable and depend on market conditions. Past performance ≠ future results.
            </div>
          </div>
        </Card>

        {/* Security & Trust */}
        <Card className="mb-8 p-8 border-gray/20">
          <h2 className="text-2xl font-bold mb-4">Security & Trust</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-cyan text-xl">✓</div>
              <div>
                <h3 className="font-semibold mb-1">Non-Custodial</h3>
                <p className="text-sm text-gray/80">
                  You maintain full control. ORIEN never holds your funds—settlements go directly to your wallet.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-cyan text-xl">✓</div>
              <div>
                <h3 className="font-semibold mb-1">Battle-Tested Protocols</h3>
                <p className="text-sm text-gray/80">
                  LI.FI routes to audited, time-proven DeFi protocols with billions in TVL (Aave, Compound, Yearn).
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-cyan text-xl">✓</div>
              <div>
                <h3 className="font-semibold mb-1">Transparent Splits</h3>
                <p className="text-sm text-gray/80">
                  Every transaction is on-chain and auditable. No hidden fees, no surprises.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-cyan text-xl">✓</div>
              <div>
                <h3 className="font-semibold mb-1">Instant Liquidity</h3>
                <p className="text-sm text-gray/80">
                  Withdraw your capital + yield at any time. No lock-ups, no waiting periods.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link href="/earnings">
            <Button size="lg" className="px-8">
              View Your Earnings Dashboard
            </Button>
          </Link>
          <p className="text-sm text-gray/60 mt-4">
            Start earning passive yield on your USDC today
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray/20 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray/60">
          <p>ORIEN is an orchestration rail. Not financial advice. DeFi yields are variable and carry smart contract risk.</p>
        </div>
      </footer>
    </div>
  );
}
