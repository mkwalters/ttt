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
      <Button
        title="Button 2"
        onPress={() => console.log("Button 2 pressed")}
      />
    </View>
  );
};
export default Lobby;
