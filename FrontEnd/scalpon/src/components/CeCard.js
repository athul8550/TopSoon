import React, { useState, useEffect } from "react";
import "./CeCard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuantityCe from "./QuantityCe";
import ExpiryDatesCe from "./ExpiryDatesCe";
import socketIOClient from "socket.io-client";

export default function CeCard(){
  const socket = socketIOClient("http://localhost:5000");

  const [CeSymbolSelected, setCeSymbolSelected] = useState("");
  const [CeStrikePriceSelected, setCeSTrikePriceSelected] = useState(null);

  const [SelectedQuantity, setSelectedQuantity] = useState("");

  const [NiftyCeData, setNiftyCeData] = useState(null);

  const [startTrue, setStartTrue] = useState(null);
  const [dayPnl, setDayPnl] = useState(null);
  const [BrokeragePnl, setBrokeragePnl] = useState(null);

  
  /* GETTING THURSDAY DATES */

  function getNextThursdays() {
    const today = new Date();
    const daysUntilNextThursday = (4 - today.getDay() + 7) % 7;
    const nextThursdays = [];

    for (let i = 0; i < 3; i++) {
      const nextThursday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + daysUntilNextThursday + i * 7
      );
      nextThursdays.push(nextThursday);
    }

    return nextThursdays;
  }
  /* CHECK LAST THURSDAY OF THE MONTH */
  const isLastThursdayOfMonth = (date) => {
    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    const lastThursday = new Date(nextMonth);
    lastThursday.setDate(lastThursday.getDate() - 1);
    while (lastThursday.getDay() !== 4) {
      lastThursday.setDate(lastThursday.getDate() - 1);
    }
    return (
      date.getMonth() === lastThursday.getMonth() &&
      date.getDate() === lastThursday.getDate()
    );
  };


  /* GENERATING SYMBOL FUNCTION */
  
  const generateSymbol = (CeStrikePriceSelected) => {
    const StrikePriceCeSelected = CeStrikePriceSelected;
    const SelectedExpiryDate = new Date(
      document.getElementById("callstrike").value
    );

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
      const OrderType = CheckBoxForOrderType.checked ? "NRML" : "MARKET";
      
      const LimitPrice = CheckBoxForOrderType.checked
        ? parseFloat(document.getElementById("LimitPrice").value)
        : 0.0;

      const OrderData = {
        "exchange": "NFO",
        "tradingsymbol": Symbol ,
        "transaction_type": "BUY",
        "quantity": QTY, 
        "product": "MIS",
        "order_type": OrderType,
        "validity": "DAY",
        "price" : LimitPrice,
      }
      console.log(OrderData);
      const response = await fetch('http://localhost:5000/api/buyOrderCe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(OrderData), // Pass the variety value if needed
      });

      if (response) {
        const data = await response.json();
        console.log(data.message); // Output the server response
        setStartTrue(true);
      } else {
        console.error('Error placing the order:', response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSellBtClick() {
    try {
      
      const CheckBoxForOrderTypeSell = document.getElementById("LimitPriceSellCheckBox");
      const OrderTypeSell = CheckBoxForOrderTypeSell.checked ? "NRML" : "MARKET" ;
      
      const LimitPriceSell = CheckBoxForOrderTypeSell.checked
        ? parseFloat(document.getElementById("LimitPriceSell").value)
        : 0.0;

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
      const response = await fetch('http://localhost:5000/api/sellOrderCe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(OrderData), // Pass the variety value if needed
      });

      if (response) {
        const data = await response.json();
        console.log(data.message); // Output the server response
        setStartTrue(false);
        
      } else {
        console.error('Error placing the order:', response.statusText);
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchPnl(){
    try{
      if(startTrue){
        const response = await fetch('http://localhost:5000/api/buyOrderCe1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      const pnlWithBrokerage = responseData - 40;
      
      console.log(responseData);
      setDayPnl(responseData);
      setBrokeragePnl(pnlWithBrokerage);

      }
      
    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchPnl();
  },[NiftyCeData]);

  async function handleCheckBtClick() {
    try { 
      
      fetchPnl();
    }catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const socket = socketIOClient("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("dataNiftyCeUpdate", (NiftyCeData) => {
      console.log("Received data update:", NiftyCeData[0].last_price);
      setNiftyCeData(NiftyCeData[0].last_price)
      // Handle your data here
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection when the component unmounts
    };
  }, []);

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
      <ExpiryDatesCe nextThursdays={getNextThursdays()} />
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
      <button className="BuyButtonCe" onClick={handleCheckBtClick}>
        Check
      </button> 
      <div>
        <h1>TOTAL PNL</h1>
        <h2>{dayPnl}</h2>
        <h1>BROKERAGE PNL</h1>
        <h2>{BrokeragePnl}</h2>
        </div>
      <div>
      {/* Display the fetched data */}
      {NiftyCeData && (
        <div>
          <h1>NIFTY CE LTP</h1>
          <h2>{NiftyCeData}</h2>
        </div>
      )}
      {/* Rest of your component UI */}
    </div>
        </div>
    )
}