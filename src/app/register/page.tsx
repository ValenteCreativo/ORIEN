'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    walletAddress: '',
    pricePerMinute: '',
    hardware: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Integrate with wallet connection + API
    console.log('Provider registration:', formData);
    
    // For now, just show success
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-navy relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8 text-cyan hover:text-cyan/80 transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan to-white bg-clip-text text-transparent">
            Become a Provider
          </h1>
          <p className="text-xl text-gray max-w-2xl mx-auto">
            List your compute infrastructure and earn from agent executions
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s 
                    ? 'bg-cyan text-navy shadow-[0_0_20px_rgba(0,245,255,0.5)]' 
                    : 'bg-navy border-2 border-gray/30 text-gray'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 transition-all ${
                    step > s ? 'bg-cyan' : 'bg-gray/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Hardware Details */}
        {step === 1 && (
          <Card className="border-2 border-gray/30 bg-navy/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan">Hardware Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray mb-2">
                    Provider Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Silicon Valley Studio"
                    className="w-full px-4 py-3 bg-navy border-2 border-gray/30 rounded-lg text-white focus:border-cyan focus:outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray mb-2">
                    Hardware Type
                  </label>
                  <select
                    value={formData.hardware}
                    onChange={(e) => setFormData({ ...formData, hardware: e.target.value })}
                    className="w-full px-4 py-3 bg-navy border-2 border-gray/30 rounded-lg text-white focus:border-cyan focus:outline-none transition-all"
                    required
                  >
                    <option value="">Select hardware</option>
                    <option value="mac-studio">Mac Studio M2/M3</option>
                    <option value="mac-mini">Mac Mini</option>
                    <option value="workstation">Workstation (GPU)</option>
                    <option value="server">Dedicated Server</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray mb-2">
                    Price per Minute (USDC)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-gray">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.pricePerMinute}
                      onChange={(e) => setFormData({ ...formData, pricePerMinute: e.target.value })}
                      placeholder="0.50"
                      className="flex-1 px-4 py-3 bg-navy border-2 border-gray/30 rounded-lg text-white focus:border-cyan focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray/70 mt-2">
                    Agents pay only for effective execution time
                  </p>
                </div>

                <Button 
                  type="submit"
                  variant="primary" 
                  className="w-full bg-cyan text-navy hover:bg-cyan/90 font-bold"
                  size="lg"
                >
                  Continue →
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Connect Wallet */}
        {step === 2 && (
          <Card className="border-2 border-gray/30 bg-navy/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan">Connect Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-gray">
                  Connect your wallet to receive USDC payments from agent executions.
                </p>

                <div className="grid gap-4">
                  <button
                    onClick={handleSubmit}
                    className="p-6 bg-navy border-2 border-gray/30 rounded-lg hover:border-cyan hover:shadow-[0_0_30px_rgba(0,245,255,0.2)] transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">👛</div>
                      <div>
                        <div className="font-bold text-lg mb-1">MetaMask</div>
                        <div className="text-sm text-gray">Most popular wallet</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="p-6 bg-navy border-2 border-gray/30 rounded-lg hover:border-cyan hover:shadow-[0_0_30px_rgba(0,245,255,0.2)] transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🌈</div>
                      <div>
                        <div className="font-bold text-lg mb-1">RainbowKit</div>
                        <div className="text-sm text-gray">Multiple wallets supported</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="p-6 bg-navy border-2 border-gray/30 rounded-lg hover:border-cyan hover:shadow-[0_0_30px_rgba(0,245,255,0.2)] transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🔐</div>
                      <div>
                        <div className="font-bold text-lg mb-1">WalletConnect</div>
                        <div className="text-sm text-gray">Mobile & desktop</div>
                      </div>
                    </div>
                  </button>
                </div>

                <Button 
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  ← Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <Card className="border-2 border-cyan/50 bg-navy/80 backdrop-blur shadow-[0_0_40px_rgba(0,245,255,0.3)]">
            <CardContent className="text-center py-12">
              <div className="text-7xl mb-6">✅</div>
              <h2 className="text-3xl font-bold mb-4 text-cyan">Registration Complete!</h2>
              <p className="text-xl text-gray mb-8">
                Your provider profile is being set up
              </p>

              <div className="max-w-lg mx-auto mb-8 p-6 bg-cyan/10 border border-cyan/30 rounded-lg">
                <div className="space-y-3 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray">Provider Name:</span>
                    <span className="font-semibold">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">Hardware:</span>
                    <span className="font-semibold">{formData.hardware}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">Rate:</span>
                    <span className="font-semibold text-cyan">${formData.pricePerMinute}/min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Next Steps:</h3>
                <div className="space-y-3 text-left max-w-lg mx-auto">
                  <div className="flex items-start gap-3">
                    <span className="text-cyan text-xl">1.</span>
                    <div>
                      <div className="font-semibold">Install Provider Node</div>
                      <code className="text-xs text-gray">npm install -g @orien/provider-node</code>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyan text-xl">2.</span>
                    <div>
                      <div className="font-semibold">Initialize</div>
                      <code className="text-xs text-gray">orien-provider init --name "{formData.name}"</code>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyan text-xl">3.</span>
                    <div>
                      <div className="font-semibold">Start Earning</div>
                      <code className="text-xs text-gray">orien-provider start</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4 justify-center">
                <Link href="/earnings">
                  <Button variant="primary" className="bg-cyan text-navy">
                    View Dashboard →
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost">
                    Back Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
