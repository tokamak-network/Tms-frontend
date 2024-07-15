import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia_titan } from '../chains/tokamak';
export const NetworkConfig = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    sepolia_titan,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia_titan] : [])
  ],
  ssr: true
});
