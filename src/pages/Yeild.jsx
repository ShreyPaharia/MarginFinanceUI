import React, { useState } from "react";
import { formatUnits, parseEther } from "@ethersproject/units";
import addresses from "../utils/addresses";
import { Container, TransferYeild, NoWallet, InputField } from "../components";
import useContractBalances from "../hooks/useContractBalances";
import "./Yeild.scss";

export default function Yeild({
  provider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  appContract,
  userAddress,
  network,
  contractBalances
}) {
  const {
    poolPrice,
    entryPrice,
    shorts,
    longs,
    portfolio,
    coins,
    pnl,
    marginRatio
  } = contractBalances;
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();

  const redeemLong = () => {
    appContract
      .RedeemLongQuote(addresses[network.name].supportedCollateral[0].address)
      .then(result => {
        console.log("Closed Position Successfully", result);
      })
      .catch(err => {
        console.error("Couldn't Close Position", err);
      });
  };
  const redeemShort = () => {
    appContract
      .RedeemShortQuote(addresses[network.name].supportedCollateral[0].address)
      .then(result => {
        console.log("Closed Position Successfully", result);
      })
      .catch(err => {
        console.error("Couldn't Close Position", err);
      });
  };

  const submit = () => {
  };

  const formatShares = shares => {
    return Number(shares)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="dashboard-container">
      {provider ? (
        <div className="yeild-content">
          <div className="row">
            <TransferYeild
              appContract={appContract}
              provider={provider}
              addresses={addresses}
              userAddress={userAddress}
              network={network}
              contractBalances={contractBalances}
            />
            <Container className="holdings" title="Select Price Range">
              <InputField
                  filedValue={minPrice}
                  title="Min Price"
                  fixedValue={Number(portfolio)}
                  onChange={setMinPrice}
                />

              <InputField
                    filedValue={maxPrice}
                    title="Max Price"
                    fixedValue={Number(portfolio)}
                    onChange={setMaxPrice}
                    // display={false}
                  />

              <div className="row">
                <button onClick={submit} >
                  Submit
                </button>
              </div>
            </Container>
          </div>
          <div className="row">
            <Container className="positions" title="Open Positions">
              <table>
                <thead>
                  <tr>
                    <th>Market</th>
                    <th>Size</th>
                    <th>Entry Price</th>
                    <th>Market Price</th>
                    <th>Margin</th>
                    <th>PNL</th>
                    <th>Close</th>
                  </tr>
                </thead>
                <tbody>
                  {(Number(shorts) > 0 || Number(longs) > 0) && (
                    <tr>
                      <td>JPY/USD</td>
                      <td>
                        {Number(shorts) > 0
                          ? formatShares(shorts)
                          : formatShares(longs)}
                      </td>
                      <td>{parseFloat(entryPrice).toFixed(8)}</td>
                      <td>{parseFloat(poolPrice).toFixed(8)}</td>
                      <td>{marginRatio}</td>
                      <td>{parseFloat(pnl).toFixed(2)}</td>
                      <td>
                        <button
                          onClick={
                            Number(shorts) > 0 ? redeemShort : redeemLong
                          }
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Container>
          </div>
        </div>
      ) : (
        <NoWallet
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
      )}
    </div>
  );
}
