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
          <button className="BuyButtonCe" onClick={handleBuyBtClick}>
        BUY
      </button> 
      <button className="SellButtonCe" onClick={handleSellBtClick}>
        SELL
      </button> 
        </div>
    )
}