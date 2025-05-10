import {
  createWalletClient,
  custom,
  formatEther,
  parseEther,
  defineChain,
  createPublicClient,
} from "https://esm.sh/viem"
import "https://esm.sh/viem/window"
import { abi, contractAddress } from "./constants-js.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const ethAmountInput = document.getElementById("ethAmount")

let walletClient
let publicClient

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    })
    await walletClient.requestAddresses()
    connectButton.innerHTML = "Connected"
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

async function fund() {
  const ethAmount = ethAmountInput.value
  console.log(`Funding with ${ethAmount}...`)

  if (typeof window.ethereum !== "undefined") {
    try {
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      })
      const [account] = await walletClient.requestAddresses()
      const currentChain = await getCurrentChain(walletClient)
      console.log("Current chain: ", currentChain)
      console.log("Account: ", account)
      console.log("Contract address: ", contractAddress)

      console.log("Processing transaction...")
      publicClient = createPublicClient({
        transport: custom(window.ethereum),
      })
      console.log("Value: ", parseEther(ethAmount))
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi,
        functionName: "fund",
        account,
        chain: currentChain,
        value: parseEther(ethAmount),
      })

      console.log("Transaction request: ", request)
      const hash = await walletClient.writeContract(request)
      console.log("Transaction processed: ", hash)
    } catch (error) {
      console.log(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId()
  const currentChain = defineChain({
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
  })
  return currentChain
}

// Event listeners
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
