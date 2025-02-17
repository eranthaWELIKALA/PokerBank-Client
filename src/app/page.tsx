"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client"; // Import socket.io-client
import CoinPot from "@/components/CoinPot/CoinPot";
import PointTable from "@/components/PointTable/PointTable";
import BettingTable from "@/components/BettingTable/BettingTable";

const socket = io("http://localhost:3000"); // Connect to your backend server

export default function Home() {
    const [bet, setBet] = useState(0);
    const [pot, setPot] = useState(100); // Initial pot value
    const [pointTable, setPointTable] = useState([
        { id: 1, name: "Erantha", coins: 10 },
        { id: 2, name: "Dinushi", coins: 20 },
        { id: 3, name: "Kavindu", coins: 30 },
        { id: 4, name: "Shehan", coins: 40 },
        { id: 5, name: "Rochana", coins: 50 },
    ]);
    const [pointLine, setPointLine] = useState<number>(3);

    // Listen for pot updates
    useEffect(() => {
        socket.on("pot-update", (newPotValue: number) => {
            setPot(newPotValue); // Update the pot when a pot-update event is received
        });

        // Listen for point-table updates
        socket.on("point-table-update", (newPointTable: any[]) => {
            setPointTable(newPointTable); // Update the point table with the new data
        });

        // Cleanup when the component unmounts
        return () => {
            socket.off("pot-update");
            socket.off("point-table-update");
        };
    }, []);

    const canEnableBets = true; // Change this based on game logic or user interaction

    const placeBet = (amount: number) => {
        if (canEnableBets) {
            setBet((prevBet) => prevBet + amount);
            // Send the bet event to the backend with the selected bet value
            socket.emit("bet", { amount: bet + amount }); // Send bet to backend
        }
    };

    return (
        <div className="App">
            <CoinPot coins={pot} />
            <BettingTable
                bet={bet}
                placeBet={placeBet}
                canEnableBets={canEnableBets}
            />
            <PointTable pointTable={pointTable} pointLine={pointLine} />

            {/* You can add controls to update the pointLine */}
            <button onClick={() => setPointLine(2)}>
                Set PayLine to Line 2
            </button>
        </div>
    );
}
