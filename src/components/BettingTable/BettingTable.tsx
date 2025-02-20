import React from "react";
import styles from "./BettingTable.module.css";

type BettingTableProps = {
    bet: number;
    action: string | null;
    currentTotalBet: number | undefined;
    handleBetValueChange: (amount: number) => number;
    handleBetActionChange: () => void;
    canBet: boolean;
};

const BettingTable = ({
    bet,
    action,
    currentTotalBet,
    handleBetActionChange,
    handleBetValueChange,
    canBet,
}: BettingTableProps) => {
    const betIncrementClicked = () => {
        handleBetValueChange(+5);
    };

    const betDecrementClicked = () => {
        handleBetValueChange(-5);
    };

    return (
        <div className="component-container">
            <div className={styles["betting-table"]}>
                <div className={styles["bet"]}>
                    <div className="hud-title">
                        {currentTotalBet ? `Bet ${currentTotalBet}` : `Bet`}
                    </div>
                    <div className={styles["betting-components"]}>
                        <span className={styles["bet__button"]}>
                            <button
                                type="button"
                                onClick={betDecrementClicked}
                                disabled={!canBet}
                                className={
                                    canBet
                                        ? ""
                                        : styles["bet__button--disabled"]
                                }
                            >
                                -
                            </button>
                        </span>
                        <div className={styles["bet__amount"]}>{bet}</div>
                        <span className={styles["bet__button"]}>
                            <button
                                type="button"
                                onClick={betIncrementClicked}
                                disabled={!canBet}
                                className={
                                    canBet
                                        ? ""
                                        : styles["bet__button--disabled"]
                                }
                            >
                                +
                            </button>
                        </span>
                    </div>
                </div>

                <button
                    className={styles["deal-button"]}
                    type="button"
                    onClick={handleBetActionChange}
                    disabled={!action}
                >
                    {action}
                </button>
            </div>
        </div>
    );
};

export default BettingTable;
