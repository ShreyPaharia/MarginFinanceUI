import React, { useEffect, useState } from "react";
import { formatEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { Form, Row, Col, Button, List } from "antd";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import "./Market.scss";
import { IFSlider, CoinInput, NoWallet } from "../components";
import useChainlinkPrice from "../hooks/useChainlinkPrice";
import useContractBalances from "../hooks/useContractBalances";

export default function Market({
  provider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  perpetualContract,
  userAddress,
  network,
  contractBalances
}) {
  const [isLong, setIsLong] = useState(true);
  const [leverage, setLeverage] = useState(5);
  const [symbol, setSymbol] = useState("JPYUSD");
  const [poolPrice, setPoolPrice] = useState();
  const price = useChainlinkPrice("JPY", provider);
  const { shorts, longs, portfolio } = contractBalances;
  const coinsList = [
    {
      name: "BTC",
      balance: 100
    },
    {
      name: "ETH",
      balance: 100
    },
    {
      name: "AAVE",
      balance: 100
    },
    {
      name: "SOL",
      balance: 100
    },
    {
      name: "LINK",
      balance: 100
    }
]

  const Symbols = { "JPY/USDC": "JPYUSD" };
  const formatPoolPrice = price => {
    if (price) {
      let etherBalance = formatEther(price.toString());
      let floatBalance = parseFloat(etherBalance);
      return floatBalance.toFixed(8);
    }
  };

  useEffect(() => {
    if (perpetualContract) {
      perpetualContract
        .getPoolPrice()
        .then(result => {
          setPoolPrice(result.toString());
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [perpetualContract]);

  const openPosition = () => {
    if (perpetualContract && leverage && portfolio && portfolio > 0) {
      if (isLong) {
        perpetualContract
          .MintLongWithLeverage(leverage)
          .then(() => {
            console.log("Successfully Minted Long!");
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        perpetualContract
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
                Market Details
              </p>
            </div>
            <div className="long-short-box">
            </div>
            <Form>
            <Form.Item>
                <CoinInput
                  coins={coinsList}
                  title="From"
                  fixedValue={Number(portfolio)}
                  onChange={() => {}}
                />
              </Form.Item>
              <Form.Item>
                <CoinInput
                  coins={coinsList}
                  title="To"
                  fixedValue={Number(portfolio)}
                  onChange={() => {}}
                />
              </Form.Item>
              <Row gutter={[40, 16]}>
                <Col span={6} />
                <Col span={6} />
                <Col span={6} />
                <Col span={6} />
                <Col span={6} />
                <Col span={6} />
                <Col span={6} />
                <Col span={6} />
              </Row>
              <Form.Item>
                <CoinInput
                  coins={[
                    {
                      name: "USD",
                      balance: 100
                    }
                  ]}
                  disabled
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
