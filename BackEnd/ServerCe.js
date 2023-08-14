const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
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
    request_token = "VqNrTK3715hIIDNG2Kd8bg2LB9992KjX",
    access_token = "QIf5Nu72tGq2Hk0IRjmBVH7txQKiXDsx";

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

        app.post('/api/buyOrderCe1', async (req, res) => {
            try {
                

                const response = await kc.getPositions();
                const dayPnl = (response.day[0].pnl).toFixed(2);
                console.log(dayPnl);
                res.json(dayPnl);
            } catch (err) {
                console.log(err);
                res.status(500).json({ error: 'Error placing the order.' });
            }
        });



        app.post('/api/buyOrderCe', async (req, res) => {
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
                    "exchange": "NSE",
                    "tradingsymbol": "ZOMATO",
                    "transaction_type": "BUY",
                    "quantity": 1,
                    "product": "MIS",
                    "order_type": "LIMIT",
                    "validity": "DAY",
                    "price" : "90.00"
                };

                // Add "price" property only if orderType is "NRML"
                if (orderType === "NRML") {
                    orderDataObject.price = priceLimit;
                }
                console.log('Received order data:', orderDataObject);

                const response = await kc.placeOrder("regular", orderDataObject);
                console.log(response);
                
                

            } catch (err) {
                console.log(err);
            }
        }

        io.on('connection', (socket) => {

            

            // Emit data to clients at an interval
            const interval = setInterval(async () => {
                try {
                    function subscribe() {
                        var items = [65883655];
                        ticker.subscribe(items);
                        ticker.setMode(ticker.modeQuote, items);
                    }

                    function websocket(ticks) {
                        ltpTicks = ticks;
                        ltp = ticks[0].last_price;
                        socket.emit('dataNiftyUpdate', ticks);
                        

                    }
                    ticker.connect();
                    ticker.on("ticks", websocket);
                    ticker.on("connect", subscribe);
                        
                } catch (err) {
                    console.log('Error fetching data:', err);
                }
            },1000); // Emit data every 5 seconds

           
            

            // Emit data2 to clients at an interval
            const interval2 = setInterval(async () => {
                try {
                    function subscribe2() {
                        var items = [65883655];
                        ticker.subscribe(items);
                        ticker.setMode(ticker.modeQuote, items);
                    }

                    function websocket2(ticks) {
                        ltpTicks = ticks;
                        ltp = ticks[0].last_price;
                        socket.emit('dataNiftyCeUpdate', ticks);
                        
                    }
                    ticker.connect();
                    ticker.on("ticks", websocket2);
                    ticker.on("connect", subscribe2);
                        
                } catch (err) {
                    console.log('Error fetching data:', err);
                }
            }, 1000); // Emit data every 5 seconds

            socket.on('disconnect', () => {
                clearInterval(interval); // Clear the interval when the client disconnects
                clearInterval(interval2); 
              });

            
        });
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });


    } catch (err) {
        console.error('Error generating access token:', err);
    }
})();
