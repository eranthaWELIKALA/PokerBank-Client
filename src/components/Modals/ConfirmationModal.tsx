import React from "react";
import styles from "./Modal.module.css"; // Import CSS Module

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    message,
    onConfirm,
    onCancel,
}) => {
    return (
        <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
                <h2 style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    {message}
                </h2>
                <div className={styles["modal-buttons"]}>
                    <button
                        className={styles["confirm-btn"]}
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button className={styles["cancel-btn"]} onClick={onCancel}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
