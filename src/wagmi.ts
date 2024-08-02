import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';

export const HYBRID_EXPLORER = "https://explorer.buildonhybrid.com/";

const hybridTestnet = {
  name: "Hybrid Testnet",
  testnet: true,
  nativeCurrency: {
    decimals: 18,
    name: "Hybrid",
    symbol: "HYB",
  },
  id: 1225,
  rpcUrls: {
    public: { http: ["https://hybrid-testnet.rpc.caldera.xyz/http"] },
    default: { http: ["https://hybrid-testnet.rpc.caldera.xyz/http"] },
  },
  blockExplorers: {
    default: {
      name: "Hybrid",
      url: HYBRID_EXPLORER,
    },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '98569b39c5394b736ce9aa22189928c5',
  chains: [
    hybridTestnet,
  ],
  ssr: true,
});