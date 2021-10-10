import React, { useEffect, useState } from "react";
import { parseUnits, parseEther } from "@ethersproject/units";
import useTokenBalances from "../hooks/useTokenBalances";
import useContractBalances from "../hooks/useContractBalances";
import approve from "../utils/approve";
import { Container, CoinInput, InputDropdown, InputField } from ".";
import "./TransferWidget.scss";
// import { IFSlider, CoinInput, NoWallet, InputDropdown, InputField } from "../components";

export default function TransferYeild({
  provider,
  addresses,
  appContract,
  userAddress,
  network,
  contractBalances
}) {
  const balances = useTokenBalances(provider, network, userAddress);
  const { coins, shorts, longs } = contractBalances;
  const [withdrawalCoin, setWithdrawalCoin] = useState();
  const [depositCoin, setDepositCoin] = useState();
  const [depositing, setDepositing] = useState(false);
  const coinsList = [
    {
      name: "0.05% Fee",
      balance: 0.05
    },
    {
      name: "0.3% Fee",
      balance: .03
    },
    {
      name: "1% Fee",
      balance: 1
    },
  ];


  const withdraw = () => {
    if (
      withdrawalCoin.value <= withdrawalCoin.balance &&
      withdrawalCoin.value > 0
    ) {
      appContract
        .withdraw(parseEther(withdrawalCoin.value), withdrawalCoin.address)
        .then(result => {
          console.log("Withdrawal Successful!", result);
        })
        .catch(err => {
          console.error("Withdrawal Failed!", err);
        });
    }
  };

  const deposit = () => {
    if (depositCoin.value <= depositCoin.balance && depositCoin.value > 0) {
      setDepositing(true);
      let amount = parseUnits(depositCoin.value, 6);
      approve(provider, depositCoin.address, amount, userAddress)
        .then(info => {
          appContract
            .deposit(amount, depositCoin.address)
            .then(result => {
              setDepositing(false);
              console.log("Deposit Success!");
            })
            .catch(err => {
              console.error("Deposit Error!", err);
            });
        })
        .catch(err => {
          console.error("Approval Error!", err);
        });
    }
  };

  return (
    <Container className="deposits" title="Deposit Amount for the pair">
      <div className=" row">
        {balances &&
          (depositing ? (
            <div className="loader" />
          ) : (
            <CoinInput
              coins={balances}
              title=""
              onChange={setDepositCoin}
            />
          ))}
        {/* <button onClick={deposit}>Deposit</button> */}
      </div>
      <div className=" row">
        {shorts && longs && coins && (
          <CoinInput
            fixedValue={Number(shorts) > 0 || Number(longs) > 0 ? 0 : null}
            disabled={Number(shorts) > 0 || Number(longs) > 0}
            coins={coins}
            title=""
            onChange={setWithdrawalCoin}
          />
        )}
        {/* <button onClick={withdraw} className="red">
          Withdraw
        </button> */}
      </div>
      <div className=" row">
      <InputDropdown
                  coins={coinsList}
                  title="Fees"
                  onChange={() => {}}
                />

      </div>
    </Container>
  );
}
