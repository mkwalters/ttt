import React, { useState } from "react";
import { Button, View, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { styles } from "../styles/Gamescreen";

type LobbyProps = NativeStackScreenProps<RootStackParamList, "Lobby">;
// Define your screen component

const Lobby: React.FC<LobbyProps> = ({ navigation }) => {
  const [joinCode, setJoinCode] = useState("");
  const createAGame = async () => {
    const data = {
      // TODO: this isnt needed
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

  const joinAGame = async (code: string) => {
    console.log("foo");
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Create a game" onPress={() => createAGame()} />
      <TextInput
        style={styles.input}
        placeholder="Enter code"
        keyboardType="numeric" // Ensures only numeric keypad is shown
        value={joinCode}
        onChangeText={(text: string) =>
          setJoinCode(text.replace(/[^0-9]/g, ""))
        } // Removes non-numeric characters
      />
      <Button title="Join a game" onPress={() => joinAGame(joinCode)} />
    </View>
  );
};

export default Lobby;
