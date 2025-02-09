const WebSocket = require("ws");
const express = require("express");

const PORT = process.env.PORT || 4000;
const KRAKEN_WS_URL = "wss://ws.kraken.com/v2";

const app = express();
const server = app.listen(PORT, () => {
    console.log(` Server is up and running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

const krakenSocket = new WebSocket(KRAKEN_WS_URL);

const clients = new Set();
const prices = {};

krakenSocket.on("open", () => {
    console.log("Connected to Kraken WebSocket");

    const subscribeMessage = {
        method: "subscribe",
        params: {
            channel: "ticker",
            symbol: ["BTC/USD", "ETH/USD", "SOL/USD"],
        },
    };
    krakenSocket.send(JSON.stringify(subscribeMessage));
});

krakenSocket.on("message", (data) => {
    try {
        const message = JSON.parse(data);
        const val = message?.data?.[0];

        if (val?.symbol && val?.ask) {
            prices[val.symbol] = val.ask;
        }
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(prices));
            }
        });
    } catch (error) {
        console.error("Kraken Message processing error:", error);
    }
});

wss.on("connection", (clientSocket) => {
    console.log("Client connected");
    clients.add(clientSocket);

    clientSocket.on("close", () => {
        console.log("Client disconnected");
        clients.delete(clientSocket);
    });

    clientSocket.on("error", (error) => {
        console.error("Client WebSocket error:", error);
    });
});

krakenSocket.on("error", (error) => {
    console.error("Kraken WebSocket error:", error);
});

krakenSocket.on("close", () => {
    console.log("Kraken WebSocket closed. Connection...");

    setTimeout(() => {
        krakenSocket = new WebSocket(KRAKEN_WS_URL);
    }, 5000);
});
