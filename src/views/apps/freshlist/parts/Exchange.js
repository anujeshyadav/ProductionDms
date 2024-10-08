import React, { useState } from "react";

const Exchange = () => {
  // Define exchange rates (you can fetch these from an API)
  const exchangeRates = {
    USD: 1, // Base currency (e.g., 1 USD = 1 USD)
    EUR: 0.85, // Exchange rate for Euro
    GBP: 0.72,
    RS: 80, // Exchange rate for British Pound
  };

  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [totalAmount, setTotalAmount] = useState(100);

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);

    // Convert the total amount to the selected currency
    setTotalAmount(
      (totalAmount / exchangeRates[selectedCurrency]) *
        exchangeRates[newCurrency]
    );
  };

  return (
    <div>
      <h1>
        Total Amount: {totalAmount} {selectedCurrency}
      </h1>
      <select value={selectedCurrency} onChange={handleCurrencyChange}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="RS">INR</option>
      </select>
    </div>
  );
};

export default Exchange;
