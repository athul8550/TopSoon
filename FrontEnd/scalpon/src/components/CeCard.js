import React, { useState, useEffect } from "react";
import "./CeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CeCard(){
    return(
        <div>
          <button className="BuyButtonCe" onClick={handleBuyBtClick}>
        BUY
      </button>  
        </div>
    )
}