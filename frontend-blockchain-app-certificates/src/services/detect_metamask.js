import detectEthereumProvider from "@metamask/detect-provider";

// Check to see if MetaMask has changed
export async function setup() {
  const provider = await detectEthereumProvider();

  if (provider && provider === window.ethereum) {
    console.log("MetaMask is available!");
    startApp(provider);
  } else {
    console.log("Please install MetaMask!");
  }
}

// Initialize app
function startApp(provider) {
  if (provider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?");
  }

  const chainId = window.ethereum.request({ method: "eth_chainId" });
  window.ethereum.on("chainChanged", handleChainChanged);
  // Handle chain (network) ID switch
  function handleChainChanged(_chainId) {
    window.location.reload();
  }

  const ethereumButton = document.querySelector(".enableEthereumButton");
  const showAccount = document.querySelector(".showAccount");

  ethereumButton.addEventListener("click", () => {
    getAccount();
  });

  // Request account access if needed
  async function getAccount() {
    const accounts = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((err) => {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      });

    const account = accounts[0];
    showAccount.innerHTML = account;
  }
}

window.addEventListener("load", setup);
