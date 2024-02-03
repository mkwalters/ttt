import express from "express";
import http from "http";
import { generateFourDigitCode, chooseRandomXO, initializeGame } from "../util";
import { WebSocketServer, WebSocket } from "ws";
import { Game, GameCache } from "../model";

const app = express();
app.use(express.json());
const server = http.createServer(app);
const webSocketPort = 4000;
const apiPort = 9999;

// Initialize a WebSocket server
const wss = new WebSocketServer({ server });

// This is where we will store our games
// the key is the join code and the value is a Game interface
// We would eventually want to move this to a proper database
const games: GameCache = {};

// We will silo each client into a "room" based on their join code.
// This will allow us to only broadcast to the proper games
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
      const newBoard = JSON.parse(message.toString()).board as Array<
        string | null
      >;

      // we should have a validation step here and not trust our client. things like...
      // did the correct player just move? Did they make a legal move? is the data malformed?
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
