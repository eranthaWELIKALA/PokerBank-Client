import React from "react";
import styles from "./PointTable.module.css";

interface PlayerEntry {
    id: string;
    name: string;
    coins: number;
}

interface PointTableProps {
    pointTable: PlayerEntry[];
}

const PointTable = ({ pointTable }: PointTableProps) => {
    return (
        <div className="component-container">
            <div className={styles["point-table"]}>
                <div className="hud-title">Point Table</div>
                <div className={styles["point-table__line"]}>
                    <div className={styles["point-table__line__name"]}>Player</div>
                    <div className={styles["point-table__line__coins"]}>Remaining</div>
                </div>

                {pointTable
                    .slice()
                    .reverse()
                    .map((line) => (
                        <div key={line.id} className={styles["point-table__line"]}>
                            <div className={styles["point-table__line__name"]}>
                                {line.name}
                            </div>
                            <div className={styles["point-table__line__coins"]}>
                                {line.coins}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default PointTable;
