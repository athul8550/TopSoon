import React, { useState, useEffect } from "react";
import "./PeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuantityPe from "./QuantityPe";

export default function PeCard(){

  const [PeSymbolSelected, setPeSymbolSelected] = useState("");
  const [PeStrikePriceSelected, setPeStrikePriceSelected] = useState(null);

  const [SelectedQuantity, setSelectedCeQuantity] = useState("");


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
      const OrderType = checkbox.checked ? "MARKET" : "NRML";
      const LimitPrice = checkbox.checked
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
      <label className="StrikePrice" htmlFor="PeStrikePricePop">
        CE STRIKE
      </label>
      <label for="LIMIT" className="labellimit">
        LIMIT
      </label>
      <input type="checkbox" id="LimitPriceCheckBox" name="LimitCB"></input>
      <input type="number" id="LimitPrice" name="LimitP"></input>
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