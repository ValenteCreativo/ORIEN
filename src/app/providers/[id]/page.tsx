'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { useDemo } from '@/components/ui';
import { DEMO_PROVIDERS, CATEGORY_INFO, type DemoProvider } from '@/lib/demo-data';

type SimulationStep = 'idle' | 'wallet-prompt' | 'connecting' | 'session-created' | 'executing' | 'completed' | 'settling' | 'settled';

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;
  const { demoMode } = useDemo();

  const [provider, setProvider] = useState<DemoProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulationStep, setSimulationStep] = useState<SimulationStep>('idle');
  const [budget, setBudget] = useState(1000); // $10 default
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [showApiPanel, setShowApiPanel] = useState(true);

  useEffect(() => {
    if (demoMode) {
      const found = DEMO_PROVIDERS.find(p => p.id === providerId);
      if (found) {
        setProvider(found);
        setSelectedTool(found.tools[0]?.id || null);
      }
      setLoading(false);
    } else {
      // In production, fetch from API
      fetch(`/api/providers/${providerId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setProvider(data.data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [providerId, demoMode]);

  const [showWalletModal, setShowWalletModal] = useState(false);

  const runSimulation = async () => {
    if (!provider || !selectedTool) return;

    // Step 0: Wallet prompt
    setSimulationStep('wallet-prompt');
    setShowWalletModal(true);
  };

  const confirmWalletTx = async () => {
    setShowWalletModal(false);
    
    // Step 1: Connecting
    setSimulationStep('connecting');
    await sleep(1000);

    // Step 2: Session Created
    setSimulationStep('session-created');
    await sleep(1500);

    // Step 3: Executing (with timer)
    setSimulationStep('executing');
    const execDuration = 5000; // 5 seconds for demo
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setExecutionTime(Math.min(elapsed, execDuration));
      if (elapsed >= execDuration) {
        clearInterval(interval);
      }
    }, 100);

    await sleep(execDuration);
    clearInterval(interval);

    // Step 4: Completed
    setSimulationStep('completed');
    await sleep(1000);

    // Step 5: Settling
    setSimulationStep('settling');
    await sleep(2000);

    // Step 6: Settled
    setSimulationStep('settled');
  };

  const resetSimulation = () => {
    setSimulationStep('idle');
    setExecutionTime(0);
    setShowWalletModal(false);
  };

  const cancelWallet = () => {
    setSimulationStep('idle');
    setShowWalletModal(false);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getApiPayload = () => {
    if (!provider) return '';
    
    const sessionId = 'ses_' + Math.random().toString(36).slice(2, 10);
    const execId = 'exec_' + Math.random().toString(36).slice(2, 10);
    const cost = Math.round((executionTime / 60000) * provider.pricePerMinute);

    switch (simulationStep) {
      case 'connecting':
        return JSON.stringify({
          endpoint: 'POST /api/sessions',
          request: {
            agentId: 'agent_demo_001',
            providerId: provider.id,
            budgetAllowance: budget,
          },
          status: 'pending...'
        }, null, 2);

      case 'session-created':
        return JSON.stringify({
          endpoint: 'POST /api/sessions',
          response: {
            success: true,
            data: {
              id: sessionId,
              status: 'active',
              budgetAllowance: budget,
              consumed: 0,
              effectiveTimeMs: 0,
            }
          }
        }, null, 2);

      case 'executing':
        return JSON.stringify({
          endpoint: `POST /api/sessions/${sessionId}/execute`,
          request: {
            toolId: selectedTool,
            args: { quality: 'high', output: 'result.png' }
          },
          status: 'running...',
          effectiveTimeMs: executionTime,
          estimatedCost: `$${(cost / 100).toFixed(4)}`
        }, null, 2);

      case 'completed':
        return JSON.stringify({
          endpoint: `POST /api/sessions/${sessionId}/execute`,
          response: {
            success: true,
            data: {
              id: execId,
              status: 'completed',
              durationMs: executionTime,
              cost: cost,
              result: 'Task completed successfully'
            }
          }
        }, null, 2);

      case 'settling':
        return JSON.stringify({
          endpoint: 'POST /api/payments',
          request: {
            sessionId: sessionId,
          },
          note: 'Yellow batches micropayments → single on-chain tx',
          status: 'settling...'
        }, null, 2);

      case 'settled':
        const providerPayout = Math.round(cost * 0.9);
        return JSON.stringify({
          endpoint: 'POST /api/payments',
          response: {
            success: true,
            data: {
              totalAmount: cost,
              providerPayout: providerPayout,
              platformFee: Math.round(cost * 0.07),
              reserveAmount: Math.round(cost * 0.03),
              txHash: '0x' + Math.random().toString(16).slice(2, 18),
              settledAt: new Date().toISOString()
            }
          },
          note: 'Settled in USDC via Circle → Provider wallet'
        }, null, 2);

      default:
        return JSON.stringify({
          info: 'Click "Start Demo Session" to see API flow',
          endpoints: [
            'POST /api/sessions - Create session',
            'POST /api/sessions/{id}/execute - Run tool',
            'POST /api/payments - Settle payment'
          ]
        }, null, 2);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!provider) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <div className="text-4xl opacity-40 mb-4">🔍</div>
            <h2 className="text-xl font-bold text-white mb-2">Provider not found</h2>
            <p className="text-[#A2AAAD] mb-6">This provider doesn&apos;t exist or is unavailable</p>
            <Link href="/marketplace">
              <button className="px-6 py-2 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all">
                ← Back to Marketplace
              </button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const categoryInfo = CATEGORY_INFO[provider.category];
  const isAvailable = provider.status === 'online';
  const cost = Math.round((executionTime / 60000) * provider.pricePerMinute);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/marketplace" className="text-sm text-[#A2AAAD] hover:text-[#00F5FF] transition-colors mb-4 inline-block">
            ← Back to Marketplace
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{categoryInfo.icon}</span>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{provider.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  isAvailable
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}>
                  {isAvailable ? '● Online' : '◐ Busy'}
                </span>
              </div>
              <p className="text-lg text-[#A2AAAD]/80 italic mb-2">{provider.tagline}</p>
              <div className="flex items-center gap-4 text-sm text-[#A2AAAD]">
                <span>🖥️ {provider.hardware}</span>
                <span>📍 {provider.location}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-[#00F5FF]">
                ${(provider.pricePerMinute / 100).toFixed(2)}
              </div>
              <div className="text-sm text-[#A2AAAD]">per minute</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Tools & Stats */}
          <div className="space-y-6">
            {/* Tools */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
                <h2 className="font-semibold text-white">Available Tools</h2>
              </div>
              <div className="p-4 space-y-2">
                {provider.tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedTool === tool.id
                        ? 'bg-[#00F5FF]/10 border border-[#00F5FF]/30'
                        : 'bg-[#0A1128]/40 border border-[#A2AAAD]/10 hover:border-[#A2AAAD]/30'
                    }`}
                  >
                    <div className="font-medium text-white">{tool.name}</div>
                    <div className="text-sm text-[#A2AAAD] mt-1">{tool.description}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#A2AAAD]/60">
                      <span>⏱️ {tool.timeLimit}s limit</span>
                      {tool.resourceLimit && (
                        <>
                          <span>CPU: {tool.resourceLimit.maxCpu}%</span>
                          <span>RAM: {(tool.resourceLimit.maxMemory / 1024).toFixed(0)}GB</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 p-6">
              <h2 className="font-semibold text-white mb-4">Provider Stats</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-400">{provider.reputation.uptime}%</div>
                  <div className="text-xs text-[#A2AAAD]">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{provider.reputation.completedSessions.toLocaleString()}</div>
                  <div className="text-xs text-[#A2AAAD]">Sessions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#00F5FF]">{provider.reputation.disputes}</div>
                  <div className="text-xs text-[#A2AAAD]">Disputes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Session Simulation */}
          <div className="space-y-6">
            {/* Session Control */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#00F5FF]/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center justify-between">
                <h2 className="font-semibold text-white">Demo Session</h2>
                {demoMode && (
                  <span className="text-xs text-[#00F5FF]">● Demo Mode</span>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Budget */}
                <div>
                  <label className="text-sm text-[#A2AAAD] block mb-2">Session Budget</label>
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-[#A2AAAD]">$</span>
                    <input
                      type="number"
                      value={budget / 100}
                      onChange={(e) => setBudget(Math.round(parseFloat(e.target.value) * 100))}
                      disabled={simulationStep !== 'idle'}
                      className="flex-1 px-4 py-2 bg-[#0A1128] border border-[#A2AAAD]/20 rounded-lg text-white text-lg font-medium focus:outline-none focus:border-[#00F5FF]/50 disabled:opacity-50"
                    />
                    <span className="text-sm text-[#A2AAAD]">USDC</span>
                  </div>
                </div>

                {/* Status */}
                <div className="p-4 bg-[#0A1128]/60 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#A2AAAD]">Status</span>
                    <span className={`text-sm font-medium ${
                      simulationStep === 'settled' ? 'text-green-400' :
                      simulationStep === 'idle' ? 'text-[#A2AAAD]' :
                      'text-[#00F5FF]'
                    }`}>
                      {simulationStep === 'idle' && 'Ready'}
                      {simulationStep === 'wallet-prompt' && 'Awaiting Wallet...'}
                      {simulationStep === 'connecting' && 'Connecting...'}
                      {simulationStep === 'session-created' && 'Session Active'}
                      {simulationStep === 'executing' && 'Executing...'}
                      {simulationStep === 'completed' && 'Execution Complete'}
                      {simulationStep === 'settling' && 'Settling Payment...'}
                      {simulationStep === 'settled' && '✓ Settled'}
                    </span>
                  </div>

                  {simulationStep === 'executing' && (
                    <div>
                      <div className="flex justify-between text-xs text-[#A2AAAD] mb-1">
                        <span>Effective Time</span>
                        <span>{(executionTime / 1000).toFixed(1)}s</span>
                      </div>
                      <div className="h-2 bg-[#A2AAAD]/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#00F5FF] transition-all"
                          style={{ width: `${(executionTime / 5000) * 100}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-[#00F5FF] mt-1">
                        Cost: ${(cost / 100).toFixed(4)}
                      </div>
                    </div>
                  )}

                  {simulationStep === 'settled' && (
                    <div className="space-y-4">
                      <div className="text-center py-2">
                        <div className="text-2xl font-bold text-green-400">
                          ${(cost / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-[#A2AAAD]">Session Cost (USDC)</div>
                      </div>
                      
                      {/* Connection Instructions */}
                      <div className="p-4 bg-[#00F5FF]/10 rounded-xl border border-[#00F5FF]/20">
                        <div className="text-sm font-medium text-[#00F5FF] mb-2">🔗 Connect Your Agent</div>
                        <div className="text-xs text-[#A2AAAD] space-y-2">
                          <p>Your session is ready. Connect using:</p>
                          <div className="bg-[#0A1128] p-2 rounded font-mono text-[10px] text-[#00F5FF]">
                            orien connect --provider {provider?.id}
                          </div>
                          <p>Or via API:</p>
                          <div className="bg-[#0A1128] p-2 rounded font-mono text-[10px] text-[#00F5FF] break-all">
                            POST https://api.orien.dev/v1/sessions/{'{session_id}'}/execute
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {simulationStep === 'idle' ? (
                  <button
                    onClick={runSimulation}
                    disabled={!isAvailable}
                    className="w-full py-3 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Demo Session
                  </button>
                ) : simulationStep === 'settled' ? (
                  <button
                    onClick={resetSimulation}
                    className="w-full py-3 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all"
                  >
                    Reset Demo
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-3 text-[#A2AAAD]">
                    <div className="w-4 h-4 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
                    <span className="text-sm">Processing...</span>
                  </div>
                )}
              </div>
            </div>

            {/* API Panel */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <button
                onClick={() => setShowApiPanel(!showApiPanel)}
                className="w-full px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center justify-between hover:bg-[#00F5FF]/5 transition-colors"
              >
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-[#00F5FF]">{"</>"}</span>
                  API Payload
                </h2>
                <span className="text-[#A2AAAD]">{showApiPanel ? '−' : '+'}</span>
              </button>

              {showApiPanel && (
                <div className="p-4">
                  <pre className="text-xs text-[#A2AAAD] bg-[#0A1128] p-4 rounded-lg overflow-x-auto font-mono">
                    {getApiPayload()}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wallet Modal */}
        {showWalletModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0A1128] border border-[#A2AAAD]/20 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#00F5FF]/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🔐</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Transaction</h3>
                <p className="text-sm text-[#A2AAAD]">
                  Authorize budget allocation for this session
                </p>
              </div>

              <div className="bg-[#0A1128]/80 border border-[#A2AAAD]/10 rounded-xl p-4 mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A2AAAD]">Provider</span>
                  <span className="text-white">{provider?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A2AAAD]">Tool</span>
                  <span className="text-white">{provider?.tools.find(t => t.id === selectedTool)?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A2AAAD]">Max Budget</span>
                  <span className="text-[#00F5FF] font-medium">${(budget / 100).toFixed(2)} USDC</span>
                </div>
                <div className="pt-3 border-t border-[#A2AAAD]/10">
                  <div className="text-xs text-[#A2AAAD]/60">
                    You only pay for effective execution time. Unused budget is returned.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelWallet}
                  className="flex-1 py-3 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmWalletTx}
                  className="flex-1 py-3 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all"
                >
                  ✓ Confirm
                </button>
              </div>

              <div className="mt-4 text-center text-xs text-[#A2AAAD]/40">
                Demo Mode — No real transaction will be sent
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
