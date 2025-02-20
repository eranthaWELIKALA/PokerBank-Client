"use client";

import { createContext } from "react";
import { io, Socket } from "socket.io-client";

export const socket: Socket = io(
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
);
export const SocketContext = createContext<Socket | null>(socket);
