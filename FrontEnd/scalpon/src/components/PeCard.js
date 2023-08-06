import React, { useState, useEffect } from "react";
import "./PeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PeCard(){
    return(
        <div>
            <h1 className="PeHeading">PE</h1>
            <button className="SellButtonPe" onClick={handleBuyBtClick}>
        BUY
      </button>
      <button className="SellButtonPe" onClick={handleSellBtClick}>
        SELL
      </button>
        </div>
    )
}