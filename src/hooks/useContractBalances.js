import { useState, useEffect } from "react";
import { formatEther } from "@ethersproject/units";
import addresses from "../utils/addresses";

export default function useContractBalances(
  appContract,
  userAddress,
  network
) {
  const [shorts, setShorts] = useState();
  const [longs, setLongs] = useState();
  const [portfolio, setPortfolio] = useState();
  const [coins, setCoins] = useState();
  const [marginRatio, setMarginRatio] = useState();
  const [pnl, setPnl] = useState();
  const [entryPrice, setEntryPrice] = useState();
  const [poolPrice, setPoolPrice] = useState();

  const getCoins = async () => {
    let coins = [];
    for (let i in addresses[network.name].supportedCollateral) {
      let coin = addresses[network.name].supportedCollateral[i];
      coins.push({
        ...coin,
        balance: formatEther(
          await appContract.getReserveBalance(userAddress, coin.address)
        ),
      });
    }
    return coins;
  };

  const initListeners = () => {
    appContract.on("Deposit", (value, user, asset) => {
      if (user === userAddress) {
        appContract
          .getPortfolioValue(userAddress)
          .then((result) => formatEther(result))
          .then((result) => {
            setPortfolio(result);
          })
          .catch((err) => {
            console.error(err);
          });
        getCoins().then((result) => {
          setCoins(result);
        });
      }
    });
    appContract.on("Withdraw", (value, user, asset) => {
      if (user === userAddress) {
        appContract
          .getPortfolioValue(userAddress)
          .then((result) => formatEther(result))
          .then((result) => {
            setPortfolio(result);
          })
          .catch((err) => {
            console.error(err);
          });
        getCoins().then((result) => {
          setCoins(result);
        });
      }
    });
    appContract.on(["sellQuoteLong", "buyQuoteLong"], (result) => {
      appContract
        .getLongBalance(userAddress)
        .then((result) => formatEther(result))
        .then((result) => {
          setLongs(result);
        })
        .catch((err) => {
          console.error(err);
        });
      appContract
        .getUserMarginRatio(userAddress)
        .then((result) => formatEther(result))
        .then((result) => {
          setMarginRatio(result);
        })
        .catch((err) => {
          console.error(err);
        });
      appContract
        .getUnrealizedPnL(userAddress)
        .then(([amount, isPositive]) =>
          isPositive ? formatEther(amount) : -formatEther(amount)
        )
        .then((result) => {
          setPnl(result);
        })
        .catch((err) => {
          console.error(err);
        });
      appContract
        .getEntryPrice(userAddress)
        .then((result) => formatEther(result))
        .then((result) => {
          setEntryPrice(result);
        })
        .catch((err) => {
          console.error(err);
        });
    });
    appContract.on(["sellQuoteShort", "buyQuoteShort"], (result) => {
      appContract
        .getShortBalance(userAddress)
        .then((result) => formatEther(result))
        .then((result) => {
          setShorts(result);
        })
        .catch((err) => {
          console.error(err);
        });
      appContract
        .getUserMarginRatio(userAddress)
        .then((result) => formatEther(result))
        .then((result) => {
          setMarginRatio(result);
        })
        .catch((err) => {
          console.error(err);
        });
      appContract
        .getUnrealizedPnL(userAddress)
        .then(([amount, isPositive]) =>
          isPositive ? formatEther(amount) : -formatEther(amount)
        )
        .then((result) => {
          setPnl(result);
        })
        .catch((err) => {
          console.error(err);
        });
      appContract
        .getEntryPrice(userAddress)
        .then((result) => formatEther(result))
        .then((result) => {
          setEntryPrice(result);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  };

  const getContractInfo = async () => {
    const result = {};

    try {
      result.shorts = formatEther(
        await appContract.getShortBalance(userAddress)
      );
    } catch (err) {
      console.error(err);
    }
    try {
      result.longs = formatEther(
        await appContract.getLongBalance(userAddress)
      );
    } catch (err) {
      console.error(err);
    }
    try {
      result.portfolio = formatEther(
        await appContract.getPortfolioValue(userAddress)
      );
    } catch (err) {
      console.error(err);
    }
    try {
      result.marginRatio = formatEther(
        await appContract.getUserMarginRatio(userAddress)
      );
    } catch (err) {
      console.error(err);
    }
    try {
      const [pnlAmount, isPositive] = await appContract.getUnrealizedPnL(
        userAddress
      );
      result.pnl = isPositive
        ? formatEther(pnlAmount)
        : -formatEther(pnlAmount);
    } catch (err) {
      console.error(err);
    }
    try {
      result.entryPrice = formatEther(
        await appContract.getEntryPrice(userAddress)
      );
    } catch (err) {
      console.error(err);
    }
    try {
      result.poolPrice = formatEther(await appContract.getPoolPrice());
    } catch (err) {
      console.error(err);
    }
    try {
      result.coins = await getCoins();
    } catch (err) {
      console.error(err);
    }

    return result;
  };

  useEffect(() => {
    let subscribed = true;
    if (
      appContract &&
      userAddress &&
      network &&
      addresses[network.name] &&
      addresses[network.name].supportedCollateral
    ) {
      initListeners();
      getContractInfo()
        .then((result) => {
          if (subscribed) {
            setShorts(result.shorts);
            setLongs(result.longs);
            setPortfolio(result.portfolio);
            setCoins(result.coins);
            setMarginRatio(result.marginRatio);
            setPnl(result.pnl);
            setEntryPrice(result.entryPrice);
            setPoolPrice(result.poolPrice);
          }
        })
        .catch((err) => {
          console.log("Couldn't Read Contract Data", err);
        });
    }

    return () => {
      subscribed = false;
      if (appContract) {
        appContract.removeAllListeners();
      }
    };
  }, [appContract, userAddress, network]);

  return {
    poolPrice,
    entryPrice,
    shorts,
    longs,
    portfolio,
    coins,
    pnl,
    marginRatio,
  };
}
