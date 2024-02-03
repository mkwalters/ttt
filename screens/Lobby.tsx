import React, { useState } from "react";
import { Button, View, TextInput, Alert, Text, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { styles } from "../styles/Gamescreen";
import { getDomain } from "../util";

type LobbyProps = NativeStackScreenProps<RootStackParamList, "Lobby">;

const Lobby: React.FC<LobbyProps> = ({ navigation }) => {
  const [joinCode, setJoinCode] = useState("");
  const createAGame = async () => {
    const res = await fetch(`http://${getDomain(Platform.OS)}:9999/game/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    navigation.navigate("GameScreen", { code: json.code, pieces: json.pieces });
  };

  const joinAGame = async (code: string) => {
    const data = {
      code,
    };

    const res = await fetch(`http://${getDomain(Platform.OS)}:9999/game/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
