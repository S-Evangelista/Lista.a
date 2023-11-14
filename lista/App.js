import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import Home from "./src/Home";
import Adicionar from "./src/Adicionar";

function App () {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Adicionar" component={Adicionar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;