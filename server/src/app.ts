import express from "express";
import http from "http";
// import { generateFourDigitCode } from "../util";
import { WebSocketServer } from "ws";

const app = express();
const port = 4000;

const server = http.createServer(app);

// Initialize a WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  console.log("a new connection has been established");

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("welcome!");
});

app.post("/game/new", (_req, res) => {
  console.log("hitting new game");
  const code = generateFourDigitCode();
  res.json({ pieces: chooseRandomXO(), code });
});

app.listen(9999, () => {
  console.log(`app running on http://localhost:${9999}`);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// TODO: reference the util package. Im getting some weird import error
export const generateFourDigitCode = (): string => {
  // Generate a random number between 1000 and 9999
  const code = Math.floor(1000 + Math.random() * 9000);

  // Convert the number to a string and return it
  return code.toString();
};
// TODO: reference the util package. Im getting some weird import error
function chooseRandomXO(): "x" | "o" {
  // Generate a random number between 0 and 1
  const randomNum = Math.random();

  // If the number is less than 0.5, choose 'x', otherwise choose 'o'
  return randomNum < 0.5 ? "x" : "o";
}
