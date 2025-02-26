import React, { useEffect, useState } from "react";
import { webSocket } from "rxjs/webSocket";
import {map, retry} from "rxjs/operators";
import {timer} from "rxjs";

const SOCKET_URL = "ws://localhost:4000"; //TODO change to PROD

const CryptoPrices: React.FC = () => {
    const [prices, setPrices] = useState<Record<string, number>>({
        "BTC/USD": 0,
        "ETH/USD": 0,
        "SOL/USD": 0,
    });

    useEffect(() => {
        const wsCrypto = webSocket(SOCKET_URL).pipe(
            retry({
                delay: (retryCount) => {
                    console.log(`Retry attempt #${retryCount}`);
                    return timer(5000);
                }
                }
            ),
            map((data: any) => data)
        );

        const subscription = wsCrypto.subscribe({
            next: marketData => setPrices(marketData),
            error: (error) => console.error("WebSocket error:", error),
            complete: () => console.log('complete')
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(prices).map(([symbol, price]) => (
                    <div key={symbol} className="bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl p-6 hover:shadow-3xl transition-shadow duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{symbol}</h2>
                        <p className="text-4xl text-green-600 font-semibold">${parseFloat(String(price)).toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CryptoPrices;
