import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import React from "react";
import { useColorScheme, Text } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Scan from "./src/screens/Scan";
import HomeTabs from "./src/features/HomeTabs";
import SignIn from "./src/screens/SignIn";
import Success from "./src/screens/Success";
import Home from "./src/screens/Home";

const App = () => {
  const Stack = createNativeStackNavigator();
  const scheme = useColorScheme();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#8c04e4",
      background: "#ffffff",
    },
  };

  const MyDarkTheme = {
    ...DefaultTheme,
    colors: {
      ...DarkTheme.colors,
      primary: "#00b147",
    },
  };

  const config = {
    screens: {
      SignIn: '*',
    },
  };

  const linking = {
    prefixes: ['lightning:', 'LIGHTNING:'],
    config,
  };
  
  return (
    <NavigationContainer theme={scheme === 'dark' ? MyDarkTheme : MyTheme} linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Scan QR" component={Scan} options={{title: 'Scan QR-code' }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{title: 'Sign in'}} />
        <Stack.Screen name="Success" component={Success} options={{title: 'Success!'}} />
      </Stack.Navigator>
  </NavigationContainer>
  );
};

export default App;