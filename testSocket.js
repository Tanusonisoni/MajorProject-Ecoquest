
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("notification:new", (notification) => {
    console.log("New notification received:", notification);
});

socket.on("connect_error", (error) => {
    console.log("Connection error:", error.message);
});

socket.on("leaderboard:update", (leaderboard) => {
    console.log("Leaderboard updated:", leaderboard);
});