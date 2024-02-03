import React, { useState } from "react";
import { Button, View, TextInput, Alert, Text, Platform } from "react-native";
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
    let domain = "localhost";
    if (Platform.OS === "android") {
      domain = "10.0.2.2";
    }

    // Create the POST request using fetch
    const res = await fetch(`http://${domain}:9999/game/new`, {
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
    const data = {
      code,
    };

    let domain = "localhost";
    if (Platform.OS === "android") {
      domain = "10.0.2.2";
    }

    // Create the POST request using fetch
    const res = await fetch(`http://${domain}:9999/game/join`, {
      // Replace "/your-endpoint" with your actual endpoint
      method: "POST", // Set the method to POST
      headers: {
        "Content-Type": "application/json", // Set the content type header
      },
      body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
    });

    if (res.status >= 200 && res.status < 300) {
      const json = await res.json();
      console.log(json);
      navigation.navigate("GameScreen", {
        code: json.code,
        pieces: json.pieces,
      });
    } else {
      Alert.alert("Game not found");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>tic tac toe</Text>
      <Button title="Create a game" onPress={() => createAGame()} />
      <TextInput
        style={styles.input}
        placeholder="Enter code"
        keyboardType="numeric"
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
