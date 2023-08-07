import React, { useState, useEffect } from "react";
import "./CeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuantityCe from "./QuantityCe";

export default function CeCard(){

  const [CeSymbolSelected, setCeSymbolSelected] = useState("");
  const [CeStrikePriceSelected, setCeSTrikePriceSelected] = useState(null);

  const [SelectedQuantity, setSelectedQuantity] = useState("");

  const [SelectedOrderType, setSelectedOrderType] = useState("");


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

      const SelectedQty = document.getElementById("QCe").value;
      const QTY = parseInt(SelectedQty) * 50;
      setSelectedQuantity(QTY);

      const CheckBoxForOrderType = document.getElementById("LimitPriceCheckBox");
      const OrderType = CheckBoxForOrderType.checked ? "MARKET" : "NRML";
      
      const LimitPrice = CheckBoxForOrderType.checked
        ? parseFloat(document.getElementById("LimitPrice").value)
        : 0;

      const OrderData = {
        "exchange": "NFO",
        "tradingsymbol": Symbol ,
        "transaction_type": "BUY",
        "quantity": QTY , 
        "product": "MIS",
        "order_type": OrderType,
        "validity": "DAY",
        "price" : LimitPrice,
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSellBtClick() {
    try {
      
      const CheckBoxForOrderTypeSell = document.getElementById("LimitPriceSellCheckBox");
      const OrderTypeSell = CheckBoxForOrderTypeSell.checked ? "MARKET" : "NRML";
      
      const LimitPriceSell = CheckBoxForOrderTypeSell.checked
        ? parseFloat(document.getElementById("LimitPriceSell").value)
        : 0;

      const OrderData = {
        "exchange": "NFO",
        "tradingsymbol": CeSymbolSelected ,
        "transaction_type": "SELL",
        "quantity": SelectedQuantity , 
        "product": "MIS",
        "order_type": OrderTypeSell,
        "validity": "DAY",
        "price" : LimitPriceSell,
      };
      
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
      <QuantityCe />
      <label className="StrikePrice" htmlFor="CeStrikePricePop">
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
      <input type="checkbox" id="LimitPriceSellCheckBox" name="LimitSCB"></input>
      <input type="number" id="LimitPriceSell" name="LimitPS"></input>
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