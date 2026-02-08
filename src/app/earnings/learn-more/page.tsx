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

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-5 bg-gradient-to-r from-white via-cyan to-white bg-clip-text text-transparent">
            How Payments & Yield Work
          </h1>
          <p className="text-xl text-gray/80 max-w-3xl mx-auto">
            The value isn’t “fees”. The value is the rail: <span className="text-white">any-token payments → USDC settlement</span>,
            plus <span className="text-white">offchain micropayments</span> during execution, and optional <span className="text-white">auto-reinvest</span>.
          </p>
        </div>

        {/* TL;DR */}
        <Card className="mb-8 p-6 border-cyan/25">
          <h2 className="text-lg font-bold text-cyan mb-3">TL;DR</h2>
          <ul className="space-y-2 text-gray/85">
            <li>
              <span className="text-white font-semibold">Agents can pay with whatever they hold</span> (LI.FI swaps/bridges).
            </li>
            <li>
              <span className="text-white font-semibold">Providers always receive USDC</span> (Arc/Circle settlement rails).
            </li>
            <li>
              <span className="text-white font-semibold">Yellow batches execution micropayments offchain</span> → one settlement at the end.
            </li>
            <li>
              Providers can <span className="text-white font-semibold">reinvest USDC earnings</span> through LI.FI routes.
            </li>
          </ul>
        </Card>

        {/* Flow */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-center">The Rail (End-to-End)</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <Card className="p-6 border-l-4 border-cyan">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center text-cyan font-bold text-xl">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    Yellow: Offchain Session Metering
                    <span className="text-xs bg-cyan/20 text-cyan px-2 py-1 rounded">micropayments</span>
                  </h3>
                  <p className="text-gray/80 mb-3">
                    During a session, an agent may trigger dozens of tool calls (browser ops, renders, code builds, etc.).
                    Instead of signing a blockchain transaction for every tiny charge, Yellow keeps a <span className="text-white">session ledger</span> offchain:
                    <span className="text-white"> many debits → one final settlement</span>.
                  </p>
                  <div className="bg-navy-light/30 p-3 rounded border border-gray/10">
                    <code className="text-sm text-cyan">
                      Session #42 → tool.execute(“render”) → +38s effective → debit queued
                    </code>
                  </div>
                  <p className="text-sm text-gray/70 mt-3">
                    Value: fast UX, predictable budgets, and clean receipts—without onchain spam.
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 border-l-4 border-cyan">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center text-cyan font-bold text-xl">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    Arc (Circle): USDC Settlement
                    <span className="text-xs bg-cyan/20 text-cyan px-2 py-1 rounded">payout rails</span>
                  </h3>
                  <p className="text-gray/80 mb-3">
                    At session end, Arc settles the net result in <span className="text-white">USDC</span>. Providers receive USDC regardless of how the agent paid.
                    This gives providers a stable unit of account and clean bookkeeping.
                  </p>
                  <div className="bg-navy-light/30 p-3 rounded border border-gray/10">
                    <code className="text-sm text-cyan">
                      closeSession(sessionId) → settle in USDC → provider payout
                    </code>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 border-l-4 border-cyan">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center text-cyan font-bold text-xl">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    LI.FI: Any Token In → USDC Out (and Reinvest)
                    <span className="text-xs bg-cyan/20 text-cyan px-2 py-1 rounded">swap/bridge</span>
                  </h3>
                  <p className="text-gray/80 mb-4">
                    Agents don’t want to think about chains, bridges, or what token you accept.
                    With LI.FI, the agent can pay using what they already have; LI.FI handles swap/bridge so the settlement lands as <span className="text-white">USDC</span>.
                  </p>

                  <div className="grid gap-3">
                    <div className="bg-navy-light/30 p-4 rounded border border-gray/10">
                      <h4 className="font-semibold text-sm mb-1 text-cyan">For Agents</h4>
                      <p className="text-sm text-gray/70">
                        Pay with ETH, USDT, DAI, or other supported assets → LI.FI routes the best path → ORIEN settles in USDC.
                      </p>
                    </div>
                    <div className="bg-navy-light/30 p-4 rounded border border-gray/10">
                      <h4 className="font-semibold text-sm mb-1 text-cyan">For Providers</h4>
                      <p className="text-sm text-gray/70">
                        Optional: reinvest USDC earnings into DeFi routes (lending/vault strategies) while keeping liquidity.
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray/60 mt-3">
                    Note: DeFi yield is variable and carries smart contract + market risk.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Mini FAQ */}
        <Card className="p-6 border-gray/20">
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>

          <div className="space-y-4 text-gray/85">
            <div>
              <div className="font-semibold text-white">Where do the “many debits → one settlement” receipts come from?</div>
              <div className="text-sm text-gray/75 mt-1">
                Yellow maintains the session ledger offchain during execution and produces a final settlement summary at close.
              </div>
            </div>

            <div>
              <div className="font-semibold text-white">Do providers have to accept every token?</div>
              <div className="text-sm text-gray/75 mt-1">
                No. Providers receive USDC; LI.FI is the layer that normalizes agent payments into USDC.
              </div>
            </div>

            <div>
              <div className="font-semibold text-white">What about payout splits (provider/platform/reserve)?</div>
              <div className="text-sm text-gray/75 mt-1">
                Splits are applied at settlement time. The core concept remains: effective usage is metered, and settlement is done once per session.
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center mt-10">
          <Link href="/earnings">
            <Button size="lg" className="px-8">
              Back to Earnings
            </Button>
          </Link>
          <p className="text-xs text-gray/60 mt-4">
            ORIEN is an orchestration rail — not financial advice.
          </p>
        </div>
      </section>
    </div>
  );
}
