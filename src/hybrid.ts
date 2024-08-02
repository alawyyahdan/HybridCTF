import { Chain } from "viem";

export const HYBRID_EXPLORER = "https://explorer.buildonhybrid.com/";

export const hybridTestnet: Chain = {
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
};
