import express from "express";
import http from "http";
import { LogBoxStatic } from "react-native";
// import { generateFourDigitCode, chooseRandomXO } from "../util";
import { WebSocketServer } from "ws";

const app = express();
const port = 4000;
const webSocketPort = 9999;
app.use(express.json());

const server = http.createServer(app);

// Initialize a WebSocket server
const wss = new WebSocketServer({ server });

interface GameObject {
  [key: string]: Game;
}

const games: GameObject = {
  // TODO: initialize with an empty object
  "1234": {
    board: Array(9).fill(null),
    piecesToPlay: "x",
    status: "pending",
    creatorPieces: "x",
  },
};

const rooms: { [key: string]: Set<any> } = {};

wss.on("connection", function connection(ws, req) {
  console.log("a new connection has been established");

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("welcome!");
});

app.post("/game/new", (_req, res) => {
  console.log("hitting new game");
  let code = generateFourDigitCode();

  while (games.hasOwnProperty(code)) {
    code = generateFourDigitCode();
  }

  const pieces = chooseRandomXO();
  games[code] = initializeGame(pieces);

  console.log(games);
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

  if (game.status !== "pending") {
    res.status(404);
    res.json({ message: "game is not joinable" });
  }

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
export const generateFourDigitCode = (): string => {
  // Generate a random number between 1000 and 9999
  const code = Math.floor(1000 + Math.random() * 9000);

  // Convert the number to a string and return it
  return code.toString();
};

// TODO: reference the util package. Im getting some weird import error
export const chooseRandomXO = (): "x" | "o" => {
  // Generate a random number between 0 and 1
  const randomNum = Math.random();

  // If the number is less than 0.5, choose 'x', otherwise choose 'o'
  return randomNum < 0.5 ? "x" : "o";
};

interface Game {
  board: Array<string | null>;
  piecesToPlay: string;
  status: string;
  creatorPieces: string;
}
export const initializeGame = (creatorPieces: string): Game => {
  return {
    board: Array(9).fill(null),
    piecesToPlay: "x",
    status: "pending",
    creatorPieces,
  };
};
