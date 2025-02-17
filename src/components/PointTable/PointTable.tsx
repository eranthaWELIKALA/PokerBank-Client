import React from "react";
import "./PointTable.css";

// Typing the entry object
interface PayTableEntry {
    id: number;
    name: string;
    coins: number;
}

// Typing the props directly without React.FC
interface PointTableProps {
    pointTable: PayTableEntry[];
    pointLine: number;
}

const PointTable = ({ pointTable, pointLine }: PointTableProps) => {
    return (
        <div className="component-container">
            <div className="point-table">
                <div className="hud-title">Point Table</div>
                <div className="point-table__line">
                    <div className="point-table__line__name">Player</div>
                    <div className="point-table__line__coins">Remaining</div>
                </div>

                {pointTable
                    .slice()
                    .reverse()
                    .map((line) => (
                        <div key={line.id} className="point-table__line">
                            <div className="point-table__line__name">
                                {line.name}
                            </div>
                            <div className="point-table__line__coins">
                                {line.coins}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default PointTable;
