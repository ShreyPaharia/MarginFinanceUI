import React from "react";
import { formatUnits, parseEther } from "@ethersproject/units";
import addresses from "../utils/addresses";
import { Container, TransferWidget, NoWallet, InputDropdown } from "../components";
import useContractBalances from "../hooks/useContractBalances";
import "./Dashboard.scss";
import { Collapse, Table } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";

const { Panel } = Collapse;
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

const data = [{ t1: "BTC", t2: "0", t3: "0", t4: "12", t5: "0.785%", t6: "45K" }, { t1: "SOL", t2: "0", t3: "0", t4: "22", t5: "0.9895%", t6: "52K" }];
const col = [
  {
    dataIndex: "t1",
    title: "Asset"
  },
  {
    dataIndex: "t2",
    title: "Wallet"
  },
  {
    dataIndex: "t3",
    title: "Deposited"
  },
  {
    dataIndex: "t4",
    title: "APY"
  },
  {
    dataIndex: "t5",
    title: "Daily"
  },
  {
    dataIndex: "t6",
    title: "TVL"
  }
];

export default function LiquidityProvider({
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

  const formatShares = shares => {
    return Number(shares)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const Expander = props => <span>Test expander</span>;

  return (
    <div className="dashboard-container">
      {provider ? (
        <div className="dashboard-content">
          <div className="row">
            <InputDropdown
                  coins={coinsList}
                  title="Assets"
                  // fixedValue={Number(portfolio)}
                  onChange={() => {}}
                />

          </div>
          <div className="row">
            <Container className="positions" title="Assets">
            <Table
              expandable={{
                    expandedRowRender: record => (
                      <TransferWidget
                                            appContract={appContract}
                                            provider={provider}
                                            addresses={addresses}
                                            userAddress={userAddress}
                                            network={network}
                                            contractBalances={contractBalances}
                                          />
                    ),
                    expandIcon: ({ expanded, onExpand, record }) =>
                      expanded ? (
                        <MinusCircleTwoTone onClick={e => onExpand(record, e)} />
                      ) : (
                        <PlusCircleTwoTone onClick={e => onExpand(record, e)} />
                      )
                  }}
              dataSource={data}
              columns={col}
              expandRowByClick
              onRow={record => ({
                onClick: e => {
                  /* Call some endPoint to log this click event */
                  console.log(`user clicked on row ${record.t1}!`);
                }
              })}
            />

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
