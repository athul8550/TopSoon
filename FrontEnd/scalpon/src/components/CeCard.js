import React, { useState, useEffect } from "react";
import "./CeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CeCard(){

  const [CeSymbolSelected, setCeSymbolSelected] = useState("");
  const [CeStrikePriceSelected, setCeSTrikePriceSelected] = useState(null);


  /* GENERATING SYMBOL FUNCTION */
  
  const generateSymbol = (CeStrikePriceSelected) => {
    const SelectedExpiryDate = new Date(
      document.getElementById("callstrike").value
    );
    const StrikePriceCeSelected = CeStrikePriceSelected;

    const year = SelectedExpiryDate.getFullYear().toString().substr(-2);
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
    const month = isLastThursdayOfMonth(SelectedExpiryDate)
      ? SelectedExpiryDate
          .toLocaleString("default", { month: "short" })
          .toUpperCase()
      : monthMap[
          SelectedExpiryDate.toLocaleString("default", { month: "short" })
        ];
    const day = SelectedExpiryDate.getDate().toString().padStart(2, "0");

    const isLastThursday = isLastThursdayOfMonth(SelectedExpiryDate);

    // GENERATE SYMBOL CHECKING WHETHER LAST THURSDAY OR NOT
    let TradingSymbol ;
    const OptionType = "CE";
    const SymbolName = "NIFTY"
    const Strike = StrikePriceCeSelected;
    if (isLastThursday) {

       TradingSymbol = `${SymbolName}${year}${month}${Strike}${OptionType}`;

    } else {
       TradingSymbol = `${SymbolName}${year}${month}${day}${Strike}${OptionType}`;
    }

    return TradingSymbol;
  };

  /* FUNCTION FOR BUY BUTTON CLICKING */

  async function handleBuyBtClick() {
    try {

      const Symbol = generateSymbol(CeStrikePriceSelected);
      setCeSymbolSelected(Symbol);

      const OrderData = {
        "exchange": "NFO",
        "tradingsymbol": Symbol ,
        "transaction_type": "BUY",
        "quantity": 1, 
        "product": "MIS",
        "order_type": "MARKET",
        "validity": "DAY",
      }
    } catch (error) {
      console.log(error);
    }
  }
    return(
        <div>
          <h1 className="CeHeading">CE</h1>
          <label className="ExpLabel" htmlFor="CeStrikePrice">
        EXP
      </label>
      <label className="QtyLabel" htmlFor="CeStrikePrice">
        QTY:
      </label>
      <label className="StrikePrice" htmlFor="CeStrikePricePop">
        CE STRIKE
      </label>
      <label className="CeStopLossLabel" htmlFor="CeStopLossLabel">
          SL
        </label>
          <button className="BuyButtonCe" onClick={handleBuyBtClick}>
        BUY
      </button> 
      <button className="SellButtonCe" onClick={handleSellBtClick}>
        SELL
      </button> 
        </div>
    )
}