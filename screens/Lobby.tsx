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
  const createAGame = async () => {
    const data = {
      key: "value", // Replace this with your actual data
    };

    // Create the POST request using fetch
    const res = await fetch("http://localhost:9999/game/new", {
      // Replace "/your-endpoint" with your actual endpoint
      method: "POST", // Set the method to POST
      headers: {
        "Content-Type": "application/json", // Set the content type header
      },
      body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
    });

    const json = await res.json();
    console.log(json);

    navigation.navigate("GameScreen", { code: json.code, pieces: json.pieces });
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="go to game"
        onPress={() =>
          navigation.navigate("GameScreen", { code: "1234", pieces: "x" })
        }
      />
      <Button title="Create a game" onPress={() => createAGame()} />
      <Button
        title="Button 2"
        onPress={() => console.log("Button 2 pressed")}
      />
    </View>
  );
};

export default Lobby;
