import express from "express";
import http from "http";
import { generateFourDigitCode, chooseRandomXO, initializeGame } from "../util";
import { WebSocketServer, WebSocket } from "ws";
import { Game, GameCache } from "../model";

const app = express();

const webSocketPort = 4000;
const apiPort = 9999;

app.use(express.json());

const server = http.createServer(app);

// Initialize a WebSocket server
const wss = new WebSocketServer({ server });

// This is where we will store our games
// the key is the join code and the value is a Game interface
const games: GameCache = {};

const rooms: { [key: string]: Set<WebSocket> } = {};

wss.on("connection", (ws, req) => {
  // Extract room from URL, e.g., .com/?room=abc => abc
  const requestUrl = req.url || "/";
  const room = new URL(
    requestUrl,
    `http://${req.headers.host}`
  ).searchParams.get("room");

  if (room) {
    if (!rooms[room]) {
      rooms[room] = new Set<WebSocket>();
    }
    // Add the connection to the room
    // TODO: only allow two users in the same room
    rooms[room].add(ws);

    ws.on("message", (message) => {
      const parsedMessage = JSON.parse(message.toString());
      const newBoard = parsedMessage.board as Array<string | null>;

      games[room].board = newBoard;

      const playerThatJustMoved = games[room].piecesToPlay;
      games[room].piecesToPlay = playerThatJustMoved === "x" ? "o" : "x";

      // Broadcast to all clients in the room
      rooms[room].forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          const newGameState = games[room];
          client.send(JSON.stringify(newGameState));
        }
      });
    });

    ws.on("close", () => {
      rooms[room].delete(ws); // Remove the connection from the room
      ws.close();
    });
  }
});
app.post("/game/new", (_req, res) => {
  // TODO: as the number of games hosted increases, this will get unacceptably slow.
  // It would probably be best to allow upper alphabetic chars in the code and then convert user input to upper
  // that would move us from 9000 possible codes to 1679616
  // 5 digit code would bring us to 60,466,176 = 36 ^ 4
  // 6 digits would be 2,176,782,336 = 36 ^ 6
  let code = generateFourDigitCode();
  while (games.hasOwnProperty(code)) {
    code = generateFourDigitCode();
  }

  const pieces = chooseRandomXO();
  games[code] = initializeGame(pieces);

  res.json({ pieces, code });
});

app.post("/game/join", (req, res) => {
  let code = req.body.code;

  if (!code) {
    res.status(400);
    res.json({ message: "code not provided" });
  }

  if (!games.hasOwnProperty(code)) {
    res.status(404);
    res.json({ message: "game not found" });
  }
  const game = games[code];

  games[code] = game;

  res.json({ pieces: game.creatorPieces === "x" ? "o" : "x", code });
});

app.listen(apiPort, () => {
  console.log(`app running on http://localhost:${apiPort}`);
});

server.listen(webSocketPort, () => {
  console.log(`web socket server running on ws://localhost:${webSocketPort}`);
});
