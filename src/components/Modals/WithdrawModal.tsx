import React, { useState } from "react";
import styles from "./Modal.module.css"; // Import the CSS Module

interface WithdrawModalProps {
    potValue: number;
    onConfirm: (amount: number) => void;
    onCancel: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
    potValue,
    onConfirm,
    onCancel,
}) => {
    const [message, setMessage] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState(0);

    const handleConfirm = () => {
        if (withdrawAmount >= 0 && withdrawAmount <= potValue) {
            onConfirm(withdrawAmount);
        } else {
            setMessage(`Pot Value should be within 0 & ${potValue}`);
        }
    };

    return (
        <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
                <h2 style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    Withdraw from Pot
                </h2>
                <input
                    className={styles["input-field"]} // Add input style
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    min={0}
                    max={potValue}
                />
                <p style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    {message}
                </p>
                <div className={styles["modal-buttons"]}>
                    <button className={styles["cancel-btn"]} onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className={styles["confirm-btn"]}
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawModal;
