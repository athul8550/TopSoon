import React, { useState, useEffect } from "react";
import "./CeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CeCard(){
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