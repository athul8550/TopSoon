import React, { useState, useEffect } from "react";
import "./CeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CeCard(){

  

  /* FUNCTION FOR BUY BUTTON CLICKING */

  async function handleBuyBtClick() {
    try {
      const OrderData = {
        "exchange": " NSE",
        "tradingsymbol": "RELIANCE",
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