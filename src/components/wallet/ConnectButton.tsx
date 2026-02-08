'use client';

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="w-4 h-4"
                      />
                    )}
                    <span className="text-sm">{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    {account.ensAvatar && (
                      <img
                        alt="ENS Avatar"
                        src={account.ensAvatar}
                        className="w-5 h-5 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {account.ensName || account.displayName}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
