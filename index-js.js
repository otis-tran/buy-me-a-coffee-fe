const connectButton = document.getElementById('connectButton');

function connect() {
    // Check if window.ethereum is present
    if (typeof window.ethereum !== "undefined") {
        // Wallet is likely installed
        console.log("MetaMask (or compatible wallet) is available!");
        // We'll add connection logic here later
    } else {
        // Wallet is not installed
        console.log("No wallet detected.");
        connectButton.innerHTML = "Please install MetaMask!"; // Update button text
    }
}

connectButton.onclick = connect;