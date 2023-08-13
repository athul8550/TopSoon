const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const ExcelJS = require('exceljs');
const app = express();
const server = http.createServer(app);
var KiteTicker = require("kiteconnect").KiteTicker; 
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your frontend origin
        methods: ["GET", "POST"],
        credentials: true
    }
});
const PORT = 5000;

// Use the cors middleware to allow requests from all origins
app.use(cors());
app.use(express.json()); // Add this line to parse JSON data in the request body


//CREDIENTIALS

var api_key = "qgb9iz5siyr6fx96",
    secret = "bmr6xa1ksoeilq7uz06acka31mrlgow8",
    request_token = "K4xCg7YC8I4xR2vxucJqKHf2igfUw5CZ",
    access_token = "9LuQ11NHWgk9mSYiJitDq2kpjyY4Fi41";

//FOR HTTP REQUESTS

var KiteConnect = require("kiteconnect").KiteConnect;
var options = {
    "api_key": api_key,
    "debug": false
};
let kc = new KiteConnect(options);

//FOR WEBSOCKET
var ticker = new KiteTicker({
    api_key: api_key,
    access_token: access_token
});





async function generateAccessToken() {
    if (!access_token) {
        try {
            const response = await kc.generateSession(request_token, secret);
            console.log("Response", response);
            access_token = response.access_token;
            kc.setAccessToken(access_token);
            console.log(access_token);
        } catch (err) {
            console.log(err);
        }
    } else {
        kc.setAccessToken(access_token);
    }
}

(async () => {
    try {
        await generateAccessToken();

        app.post('/api/buyOrderCe', async (req, res) => {
            try {
                
                const response = await kc.orderMargins([{
                    "exchange": "NSE",
                    "tradingsymbol": "RELIANCE",
                    "transaction_type": "BUY",
                    "variety": "regular",
                    "product": "MIS",
                    "order_type": "MARKET",
                    "quantity": 75
                }],"compact");
                console.log(response);


        

        res.json({ message: response });
            } catch (err) {
                console.log(err);
                res.status(500).json({ error: 'Error placing the order.' });
            }
        });

        app.post('/api/buyOrderCe1', async (req, res) => {
            try {
                const orderDataBuy = req.body; // Access the JSON data sent from the frontend

                const response = await BuyOrderCe(orderDataBuy);
                console.log('Order placed successfully.');
                res.json({ message: response });
            } catch (err) {
                console.log(err);
                res.status(500).json({ error: 'Error placing the order.' });
            }
        });
        app.post('/api/sellOrderCe', async (req, res) => {
            try {
                const orderDataSell = req.body; // Access the JSON data sent from the frontend

                const response = await SellOrderCe(orderDataSell);
                console.log('Order placed successfully.');
                res.json({ message: response });
            } catch (err) {
                console.log(err);
                res.status(500).json({ error: 'Error placing the order.' });
            }
        });


        async function BuyOrderCe(orderDataBuy) {
            try {
                script = orderDataBuy.tradingsymbol
                qty = orderDataBuy.quantity
                orderType = orderDataBuy.order_type
                priceLimit = orderDataBuy.price

                console.log('Received order data:', orderDataBuy);

                const orderDataObject = {
                    "exchange": "NFO",
                    "tradingsymbol": script,
                    "transaction_type": "BUY",
                    "quantity": qty,
                    "product": "MIS",
                    "order_type": orderType,
                    "validity": "DAY"
                };

                // Add "price" property only if orderType is "NRML"
                if (orderType === "NRML") {
                    orderDataObject.price = priceLimit;
                }
                console.log('Received order data:', orderDataObject);

                await kc.placeOrder("regular", orderDataObject);

            } catch (err) {
                console.log(err);
            }
        }
        async function SellOrderCe(orderDataSell) {
            try {
                script = orderDataSell.tradingsymbol
                qty = orderDataSell.quantity
                orderType = orderDataSell.order_type
                priceLimit = orderDataSell.price


                console.log('Received order data:', orderDataSell);

                const orderDataObject = {
                    "exchange": "NFO",
                    "tradingsymbol": script,
                    "transaction_type": "BUY",
                    "quantity": qty,
                    "product": "MIS",
                    "order_type": orderType,
                    "validity": "DAY"
                };

                // Add "price" property only if orderType is "NRML"
                if (orderType === "NRML") {
                    orderDataObject.price = priceLimit;
                }
                console.log('Received order data:', orderDataObject);

                await kc.placeOrder("regular", orderDataObject);
                

            } catch (err) {
                console.log(err);
            }
        }

        io.on('connection', (socket) => {

            console.log('CONNECTED');

            // Emit data to clients at an interval
            const interval = setInterval(async () => {
                try {
                    function subscribe() {
                        var items = [256265];
                        ticker.subscribe(items);
                        ticker.setMode(ticker.modeQuote, items);
                    }

                    function websocket(ticks) {

                        setInterval(async () => {
                            try {
                                console.log(ticks);
                                // Emit the fetched data to clients
                                socket.emit('dataNiftyCeUpdate', ticks);
                                
                            }
                            catch (err) {
                                console.log('Error fetching data:', err);
                            }
                        },1000);
                    }
                    ticker.connect();
                    ticker.on("ticks", websocket);
                    ticker.on("connect", subscribe);
                        
                } catch (err) {
                    console.log('Error fetching data:', err);
                }
            }, 1000); // Emit data every 5 seconds

            // Emit data2 to clients at an interval
            const interval2 = setInterval(async () => {
                try {
                    function subscribe2() {
                        var items = [256265];
                        ticker.subscribe(items);
                        ticker.setMode(ticker.modeQuote, items);
                    }

                    function websocket2(ticks) {

                        setInterval(async () => {
                            try {
                                console.log(ticks);
                                // Emit the fetched data to clients
                                socket.emit('dataNiftyUpdate', ticks);
                                
                            }
                            catch (err) {
                                console.log('Error fetching data:', err);
                            }
                        },1000);
                    }
                    ticker.connect();
                    ticker.on("ticks", websocket2);
                    ticker.on("connect", subscribe2);
                        
                } catch (err) {
                    console.log('Error fetching data:', err);
                }
            }, 1000); // Emit data every 5 seconds

            socket.on('disconnect', () => {
                clearInterval(interval); // Stop emitting data when the client disconnects
                console.log('A client disconnected');
            });
        });
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });


    } catch (err) {
        console.error('Error generating access token:', err);
    }
})();
