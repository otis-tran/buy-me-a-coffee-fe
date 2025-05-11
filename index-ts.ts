import {
  createWalletClient,
  custom,
  formatEther,
  parseEther,
  defineChain,
  createPublicClient,
  WalletClient,
  PublicClient,
  Chain,
} from "viem";
import "viem/window";
import { abi, contractAddress } from "./constants-ts";

// HTML element references
const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const fundButton = document.getElementById("fundButton") as HTMLButtonElement;
const balanceButton = document.getElementById("balanceButton") as HTMLButtonElement;
const withdrawButton = document.getElementById("withdrawButton") as HTMLButtonElement;
const ethAmountInput = document.getElementById("ethAmount") as HTMLInputElement;

let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;

// Connect to MetaMask
async function connect(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    await walletClient.requestAddresses();
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

// Fund the contract
async function fund(): Promise<void> {
  const ethAmount = ethAmountInput.value;
  console.log(`Funding with ${ethAmount}...`);

  if (typeof window.ethereum !== "undefined") {
    try {
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      });

      const [account] = await walletClient.requestAddresses();
      const currentChain = await getCurrentChain(walletClient);

      console.log("Current chain: ", currentChain);
      console.log("Account: ", account);
      console.log("Contract address: ", contractAddress);
      console.log("Processing transaction...");

      publicClient = createPublicClient({
        transport: custom(window.ethereum),
      });

      const value = parseEther(ethAmount);
      console.log("Value: ", value);

      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi,
        functionName: "fund",
        account,
        chain: currentChain,
        value,
      });

      console.log("Transaction request: ", request);
      const hash = await walletClient.writeContract(request);
      console.log("Transaction processed: ", hash);
    } catch (error) {
      console.error("Error funding contract:", error);
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask";
  }
}

// Get current chain info
async function getCurrentChain(client: WalletClient): Promise<Chain> {
  const chainId = await client.getChainId();

  return defineChain({
    id: chainId,
    name: "Anvil Local",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://127.0.0.1:8545"],
      },
    },
  });
}

// Get contract balance
async function getBalance(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    const publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    try {
      const balance = await publicClient.getBalance({
        address: contractAddress,
      });

      const formattedBalance = formatEther(balance);
      console.log(`Contract Balance: ${formattedBalance} ETH`);
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  } else {
    console.log("Please install MetaMask!");
  }
}

// Withdraw from contract
async function withdraw(): Promise<void> {
  console.log("Withdrawing...");

  if (typeof window.ethereum !== "undefined") {
    try {
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      });

      const [account] = await walletClient.requestAddresses();
      const currentChain = await getCurrentChain(walletClient);

      console.log("Current chain: ", currentChain);
      console.log("Account: ", account);
      console.log("Contract address: ", contractAddress);
      console.log("Processing withdrawal...");

      publicClient = createPublicClient({
        transport: custom(window.ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi,
        functionName: "withdraw",
        account,
        chain: currentChain,
      });

      console.log("Transaction request: ", request);
      const hash = await walletClient.writeContract(request);
      console.log("Withdrawal processed: ", hash);
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask";
  }
}

// Bind event listeners
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
