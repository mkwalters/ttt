import React, { useState } from "react";
import { Button, View, TextInput, Alert, Text, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { styles } from "../styles/Gamescreen";
import { getDomain, createGame, joinGame } from "../util";

type LobbyProps = NativeStackScreenProps<RootStackParamList, "Lobby">;

const Lobby: React.FC<LobbyProps> = ({ navigation }) => {
  const [joinCode, setJoinCode] = useState("");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Tic Tac Toe</Text>
      <Button
        title="Create a game"
        onPress={async () => {
          const res = await createGame(Platform.OS);
          const json = await res.json();
          navigation.navigate("GameScreen", {
            code: json.code,
            pieces: json.pieces,
          });
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter code"
        keyboardType="numeric"
        value={joinCode}
        onChangeText={(text: string) =>
          setJoinCode(text.replace(/[^0-9]/g, ""))
        }
      />
      <Button
        title="Join a game"
        onPress={async () => {
          const res = await joinGame(joinCode, Platform.OS);
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
        }}
      />
    </View>
  );
};

export default Lobby;
