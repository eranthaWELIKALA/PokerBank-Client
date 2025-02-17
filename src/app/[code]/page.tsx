'use client'; // Client-side component directive

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router in App Router

const JoinSession = () => {
    const [name, setName] = useState<string>("");
    const [sessionCode, setSessionCode] = useState<string>("");
    const router = useRouter();

    const handleJoinSession = async () => {
        const response = await fetch(`/api/sessions/${sessionCode}/join`, {
            method: "POST",
            body: JSON.stringify({ name }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            router.push(`/game/${sessionCode}`);  // Navigates to the game page using App Router
        } else {
            alert("Failed to join session");
        }
    };

    return (
        <div>
            <h1>Join Poker Game</h1>
            <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                placeholder="Session Code"
            />
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
            />
            <button onClick={handleJoinSession}>Join Game</button>
        </div>
    );
};

export default JoinSession;
