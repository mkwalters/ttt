import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Alert, Platform } from "react-native";
import { styles } from "../styles/Gamescreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { checkWinner, getDomain } from "../util";

type GameScreenProps = NativeStackScreenProps<RootStackParamList, "GameScreen">;

const GameScreen: React.FC<GameScreenProps> = ({ navigation, route }) => {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [currentPlayerToMove, setCurrentPlayerToMove] = useState<string>("x");
  const [isGameActive, setIsGameActive] = useState<boolean>(true);

  const { code, pieces } = route.params;
  const ws = new WebSocket(`ws://${getDomain(Platform.OS)}:4000?room=${code}`);

  useEffect(() => {
    const connectWebSocket = () => {
      // Connection opened
      ws.onopen = (event) => {
        console.log("WebSocket is open now.");
      };
      // Listen for messages from server
      ws.onmessage = (event: WebSocketMessageEvent) => {
        console.log("Message from server ", event.data);

        const json = JSON.parse(event.data);
        const newBoardFromServer = json.board as Array<string | null>;
        const newPiecesToPlay = json.piecesToPlay as string;

        const winner = checkWinner(newBoardFromServer);
        if (winner) {
          Alert.alert(`Player ${winner} has won!`);
          setIsGameActive(false);
        } else if (!newBoardFromServer.includes(null)) {
          Alert.alert("It's a draw!");
          setIsGameActive(false);
        }

        setBoard(newBoardFromServer);
        setCurrentPlayerToMove(newPiecesToPlay);
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
    connectWebSocket();
  }, []);

  const makeMove = (index: number, player: string) => {
    if (board[index] || !isGameActive || currentPlayerToMove !== pieces) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    // Send new board to server
    ws.send(
      JSON.stringify({
        board: newBoard,
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text>You are playing with the {pieces} pieces</Text>
      <Text>{currentPlayerToMove} to move</Text>
      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => makeMove(index, currentPlayerToMove)}
          >
            <Text style={styles.cellText}>{cell}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export default GameScreen;
