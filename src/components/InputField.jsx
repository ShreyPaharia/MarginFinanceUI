import React, { useState, useEffect } from "react";
import "./CoinInput.scss";

export default function InputField({
  title,
  filedValue,
  onChange,
  fixedValue,
  disabled = false,
  display = true,
}) {
  const [value, setValue] = useState(filedValue);

  return (
    display ?
    (<div className="coin-input">
        <>
          <p className="header">
            {title}{" "}
          </p>
          <div className="input-container">
            <input
              disabled={disabled}
              type="number"
              min={0}
              value={fixedValue || value}
              placeholder={0}
              onChange={e => {
                setValue(e.nativeEvent.target.value);
              }}
            />
          </div>
        </>
    </div>) : (<></>)
  );
}
