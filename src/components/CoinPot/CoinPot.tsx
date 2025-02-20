import React from "react";
import styles from "./CoinPot.module.css";

interface CoinPotProps {
    coins: number;
}

const CoinPot = ({ coins }: CoinPotProps) => {
    return (
        <div className="component-container">
            <div className={`${styles.credits} ${styles["credits--wide"]}`}>
                <div className="hud-title">Pot</div>
                <div className={styles.credits__amount}>{coins}</div>
            </div>
        </div>
    );
};

export default CoinPot;
