
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();

import Home from "./src/Home";

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        {/*<Stack.Screen name="AddList" component={ListaScreen} />*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;