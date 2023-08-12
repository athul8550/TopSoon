const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 5000;

// Use the cors middleware to allow requests from all origins
app.use(cors());
app.use(express.json()); // Add this line to parse JSON data in the request body

var KiteConnect = require("kiteconnect").KiteConnect;

var api_key = "qgb9iz5siyr6fx96",
    secret = "bmr6xa1ksoeilq7uz06acka31mrlgow8",
    request_token = "TvTrPhIZIOR3o8M3lzrAesIFI0jr0Ngc",
    access_token = "0tA1BrFvY11IbES2Im7fWZqdKr9M74U0";

var options = {
    "api_key": api_key,
    "debug": false
};

let kc = new KiteConnect(options);

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
                script=orderDataBuy.tradingsymbol
                qty = orderDataBuy.quantity
                orderType =  orderDataBuy.order_type
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
                script=orderDataSell.tradingsymbol
                qty = orderDataSell.quantity
                orderType =  orderDataSell.order_type
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

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Error generating access token:', err);
    }
})();
 