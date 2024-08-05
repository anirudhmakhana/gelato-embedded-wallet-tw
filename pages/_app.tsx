import type { AppProps } from "next/app";
import { ThirdwebProvider, embeddedWallet } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { Ethereum, Polygon } from "@thirdweb-dev/chains";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "ethereum";

const customChain = {
  // Required information for connecting to the network
  chainId: 88153591557, // A unique chain id
  rpc: ["https://rpc.arb-blueberry.gelato.digital"], // Array of RPC URLs to use

  // Information for adding the network to your wallet (how it will appear for first time users) === \\
  // Information about the chain's native currency (i.e. the currency that is used to pay for gas)
  nativeCurrency: {
    decimals: 18,
    name: "Gelato Custom Gas Token",
    symbol: "CGT",
  },
  shortName: "bluberry", // Display value shown in the wallet UI
  slug: "bluberry", // Display value shown in the wallet UI
  testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
  chain: "Arbitrum Blueberry", // Name of the network
  name: "Arbitrum Blueberry", // Name of the network
};


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={customChain}
      supportedChains={[Ethereum, Polygon]}
      supportedWallets={[embeddedWallet()]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
