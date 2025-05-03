import { createWalletClient, custom } from "https://esm.sh/viem";

const connectButton = document.getElementById("connectButton");

let walletClient; // Variable to hold the wallet client instance

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

// 6. Attach the connect function to the button's click event
connectButton.onclick = connect;
