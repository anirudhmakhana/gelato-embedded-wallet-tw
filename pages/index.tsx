import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useConnectionStatus,
  useDisconnect,
  useEmbeddedWallet,
  useWallet,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const contractAddress = "0x803e3B9f424167B75843c3f831F20F7d770260D9";
const abi = [
  {
    anonymous: false,
    inputs: [],
    name: "GetPriceEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "timeStamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "PriceUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "getPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "price",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Home: NextPage = () => {
  const address = useAddress();
  const connectedWallet = useWallet("embeddedWallet");
  const { contract } = useContract(contractAddress, abi);
  const { data: price, refetch: fetchPrice } = useContractRead(
    contract,
    "price"
  );
  const [email, setEmail] = useState<string | undefined>();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();
  const [chainId, setChainId] = useState<number | undefined>();
  const [newPrice, setNewPrice] = useState<string>("");

  useEffect(() => {
    if (connectedWallet) {
      connectedWallet?.getEmail().then((email) => setEmail(email));
      connectedWallet.getChainId().then((chainId) => setChainId(chainId));
    }
  }, [connectedWallet]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.column}>
            <h1 className={styles.title}>
              Welcome to{" "}
              <span className={styles.gradientText0}>
                <a
                  href="https://thirdweb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gelato.
                </a>
              </span>
            </h1>
            <ConnectWallet />
            {address ? (
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around', // Espace entre les blocs
                  alignItems: 'center',
                  height: '30vh',
                  textAlign: 'center',
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'left',
                    alignItems: 'left',
                    textAlign: 'center'
                  }}>
                    <h3>💻 Connected as</h3>
                    <p style={{ margin: 0 }}>{email}</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    <h3>💳 Wallet Address </h3>
                    <p style={{ margin: 0 }}>{`${address.slice(0, 5)}...${address.slice(-5)}`}</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    <h3>⛓️ Chain ID</h3>
                    <p style={{ margin: 0 }}>{chainId}</p>
                  </div>
                </div>
                <button className={styles.button} onClick={disconnect}>
                  Log out
                </button>
                <div>
                  <h2>
                    Current Price: {price ? '$' + price.toString() : "Loading..."}
                  </h2>
                  <Web3Button
                    contractAddress={contractAddress}
                    action={async (contract) => await contract.call("getPrice")}
                    onSuccess={fetchPrice}
                    style={{ background: 'linear-gradient(90deg, #ff7e5f, #feb47b)' }}
                  >
                    Get Price
                  </Web3Button>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="Enter new price"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                  <Web3Button
                    contractAddress={contractAddress}
                    style={{ background: 'linear-gradient(90deg, #ff7e5f, #feb47b)' }}
                    action={async (contract) => await contract.call("updatePrice", [newPrice])}
                    onSuccess={fetchPrice}
                  >
                    Set Price
                  </Web3Button>
                </div>
              </>
            ) : (
              <>
                {connectionStatus == "disconnected" ? (
                  <CustomLogin />
                ) : (
                  <div className={styles.spinner} />
                )}
              </>
            )}
          </div>
        </div>
        <div className={styles.grid}></div>
      </div>
    </main>
  );
};

// Handles login with Google
const CustomGoogleSignInButton = () => {
  const { connect } = useEmbeddedWallet();

  const signInWithGoogle = async () => {
    await connect({
      strategy: "google",
    });
  };

  return (
    <button className={styles.button} onClick={signInWithGoogle}>
      <svg
        className=" h-5 w-5 mr-2"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="21.17" x2="12" y1="8" y2="8" />
        <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
        <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
      </svg>
      Sign in with Google
    </button>
  );
};

// Handles login with email
const CustomLogin = () => {
  const [state, setState] = useState<
    "init" | "enter_email" | "sending_email" | "email_verification"
  >("init");

  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const { connect, sendVerificationEmail } = useEmbeddedWallet();

  const handleEmailClicked = async () => {
    setState("enter_email");
  };

  const handleEmailEntered = async () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }
    setState("sending_email");
    await sendVerificationEmail({ email });
    setState("email_verification");
  };

  const handleEmailVerification = async () => {
    if (!email || !verificationCode) {
      alert("Please enter a verification code");
      return;
    }
    await connect({ strategy: "email_verification", email, verificationCode });
  };

  if (state === "enter_email") {
    return (
      <>
        <p>Enter your email</p>
        <input
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={styles.button} onClick={handleEmailEntered}>
          Continue
        </button>
        <a onClick={() => setState("init")}>
          <p>Go Back</p>
        </a>
      </>
    );
  }

  if (state === "sending_email") {
    return <div className={styles.spinner} />;
  }

  if (state === "email_verification") {
    return (
      <>
        <p>Enter the verification code sent to your email</p>
        <input
          className={styles.input}
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button className={styles.button} onClick={handleEmailVerification}>
          Verify
        </button>
        <a onClick={() => setState("init")}>
          <p>Go Back</p>
        </a>
      </>
    );
  }

  return (
    <>
      <CustomGoogleSignInButton />
      <button className={styles.button} onClick={handleEmailClicked}>
        <svg
          className=" h-5 w-5 mr-2"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect height="16" rx="2" width="20" x="2" y="4" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        Sign in with Email
      </button>
    </>
  );
};

export default Home;
