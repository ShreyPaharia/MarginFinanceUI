import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Contract } from "@ethersproject/contracts";
// import { getDefaultProvider } from "@ethersproject/providers";
import useWeb3Modal from "./hooks/useWeb3Modal";
import abi from "./contracts/Perpetual.abi";
import contractAddress from "./contracts/Perpetual.address";
import { Header } from "./components";
import { Market, Dashboard, LandingPage, LiquidityProvider, Trade, Yeild } from "./pages";
import useContractBalances from "./hooks/useContractBalances";

import "./App.scss";
import "antd/dist/antd.css";

const targetNetwork = "kovan";

function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [userAddress, setUserAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [appContract, setAppContract] = useState();
  const contractBalances = useContractBalances(
    appContract,
    userAddress,
    network
  );

  useEffect(() => {
    let subscribed = true;

    if (provider) {
      setAppContract(
        new Contract(contractAddress, abi, provider.getSigner())
      );
      provider
        .getNetwork()
        .then(result => {
          if (subscribed) {
            setNetwork(result);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    return () => {
      subscribed = false;
    };
  }, [provider]);

  useEffect(() => {
    const signer = provider?.getSigner();
    if (signer) {
      if (appContract) {
        setAppContract(appContract.connect(signer));
      }

      signer
        .getAddress()
        .then(address => {
          setUserAddress(address);
        })
        .catch(err => {
          console.log("Couldn't get signer", err);
        });
    }
  }, [provider]);

  return (
    <div className="app">
      <Router>
        <Route path="/market" exact>
          <Header
            address={userAddress}
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
          <Market
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            appContract={appContract}
            userAddress={userAddress}
            network={network}
            contractBalances={contractBalances}
          />
        </Route>
        <Route path="/trade" exact>
          <Header
            address={userAddress}
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
          <Trade
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            appContract={appContract}
            userAddress={userAddress}
            network={network}
            contractBalances={contractBalances}
          />
        </Route>
        <Route path="/" exact>
          <Header
            address={userAddress}
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
          <Dashboard
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            appContract={appContract}
            userAddress={userAddress}
            network={network}
            contractBalances={contractBalances}
          />
        </Route>
        <Route path="/liquidityProvider" exact>
          <Header
            address={userAddress}
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
          <LiquidityProvider
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          appContract={appContract}
          userAddress={userAddress}
          network={network}
          contractBalances={contractBalances}
          />
        </Route>
        <Route path="/yeild" exact>
          <Header
            address={userAddress}
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
          <Yeild
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          appContract={appContract}
          userAddress={userAddress}
          network={network}
          contractBalances={contractBalances}
          />
        </Route>
      </Router>
      {network && network.name !== targetNetwork && (
        <div className="modal-container">
          <div className="network-modal">
            <p>Please switch network to {targetNetwork}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Reload on Network Switch
window.ethereum &&
  window.ethereum.on("chainChanged", () => {
    setTimeout(() => {
      window.location.reload();
    }, 1);
  });

export default App;
