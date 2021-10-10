import React, { useEffect, useState } from "react";
import { formatEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { Form, Row, Col, Button, List } from "antd";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import "./Market.scss";
import { IFSlider, CoinInput, NoWallet, InputDropdown, InputField } from "../components";
import useChainlinkPrice from "../hooks/useChainlinkPrice";
import useContractBalances from "../hooks/useContractBalances";

export default function Market({
  provider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  appContract,
  userAddress,
  network,
  contractBalances
}) {
  const [isLong, setIsLong] = useState(true);
  const [leverage, setLeverage] = useState(5);
  const [symbol, setSymbol] = useState("ETHBTC");
  const [limitPrice, setLimitPrice] = useState("ETHBTC");
  const [amt, setAmt] = useState("ETHBTC");
  const [actionType, setActionType] = useState("Limit");
  const [showLimit, setShowLimit] = useState(false);
  const [poolPrice, setPoolPrice] = useState();
  const price = useChainlinkPrice("JPY", provider);
  const { shorts, longs, portfolio } = contractBalances;
  const coinsList = [
    {
      name: "ETHBTC",
      balance: 100
    },
    {
      name: "ETHUSD",
      balance: 100
    },
    {
      name: "BTCUSD",
      balance: 100
    },
  ];
  const limitMarket = [
    {
      name: "Limit",
    },
    {
      name: "Market",
    },
  ];
  const Symbols = { "ETHBTC": "ETHBTC" };
  const formatPoolPrice = price => {
    if (price) {
      let etherBalance = formatEther(price.toString());
      let floatBalance = parseFloat(etherBalance);
      return floatBalance.toFixed(8);
    }
  };

  useEffect(() => {
    if (appContract) {
      appContract
        .getPoolPrice()
        .then(result => {
          setPoolPrice(result.toString());
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [appContract]);


  useEffect(() => {
    if (actionType=='Limit') {
      setShowLimit(true);
    } else {
      setShowLimit(false);
    }
    console.log(" actionType ", actionType, " - ", showLimit);

  }, [actionType]);

  const openPosition = () => {
    if (appContract && leverage && portfolio && portfolio > 0) {
      if (isLong) {
        appContract
          .MintLongWithLeverage(leverage)
          .then(() => {
            console.log("Successfully Minted Long!");
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        appContract
          .MintShortWithLeverage(leverage)
          .then(() => {
            console.log("Successfully Minted Short!");
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  };

  return (
    <div className="market-container">
      <div className="sidebar">
        {provider ? (
          <>
            <div>
              <p>
                Trade Details
              </p>
            </div>
            <div className="long-short-box">
            </div>
            <Form>
              <Form.Item>
              <InputDropdown
                  coins={coinsList}
                  title="Assets"
                  onChange={() => {}}
                />
              </Form.Item>
              <Form.Item>
              <InputDropdown
                  coins={limitMarket}
                  title="Action"
                  onChange={setActionType}
                />
              </Form.Item>
              <Form.Item style={showLimit ? '' : { display: 'none'} }>
              <InputField
                  filedValue={limitPrice}
                  title="Limit Amt"
                  fixedValue={Number(portfolio)}
                  onChange={() => {}}
                  // display={false}
                />
              </Form.Item>
              <Form.Item>
                <InputField
                  filedValue={amt}
                  title="Collateral"
                  fixedValue={Number(portfolio)}
                  onChange={() => {}}
                />
              </Form.Item>

              <div>
                <p>
                  Leverage{" "}
                  <span style={{ color: "#999999" }}>({leverage}x)</span>
                </p>
              </div>
              <Form.Item>
                <IFSlider
                  min={1}
                  max={10}
                  defaultValue={leverage}
                  onSlide={value => setLeverage(value)}
                  isLong={isLong}
                />
              </Form.Item>
              <Form.Item>
                <div className="submit-box">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{
                        background: isLong ? "#28A644" : "#E54848",
                        border: "1px solid #E5E5E5",
                        boxShadow: "none",
                        flexGrow: 1,
                        borderRadius: "10px"
                      }}
                      onClick={openPosition}
                    >
                      Submit
                    </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        ) : (
          <NoWallet
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
        )}
      </div>
      <TradingViewWidget
        symbol={symbol}
        theme={Themes.Light}
        locale="en"
        dateRange={8}
        autosize
      />
    </div>
  );
}
