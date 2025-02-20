"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { socket, SocketContext } from "@/context/socket";
import CoinPot from "@/components/CoinPot/CoinPot";
import PointTable from "@/components/PointTable/PointTable";
import BettingTable from "@/components/BettingTable/BettingTable";
import ConfirmModal from "@/components/Modals/ConfirmationModal";
import WithdrawModal from "@/components/Modals/WithdrawModal";

import { Toaster, toast } from "react-hot-toast";

type Player = {
    id: string;
    name: string;
    coins: number;
    currentBet: number;
    canBet: boolean;
};

enum BetAction {
    BET = "Bet",
    FOLD = "Fold",
    RAISE = "Raise",
    PASS = "Pass",
}

export default function Game() {
    const router = useRouter();
    const params = useParams();
    const [bet, setBet] = useState(0);
    const [action, setAction] = useState<string | null>(null);
    const [pot, setPot] = useState(100);
    const [pointTable, setPointTable] = useState<Player[]>([]);
    const [sessionCode, setSessionCode] = useState<string | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    useEffect(() => {
        const fetchParams = () => {
            const { sessionCode } = params;
            setSessionCode(sessionCode as string);
        };

        fetchParams();
    }, [params]);

    useEffect(() => {
        if (!sessionCode) return; // Only proceed if sessionCode is available

        const storedSessionData = localStorage.getItem("session_data");

        console.log(storedSessionData);
        if (storedSessionData) {
            const session = JSON.parse(storedSessionData);

            if (session) {
                setPlayer({
                    id: session.id,
                    name: session.name,
                    coins: 0,
                    currentBet: 0,
                    canBet: false,
                });
                setSessionCode(session.sessionCode);
            }
        } else {
            toast.error("Session not found! Redirecting...");
            setTimeout(() => {
                router.push("/");
            }, 2000);
        }
    }, [sessionCode, router]);

    // Listen for pot updates
    useEffect(() => {
        if (!socket || !sessionCode) return;

        socket.emit("board-loaded", { sessionCode: sessionCode });

        socket.on(
            "board-updated",
            ({
                players,
                potValue,
            }: {
                players: Player[];
                potValue: number;
            }) => {
                console.log(players);
                console.log(potValue);
                setPointTable(players);
                setPot(potValue);
                setPlayer(
                    (prevPlayer) =>
                        players.find(
                            (player) => player.id === prevPlayer?.id
                        ) || prevPlayer
                );
            }
        );

        socket.on("pot-update", (newPotValue: number) => {
            setPot(newPotValue); // Update the pot when a pot-update event is received
        });

        // Listen for point-table updates
        socket.on("point-table-update", (newPointTable: Player[]) => {
            setPointTable(newPointTable); // Update the point table with the new data
        });

        // Cleanup when the component unmounts
        return () => {
            socket.off("pot-update");
            socket.off("point-table-update");
        };
    }, [sessionCode]);

    useEffect(() => {
        if (!player) return;

        if (player.currentBet == 0) {
            if (bet == 0) setAction(BetAction.PASS);
            else setAction(BetAction.BET);
        } else if (player.currentBet > 0) {
            if (bet == 0) setAction(BetAction.FOLD);
            else setAction(BetAction.RAISE);
        }
    }, [bet, player]);

    const handleBetActionChange = () => {
        if (!socket || !player || !player.canBet) return;

        if (action && (action == BetAction.BET || action == BetAction.RAISE)) {
            if (player.coins - bet >= 0) {
                setPlayer((prevPlayer) => {
                    if (prevPlayer) prevPlayer.coins -= bet;
                    return prevPlayer;
                });
                socket.emit(
                    "bet",
                    {
                        sessionCode: sessionCode,
                        playerId: player.id,
                        amount: bet,
                    },
                    (player: Player) => {
                        setPlayer(player);
                        setBet(0);
                    }
                );
            }
        } else if (action == BetAction.FOLD) {
            setShowConfirmModal(true);
        }
    };

    const confirmFold = () => {
        setShowConfirmModal(false);
        if (player) {
            socket.emit(
                "fold",
                {
                    sessionCode: sessionCode,
                    playerId: player.id,
                },
                (player: Player) => {
                    setPlayer(player);
                    setBet(0);
                    setAction(null);
                }
            );
        }
    };

    const handleWithdraw = (amount: number) => {
        if (socket && sessionCode) {
            if (player) {
                socket.emit(
                    "withdraw",
                    { sessionCode: sessionCode, playerId: player.id, amount },
                    (newPotValue: number) => {
                        setPot(newPotValue);
                    }
                );
            }
        }
        setShowWithdrawModal(false);
    };

    const handleBetValueChange = (amount: number) => {
        if (!socket || !player || !player.canBet) return 0;
        else {
        }

        if (bet + amount >= 0 && player.coins - (bet + amount) >= 0) {
            setBet((prevBet) => prevBet + amount);
        }
        return bet;
    };

    return (
        <SocketContext.Provider value={socket}>
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
                {showConfirmModal && (
                    <ConfirmModal
                        message="Are you sure you want to fold?"
                        onConfirm={confirmFold}
                        onCancel={() => setShowConfirmModal(false)}
                    />
                )}
                <CoinPot coins={pot} />
                <BettingTable
                    bet={bet}
                    action={action}
                    currentTotalBet={player?.currentBet}
                    handleBetActionChange={handleBetActionChange}
                    handleBetValueChange={handleBetValueChange}
                    canBet={player?.canBet || false}
                />
                <PointTable pointTable={pointTable} />

                <button
                    style={{ maxWidth: "250px" }}
                    onClick={() => setShowWithdrawModal(true)}
                >
                    Withdraw Coins
                </button>
                {showWithdrawModal && (
                    <WithdrawModal
                        potValue={pot}
                        onConfirm={handleWithdraw}
                        onCancel={() => setShowWithdrawModal(false)}
                    />
                )}
            </div>
        </SocketContext.Provider>
    );
}
