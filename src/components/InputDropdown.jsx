import React, { useState, useEffect } from "react";
import "./CoinInput.scss";

export default function InputDropdown({
  title,
  coins,
  onChange,
  fixedValue,
  disabled = false
}) {
  const [coin, setCoin] = useState(coins[0]);

  const changeCoin = name => {
    let newCoin = coins.filter(coin => coin.name === name)[0];
    setCoin(newCoin);
  };

  // Trigger onChange for any value/coin change
  useEffect(() => {
    if (coin) {
      onChange({
        ...coin
      });
    }
  }, [coin, onChange]);

  // Reset value on coin change

  return (
    <div className="coin-input">
      {coins && coins.length > 0 && (
        <>
          <p className="header">
            {title}{" "}
          </p>
          <div className="input-container">
            <select
              id="coin-select"
              disabled={disabled}
              onChange={e => {
                changeCoin(e.nativeEvent.target.value);
              }}
            >
              {coins.map(({ name }) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
