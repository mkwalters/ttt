import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameScreen from "./screens/GameScreen"; // You'll create this next
import Lobby from "./screens/Lobby"; // You'll create this next

export type RootStackParamList = {
  Lobby: undefined;
  GameScreen: { code: string; pieces: "x" | "o" };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Lobby" component={Lobby} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
