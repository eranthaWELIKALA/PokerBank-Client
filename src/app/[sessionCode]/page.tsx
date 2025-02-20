"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Toaster, toast } from "react-hot-toast";

export default function EnterNamePage() {
    const router = useRouter();
    const params = useParams();
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionCode, setSessionCode] = useState<string | null>(null); // State to store sessionCode

    const handleNameSubmit = useCallback(
        async (name: string) => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/join-session`,
                    {
                        sessionCode,
                        playerName: name,
                    }
                );

                if (response.data.playerId) {
                    const session = {
                        id: response.data.playerId,
                        name: name,
                        sessionCode,
                    };
                    localStorage.setItem(
                        "session_data",
                        JSON.stringify(session)
                    );
                    toast.success("Joined session! Redirecting...");
                    setTimeout(() => {
                        router.push(`/game/${sessionCode}`); // Navigate to game board
                    }, 2000);
                } else {
                    toast.error("Registration failed. Please try again.");
                }
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    if (err.status == axios.HttpStatusCode.NotFound) {
                        toast.error("Invalid session id! Redirecting...");
                        setTimeout(() => {
                            router.push("/");
                        }, 2000);
                    }
                } else {
                    toast.error("Failed to register player.");
                }
            } finally {
                setLoading(false);
            }
        },
        [router, sessionCode]
    );

    const handleSubmit = () => {
        if (!playerName) {
            toast.error("Please enter your name to continue.");
            return;
        }
        handleNameSubmit(playerName); // Submit the player name
    };

    useEffect(() => {
        // If params is async, we need to handle it properly
        const fetchParams = () => {
            const { sessionCode } = params;
            setSessionCode(sessionCode as string);
        };

        fetchParams();
    }, [params]);

    useEffect(() => {
        if (!sessionCode) return; // Only proceed if sessionCode is available

        // If there's already a name stored in localStorage, auto-submit
        const storedSessionData = localStorage.getItem("session_data");
        if (storedSessionData) {
            const session = JSON.parse(storedSessionData);
            if (session.sessionCode == sessionCode) {
                setPlayerName(session.name);
                handleNameSubmit(session.name);
            }
        }
    }, [sessionCode, handleNameSubmit]);

    if (!sessionCode) return <p>Loading session...</p>; // Show loading message until sessionCode is set

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
            <Toaster position="top-center" reverseOrder={false} />
            <h2>Play Poker</h2>

            <label htmlFor="playerName">Enter your Name:</label>
            <input
                type="text"
                id="playerName"
                value={playerName || ""}
                onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Name"}
            </button>

            {error && <p className="error">{error}</p>}
        </div>
    );
}
