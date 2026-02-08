'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageWrapper } from '@/components/layout';
import { useDemo } from '@/components/ui';

type Step = 'review' | 'sign' | 'submitting' | 'confirmed';

const STRATEGY_LABELS: Record<string, { name: string; protocol: string; risk: string }> = {
  'aave-usdc': { name: 'Aave USDC Lending', protocol: 'Aave V3', risk: 'low' },
  'compound-usdc': { name: 'Compound Supply', protocol: 'Compound V3', risk: 'low' },
  'yearn-usdc': { name: 'Yearn USDC Vault', protocol: 'Yearn Finance', risk: 'medium' },
  'stargate-usdc': { name: 'Stargate LP', protocol: 'Stargate', risk: 'medium' },
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function DeployInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { demoMode } = useDemo();

  const strategyId = searchParams.get('strategy') || '';
  const amountParam = searchParams.get('amount');

  const strategy = STRATEGY_LABELS[strategyId] ?? {
    name: strategyId ? strategyId : 'Unknown strategy',
    protocol: '—',
    risk: '—',
  };

  const amountCents = useMemo(() => {
    const parsed = amountParam ? parseInt(amountParam, 10) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    return 2500;
  }, [amountParam]);

  const [step, setStep] = useState<Step>('review');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prettyAmount = `$${(amountCents / 100).toFixed(2)} USDC`;

  const startFlow = async () => {
    setError(null);
    setStep('sign');
    await sleep(900);
    setStep('submitting');
    await sleep(1100);

    try {
      const res = await fetch('/api/payments/reinvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyId,
          amount: String(amountCents),
          providerAddress: demoMode ? '0xDEMO_PROVIDER' : '0xPROVIDER',
        }),
      });

      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'Failed to deploy strategy');

      setTxHash(data.data?.txHash || null);
      setStep('confirmed');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setStep('review');
    }
  };

  useEffect(() => {
    if (!strategyId) router.replace('/earnings');
  }, [router, strategyId]);

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/earnings" className="text-sm text-[#A2AAAD] hover:text-[#00F5FF] transition-colors inline-block mb-4">
            ← Back to Earnings
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Deploy Strategy</h1>
          <p className="text-[#A2AAAD]">
            Simulated wallet signing + transaction flow (MVP demo)
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-2xl border border-[#00F5FF]/15 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center justify-between">
            <div>
              <div className="text-xs text-[#A2AAAD]/60 uppercase tracking-wider">Selected</div>
              <div className="text-lg font-semibold text-white">{strategy.name}</div>
              <div className="text-xs text-[#A2AAAD]">{strategy.protocol} • {strategy.risk} risk</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#A2AAAD]/60 uppercase tracking-wider">Amount</div>
              <div className="text-xl font-bold text-[#00F5FF]">{prettyAmount}</div>
            </div>
          </div>

          <div className="p-6">
            {/* Stepper */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { key: 'review', label: 'Review' },
                { key: 'sign', label: 'Sign' },
                { key: 'submitting', label: 'Submit' },
                { key: 'confirmed', label: 'Confirmed' },
              ].map((s) => {
                const active = step === (s.key as Step);
                const done = ['confirmed'].includes(step) && s.key !== 'review' ? true : false;
                return (
                  <div
                    key={s.key}
                    className={`px-3 py-2 rounded-xl border text-center text-xs transition-all ${
                      active
                        ? 'border-[#00F5FF]/60 bg-[#00F5FF]/10 text-[#00F5FF]'
                        : 'border-[#A2AAAD]/10 bg-[#0A1128]/40 text-[#A2AAAD]'
                    }`}
                  >
                    <div className="font-medium">{s.label}</div>
                    {done && s.key !== 'review' && <div className="text-[10px] text-green-400">✓</div>}
                  </div>
                );
              })}
            </div>

            {/* Body */}
            {step === 'review' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[#A2AAAD]/10 bg-[#0A1128]/40">
                  <div className="text-sm text-white font-medium mb-1">What happens next</div>
                  <ul className="text-sm text-[#A2AAAD] space-y-1">
                    <li>• You approve a strategy deployment (wallet signature)</li>
                    <li>• ORIEN routes the action via LI.FI rails (simulated)</li>
                    <li>• Settlement remains in USDC; yield routing is optional</li>
                  </ul>
                </div>

                {error && (
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10">
                    <div className="text-red-400 text-sm">⚠️ {error}</div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={startFlow}
                    className="flex-1 px-6 py-3 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.35)] transition-all"
                  >
                    Sign & Deploy (Demo)
                  </button>
                  <Link
                    href="/earnings/learn-more"
                    className="px-6 py-3 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all"
                  >
                    How it works
                  </Link>
                </div>

                <div className="text-xs text-[#A2AAAD]/60">
                  Not financial advice. DeFi yields are variable and carry smart contract risk.
                </div>
              </div>
            )}

            {(step === 'sign' || step === 'submitting') && (
              <div className="py-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white mb-2">
                    {step === 'sign' ? 'Waiting for wallet signature…' : 'Submitting transaction…'}
                  </div>
                  <div className="text-sm text-[#A2AAAD] max-w-lg mx-auto">
                    {step === 'sign'
                      ? 'Simulating a wallet prompt. In production this is a real on-chain signature.'
                      : 'Routing the reinvest action and generating a settlement receipt (simulated).'}
                  </div>
                </div>
              </div>
            )}

            {step === 'confirmed' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/10">
                  <div className="text-green-400 font-semibold">✓ Strategy deployed</div>
                  <div className="text-sm text-[#A2AAAD] mt-1">
                    Your reinvest action was queued successfully (MVP simulation).
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#A2AAAD]/10 bg-[#0A1128]/40">
                  <div className="text-xs text-[#A2AAAD]/60 uppercase tracking-wider mb-2">Transaction</div>
                  <div className="text-sm text-white font-mono break-all">{txHash ?? '—'}</div>
                  <div className="text-xs text-[#A2AAAD]/60 mt-2">
                    In demo this hash is mocked by the API. In production this links to a block explorer.
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/earnings"
                    className="flex-1 px-6 py-3 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full text-center hover:shadow-[0_0_20px_rgba(0,245,255,0.35)] transition-all"
                  >
                    Back to Earnings
                  </Link>
                  <Link
                    href="/network"
                    className="px-6 py-3 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all"
                  >
                    View Network
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function LoadingState() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-2xl border border-[#A2AAAD]/10 p-10">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default function EarningsDeployPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DeployInner />
    </Suspense>
  );
}
