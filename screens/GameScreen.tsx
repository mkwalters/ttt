import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
// import WebSocket from "react-native-websocket"; // TODO: there doesnt seem to be types for this package
import { styles } from "../styles/Gamescreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type GameScreenProps = NativeStackScreenProps<RootStackParamList, "GameScreen">;

const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<string>("X");
  const [isGameActive, setIsGameActive] = useState<boolean>(true);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:4000");

      // Connection opened
      ws.onopen = (event) => {
        console.log("WebSocket is open now.");
      };

      // Listen for messages
      ws.onmessage = (event: WebSocketMessageEvent) => {
        console.log("Message from server ", event.data);
      };

      // Listen for possible errors
      ws.onerror = (event) => {
        console.error("WebSocket error observed:", event);
      };

      // Listen for when the connection is closed
      ws.onclose = (event) => {
        console.log("WebSocket is closed now.");
      };
    };
  }, []);

  const makeMove = (
    index: number,
    player: string,
    sendToServer: boolean = true
  ) => {
    if (board[index] || !isGameActive) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      Alert.alert(`Player ${winner} has won!`);
      setIsGameActive(false);
    } else if (!newBoard.includes(null)) {
      Alert.alert("It's a draw!");
      setIsGameActive(false);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }

    if (sendToServer) {
      // Send move to server
      // ws.send(JSON.stringify({ type: "move", index, player })); //TODO: implement me
    }
  };

  const checkWinner = (board: Array<string | null>) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => makeMove(index, currentPlayer)}
          >
            <Text style={styles.cellText}>{cell}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export default GameScreen;
