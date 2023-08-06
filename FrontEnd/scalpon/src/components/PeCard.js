import React, { useState, useEffect } from "react";
import "./PeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PeCard(){
    return(
        <div>
            <button className="SellButtonPe" onClick={handleBuyBtClick}>
        BUY
      </button>
        </div>
    )
}