import React, { useState, useEffect } from "react";
import "./PeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PeCard(){

  const [PeSymbolSelected, setPeSymbolSelected] = useState("");
  const [PeStrikePriceSelected, setPeStrikePriceSelected] = useState(null);


  /* FUNCTION FOR BUY BUTTON CLICKING */


  async function handleBuyBtClick() {
    try {

      const Symbol = generateSymbol(PeStrikePriceSelected);
      setPeSymbolSelected(Symbol);

     const OrderData = {
      "exchange" : "NFO",
      "tradingsymbol" : "RELIANCE",
      "transaction_type" : "BUY",
      "quantity" : 1,
      "product" : "MIS",
      "order_type" : "MARKET",
      "validity" : "DAY",
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
      <label className="StrikePrice" htmlFor="PeStrikePricePop">
        CE STRIKE
      </label>
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