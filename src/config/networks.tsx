import { sepolia_titan, titan } from '../chains/tokamak';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { createClient } from 'viem';
import {
  metaMaskWallet,
  braveWallet,
  coinbaseWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, braveWallet, coinbaseWallet, walletConnectWallet]
    }
  ],
  {
    appName: 'Tokamak MultiSender',
    projectId: 'YOUR_PROJECT_ID'
  }
);
export const NetworkConfig = createConfig({
  chains: [titan, sepolia_titan],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
  connectors,
  ssr: true
});
