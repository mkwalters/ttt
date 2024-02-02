import express from "express";
import http from "http";

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

app.get("/", (_req, res) => {
  console.log("hitting root");
  res.json("Hello, World!");
});

app.get("/time", (_req, res) => {
  res.json({ time: new Date() });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
