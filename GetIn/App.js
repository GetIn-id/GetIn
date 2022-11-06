import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import React from "react";
import { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Scan from "./src/screens/Scan";
import HomeTabs from "./src/features/HomeTabs";
import SignIn from "./src/screens/SignIn";

const App = () => {
  const Stack = createNativeStackNavigator();
  const scheme = useColorScheme();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#00e575",
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
  
  return (
    <NavigationContainer theme={scheme === 'dark' ? MyDarkTheme : MyTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Scan QR" component={Scan} options={{title: 'Scan QR-code'}} />
        <Stack.Screen name="Sign In" component={SignIn} options={{title: 'Sign in'}} />
      </Stack.Navigator>
  </NavigationContainer>
  );
};

export default App;