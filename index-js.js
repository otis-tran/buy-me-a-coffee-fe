import { createWalletClient, custom, createPublicClient } from "https://esm.sh/viem";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
// const balanceButton = document.getElementById("balanceButton");

let walletClient; // Variable to hold the wallet client instance
let publicClient;

async function connect() {
  // 1. Check if the MetaMask provider (window.ethereum) is available
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed!");

    try {
      // 2. Create a Wallet Client using viem's custom transport
      // This configures viem to use MetaMask's injected provider
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      });

      // 3. Request access to the user's accounts
      // This triggers the MetaMask connection prompt if not already authorized
      await walletClient.requestAddresses();

      // 4. Update the UI to indicate a successful connection
      connectButton.innerHTML = "Connected!";

      // Now you can use walletClient for further interactions
      // e.g., const accounts = await walletClient.getAddresses();
      // console.log("Connected accounts:", accounts);

    } catch (error) {
      // Handle potential errors during connection (e.g., user rejection)
      console.error("Failed to connect:", error);
      connectButton.innerHTML = "Connection Failed";
    }

  } else {
    // 5. Update UI if MetaMask is not detected
    connectButton.innerHTML = "Please install MetaMask!";
  }
}

async function fund() {
  const ethAmount = ethAmountInput.value;
  console.log(`Funding with ${ethAmount}...`);

  // Ensure wallet is connected and client is initialized
  if (typeof window.ethereum !== "undefined") {
    // Re-initialize or confirm walletClient
    // Note: We assume 'walletClient' is declared globally (e.g., 'let walletClient;')
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    // Request account access (important step!)
    const [address] = await walletClient.requestAddresses();
    console.log("Wallet connected, Account:", address);

    // Now we can proceed with transaction logic...
    // Create Public Client after Wallet Client is ready
    publicClient = createPublicClient({
      transport: custom(window.ethereum)
    });
    console.log("Public Client Initialized");

    // Inside the fund function's 'if' block, after initializing publicClient:
    try {
      // We need to define contractAddress and contractAbi first!
      // We also need to parse ethAmount into Wei (e.g., using viem's parseEther)

      console.log("Attempting simulation...");
      const simulationResult = await publicClient.simulateContract({
        address: undefined, // TODO: Add deployed contract address
        abi: undefined,     // TODO: Add contract ABI
        functionName: 'fund',
        account: address,   // Use the address obtained from requestAddresses
        value: undefined,   // TODO: Add parsed ETH amount in Wei
      });

      console.log("Simulation successful:", simulationResult);
      // If simulation succeeds, simulationResult.request contains the prepared transaction details
      // We can then pass this to walletClient.writeContract() to send the actual transaction

    } catch (error) {
      console.error("Simulation failed:", error);
      // Handle simulation errors appropriately (e.g., display message to user)
    }

  } else {
    // Handle the case where MetaMask (or other provider) is not installed
    console.log("Please install MetaMask!");
    // Consider disabling the button or updating its text here
    // e.g., fundButton.innerHTML = "Please Install MetaMask";
  }
}

// 6. Attach the connect function to the button's click event
// Event Listeners
connectButton.onclick = connect;
fundButton.onclick = fund;
//balanceButton.onclick = getBalance;
