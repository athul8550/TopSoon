import React, { useState, useEffect } from "react";
import "./PeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuantityPe from "./QuantityPe";
import ExpiryDatesPe from "./ExpiryDatesPe";

export default function PeCard(){

  const [PeSymbolSelected, setPeSymbolSelected] = useState("");
  const [PeStrikePriceSelected, setPeStrikePriceSelected] = useState(null);

  const [SelectedQuantity, setSelectedCeQuantity] = useState("");


  /* getting the thursday dates */

  function getNextThursdays() {
    const today = new Date();
    const daysUntilNextThursday = (4 - today.getDay() + 7) % 7;
    const nextThursdays = [];

    for (let i = 0; i < 3; i++) {
      const nextThursday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + daysUntilNextThursday + i * 7
      );
      nextThursdays.push(nextThursday);
    }

    return nextThursdays;
  }
/* CHECK LAST THURSDAY OF THE MONTH */
  const isLastThursdayOfMonth = (date) => {
    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    const lastThursday = new Date(nextMonth);
    lastThursday.setDate(lastThursday.getDate() - 1);
    while (lastThursday.getDay() !== 4) {
      lastThursday.setDate(lastThursday.getDate() - 1);
    }
    return (
      date.getMonth() === lastThursday.getMonth() &&
      date.getDate() === lastThursday.getDate()
    );
  };

  /* GENERATING SYMBOL FUNCTION  */
  const generateSymbol = (PeStrikePriceSelected) => {
    const SelectedExpiryDate = new Date(
      document.getElementById("callstrike").value
    );
    const StrikePriceCeSelected = PeStrikePriceSelected;

    const year = selectedExpiryDate.getFullYear().toString().substr(-2);
    const monthMap = {
      Jan: "1",
      Feb: "2",
      Mar: "3",
      Apr: "4",
      May: "5",
      Jun: "6",
      Jul: "7",
      Aug: "8",
      Sep: "9",
      Oct: "O",
      Nov: "N",
      Dec: "D",
    };
    const month = isLastThursdayOfMonth(selectedExpiryDate)
      ? SelectedExpiryDate
          .toLocaleString("default", { month: "short" })
          .toUpperCase()
      : monthMap[
          SelectedExpiryDate.toLocaleString("default", { month: "short" })
        ];
    const day = SelectedExpiryDate.getDate().toString().padStart(2, "0");

    const isLastThursday = isLastThursdayOfMonth(SelectedExpiryDate);

    // GENERATE SYMBOL CHECKING WHETHER LAST THURSDAY OR NOT
    let TradingSymbol;
    const OptionType = "PE";
    const SymbolName = "NIFTY"
    const Strike = StrikePricePeSelected;
    if (isLastThursday) {
      
      TradingSymbol = `${SymbolName}${year}${month}${Strike}${OptionType}`;


    } else {

      TradingSymbol = `${SymbolName}${year}${month}${day}${strike}${OptionType}`;
    }

    return TradingSymbol;
  };

  /* FUNCTION FOR BUY BUTTON CLICKING */

  async function handleBuyBtClick() {
    try {

      const Symbol = generateSymbol(PeStrikePriceSelected);
      setPeSymbolSelected(Symbol);

      const SelectedQty = document.getElementById("QPe").value;
      const QTY = parseInt(SelectedQuantity) * 50; // Multiply selected quantity by 50
      setSelectedCeQty(QTY);

      const CheckBoxForOrderType = document.getElementById("LIMIT");
      const OrderType = CheckBoxForOrderType.checked ? "MARKET" : "NRML";
      const LimitPrice = CheckBoxForOrderType.checked
        ? parseFloat(document.getElementById("LimitPrice").value)
        : 0;

     const OrderData = {
      "exchange" : "NFO",
      "tradingsymbol" : Symbol ,
      "transaction_type" : "BUY",
      "quantity" : QTY,
      "product" : "MIS",
      "order_type" : OrderType,
      "validity" : "DAY",
      "price" : LimitPrice,
      }
      const response = await fetch('http://localhost:5000/api/buyOrderPe',{
        method : 'POST',
        headers : {
          'Content-Type' : ' application/json',
        },
        body : JSON.stringify(OrderData),//pass thr variety value if needed
      });
      
      if (response.ok){
        const data = await response.json();
        console.log(data.message);//output the server response
      } else {
        console,error('Error placing the order:', response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSellBtClick() {
    try {
      
      const CheckBoxForOrderTypeSell = document.getElementById("LimitPriceSellCheckbox");
      const OrderTypeSell = CheckBoxForOrderTypeSell .checked ? "MARKET" : "NRML";

      const LimitPriceSell = CheckBoxForOrderTypeSell .checked
        ? parseFloat(document.getElementById("LimitPriceSellCheckbox").value)
        : 0;

      const orderData = {
        "exchange" : "NFO",
      "tradingsymbol" : PeSymbolSelected,
      "transaction_type" : "SELL",
      "quantity" : SelectedQuantity,
      "product" : "MIS",
      "order_type" : OrderTypeSell,
      "validity" : "DAY",
      "price" : LimitPriceSell,
      };
      const response = await fetch('http://localhost:5000/api/sellOrderPe',{
        method : 'POST',
        headers : {
          'Content-Type' : ' application/json',
        },
        body : JSON.stringify(OrderData),//pass thr variety value if needed
      });
      
      if (response.ok){
        const data = await response.json();
        console.log(data.message);//output the server response
      } else {
        console.error('Error placing the order:', response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  }
    return(
        <div>
            <h1 className="PeHeading">PE</h1>
            <label className="ExpLabel" htmlFor="PeStrikePrice">
        EXP
      </label>
      <label className="QtyLabel" htmlFor="PeStrikePrice">
        QTY:
      </label>
      <QuantityPe/>
      <ExpiryDatesPe nextThursdays={getNextThursdays()} />
      <label className="StrikePrice" htmlFor="PeStrikePricePop">
        CE STRIKE
      </label>
      {/* BUY LIMIT */}
      <label for="LimitCB" className="LabelForLimit">
        LIMIT
      </label>
      <input type="checkbox" id="LimitPriceCheckBox" name="LimitCB"></input>
      <input type="number" id="LimitPrice" name="LimitP"></input>
      {/* SELL LIMIT */}
      <label for="LimitSellCB" className="LabelForLimitSell">
        LIMIT
      </label>
      <input type="checkbox" id="LimitPriceCheckBox" name="LimitSCB"></input>
      <input type="number" id="LimitPriceSell" name="LimitPS"></input>
      <label className="PeStopLossLabel" htmlFor="PeStopLossLabel">
          SL
        </label>
            <button className="SellButtonPe" onClick={handleBuyBtClick}>
        BUY
      </button>
      
      <button className="SellButtonPe" onClick={handleSellBtClick}>
        SELL
      </button>
        </div>
    )
}