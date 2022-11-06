import React from "react";
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs";

import Ionicons from "react-native-vector-icons/Ionicons";
import Home from "../screens/Home";
// import PersonalInfo from "../screens/PersonalInfo";
// import Dev from "../screens/Dev";
// import History from "../screens/History";
import Settings from "../screens/Settings";


function HomeTabs() {
  const Tab = createBottomTabNavigator();
  const primaryColor = "#00e575ff";
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Settings") {
                iconName = "settings";
            } 

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: primaryColor,
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={Home} options={{headerShown: false}} />
        {/* <Tab.Screen name="Personal Info" component={PersonalInfo} /> 
        <Tab.Screen name="History" component={History} options={{headerShown: false}} /> */}
        <Tab.Screen name="Settings" component={Settings} options={{headerShown: false}} />
      </Tab.Navigator>
  );
}

export default HomeTabs;