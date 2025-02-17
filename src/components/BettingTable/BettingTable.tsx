import React, { useState } from "react";
import "./BettingTable.css"; // Import CSS for styling

type BettingTableProps = {
    bet: number;
    placeBet: (amount: number) => void;
    canEnableBets: boolean;
};


const BettingTable = ({ bet, placeBet, canEnableBets }: BettingTableProps) => {
    // Function to handle the change in bet by 5 units
    const handleBetChange = (amount: number) => {
        if (bet + amount >= 0) {
            placeBet(amount);
        }
    };

    return (
        <div className="component-container">
            <div className="betting-table">
                <div className="bet">
                    <div className="hud-title">Bet</div>
                    <div>
                        <span className="bet__button">
                            <button
                                type="button"
                                onClick={() => handleBetChange(-5)} // Decrease bet by 5
                                disabled={!canEnableBets}
                                className={
                                    canEnableBets ? "" : "bet__button--disabled"
                                }
                            >
                                -
                            </button>
                        </span>
                        <div className="bet__amount">{bet}</div>
                        <span className="bet__button">
                            <button
                                type="button"
                                onClick={() => handleBetChange(5)} // Increase bet by 5
                                disabled={!canEnableBets}
                                className={
                                    canEnableBets ? "" : "bet__button--disabled"
                                }
                            >
                                +
                            </button>
                        </span>
                    </div>
                </div>

                {/* New button after the bet div, for Fold or Bet */}
                <button
                    className="deal-button"
                    type="button"
                    onClick={() => handleBetChange(-5)} // Decrease bet by 5 when clicked
                    disabled={!canEnableBets}
                >
                    {bet === 0 ? "Fold" : "Bet"}
                </button>
            </div>
        </div>
    );
};

export default BettingTable;
