import React from "react";
import { Button, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type LobbyProps = NativeStackScreenProps<RootStackParamList, "Lobby">;
// Define your screen component
const Lobby: React.FC<LobbyProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Go to Game"
        onPress={() => navigation.navigate("GameScreen")}
      />
      <Button title="Create a game" onPress={() => connectWebSocket()} />
      <Button
        title="Button 2"
        onPress={() => console.log("Button 2 pressed")}
      />
    </View>
  );
};

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

export default Lobby;
