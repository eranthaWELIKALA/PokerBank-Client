"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import the useRouter hook

export default function Home() {
    const [coinValue, setCoinValue] = useState<number>(100); // Default initial coin value
    const [sessionCode, setSessionCode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Initialize the router

    const startSession = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/start-session`, // Server call for session creation
                {
                    initialCoins: coinValue,
                }
            );

            setSessionCode(response.data.sessionCode); // Example: { sessionCode: "19501" }
        } catch {
            setError("Failed to start session");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (sessionCode) {
            const clientUrl = `${window.location.origin}/${sessionCode}`; // Create the session URL
            navigator.clipboard.writeText(clientUrl);
            alert("Session URL copied!");
        }
    };

    const navigateToSession = () => {
        if (sessionCode) {
            // Programmatically navigate to the session page
            router.push(`/${sessionCode}`);
        }
    };

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <h2>Start Poker Session</h2>

            <label>Enter Initial Coin Value:</label>
            <input
                min={100}
                max={1000}
                type="number"
                value={coinValue}
                onChange={(e) => setCoinValue(Number(e.target.value))}
            />

            <button onClick={startSession} disabled={loading}>
                {loading ? "Starting..." : "Start Session"}
            </button>

            {error && <p className="error">{error}</p>}

            {sessionCode && (
                <div className="component-container">
                    <div className="credits credits--wide">
                        <div className="session-code-box">
                            <p className="hud-title">
                                Session Code: <span>{sessionCode}</span>
                            </p>
                            <button
                                onClick={copyToClipboard}
                                className="copy-button"
                            >
                                Copy Session Link
                            </button>
                            <button
                                onClick={navigateToSession}
                                className="navigate-button"
                            >
                                Navigate to Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
