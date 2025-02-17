"use client"; // Mark this file as a client component

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Use useParams from next/navigation for App Router

interface Player {
    name: string;
    coins: number;
}

interface GameState {
    pot: number;
    players: Player[];
}

const GamePage = () => {
    const { code } = useParams(); // Use useParams to get the dynamic route parameter 'code'

    const [gameState, setGameState] = useState<GameState>({
        pot: 100,
        players: [
            { name: "Player 1", coins: 500 },
            { name: "Player 2", coins: 450 },
            { name: "Player 3", coins: 300 },
        ],
    });
    const [userAction, setUserAction] = useState<string | null>(null);

    // Fetch the game state
    useEffect(() => {
        if (!code) return;

        const fetchGameState = async () => {
            const response = await fetch(`/api/sessions/${code}`);
            const data = await response.json();
            setGameState(data);
        };

        fetchGameState();
    }, [code]);

    // Handle placing a bid
    const handleBid = async (bidAmount: number) => {
        const response = await fetch(`/api/sessions/${code}/bid`, {
            method: "POST",
            body: JSON.stringify({ bidAmount }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            setUserAction("bidding");
        }
    };

    // Handle folding the hand
    const handleFold = async () => {
        const response = await fetch(`/api/sessions/${code}/fold`, {
            method: "POST",
        });

        if (response.ok) {
            setUserAction("folded");
        }
    };

    return (
        <div>
            {gameState ? (
                <>
                    <h2>Poker Pot: {gameState.pot}</h2>
                    {gameState.players.map((player) => (
                        <div key={player.name}>
                            <span>
                                {player.name} - {player.coins} coins
                            </span>
                        </div>
                    ))}

                    {userAction ? (
                        <p>
                            {userAction === "folded"
                                ? "You folded"
                                : "You placed a bid"}
                        </p>
                    ) : (
                        <>
                            <button onClick={() => handleBid(10)}>
                                Bid 10
                            </button>
                            <button onClick={handleFold}>Fold</button>
                        </>
                    )}
                </>
            ) : (
                <p>Loading game...</p>
            )}
        </div>
    );
};

export default GamePage;
