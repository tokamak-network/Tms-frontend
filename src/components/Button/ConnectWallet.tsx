import { ConnectButton } from '@rainbow-me/rainbowkit';

export const ConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks

        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-transparent border-2 border-gray-300 text-gray-500 py-2 px-6 rounded-full hover:bg-gray-700 hover:text-white transition duration-300 font-titillium"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-transparent border-2 border-gray-300 text-gray-400 py-2 px-6 rounded-full hover:bg-gray-700 hover:text-white transition duration-300 font-titillium"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="flex gap-12">
                  <button
                    onClick={openChainModal}
                    className="bg-transparent border-2 border-gray-300 text-gray-400 py-2 px-6 rounded-full hover:bg-gray-700 hover:text-white transition duration-300 font-titillium"
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconUrl,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="bg-transparent border-2 border-gray-300 text-gray-400 py-2 px-6 rounded-full hover:bg-gray-700 hover:text-white transition duration-300 font-titillium"
                  >
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
