import React from "react";
import "./CoinPot.css";

interface CoinPotProps {
    coins: number;
}

const CoinPot = ({ coins }: CoinPotProps) => {
    return (
        <div className="component-container">
            <div className="credits credits--wide">
                <div className="hud-title">Pot</div>
                <div className="credits__amount">{coins}</div>
            </div>
        </div>
    );
};

export default CoinPot;
