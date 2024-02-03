import express from "express";
import http from "http";
import { LogBoxStatic } from "react-native";
import { generateFourDigitCode, chooseRandomXO, initializeGame } from "../util";
import { WebSocketServer, WebSocket } from "ws";
import { Game, GameCache } from "../model";

const app = express();
const port = 4000;
const webSocketPort = 9999;
app.use(express.json());

const server = http.createServer(app);

// Initialize a WebSocket server
const wss = new WebSocketServer({ server });

const games: GameCache = {};

const rooms: { [key: string]: Set<WebSocket> } = {};

wss.on("connection", (ws, req) => {
  // Extract room from URL, e.g., .com/?room=abc => abc
  const requestUrl = req.url || "/";
  const room = new URL(
    requestUrl,
    `http://${req.headers.host}`
  ).searchParams.get("room");

  console.log(`found room ${room}`);

  if (room) {
    if (!rooms[room]) {
      rooms[room] = new Set<WebSocket>();
    }
    // Add the connection to the room
    rooms[room].add(ws);

    ws.on("message", (message) => {
      console.log(`message recieved on server ${message}`);

      const data = message.toString();
      const parsedMessage = JSON.parse(data);
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
  // TODO: as the number of games hosted increases, this will get really slow.
  // It would probably be best to allow upper alphabetic chars in the code and then convert user input to upper
  let code = generateFourDigitCode();
  while (games.hasOwnProperty(code)) {
    code = generateFourDigitCode();
  }

  const pieces = chooseRandomXO();
  games[code] = initializeGame(pieces);

  res.json({ pieces, code });
});

app.post("/game/join", (req, res) => {
  console.log("joining new game");
  console.log(`body: ${req.body}`);
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

  game.status = "active"; // TODO: check this
  games[code] = game;

  console.log(games);
  res.json({ pieces: game.creatorPieces === "x" ? "o" : "x", code });
});

app.listen(webSocketPort, () => {
  console.log(`app running on http://localhost:${webSocketPort}`);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

///
//
///
///
///
// TODO: reference the util package. Im getting some weird import error
// export const generateFourDigitCode = (): string => {
//   // Generate a random number between 1000 and 9999
//   const code = Math.floor(1000 + Math.random() * 9000);

//   // Convert the number to a string and return it
//   return code.toString();
// };

// // TODO: reference the util package. Im getting some weird import error
// export const chooseRandomXO = (): "x" | "o" => {
//   // Generate a random number between 0 and 1
//   const randomNum = Math.random();

//   // If the number is less than 0.5, choose 'x', otherwise choose 'o'
//   return randomNum < 0.5 ? "x" : "o";
// };

// interface Game {
//   board: Array<string | null>;
//   piecesToPlay: string;
//   status: string;
//   creatorPieces: string;
// }
// export const initializeGame = (creatorPieces: string): Game => {
//   return {
//     board: Array(9).fill(null),
//     piecesToPlay: "x",
//     status: "pending",
//     creatorPieces,
//   };
// };
