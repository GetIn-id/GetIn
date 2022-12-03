import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home';
import Settings from '../screens/Settings';
import User from '../screens/User';
import {TouchableOpacity, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import { styles } from '../styles/Styles';

function HomeTabs() {
  const Tab = createBottomTabNavigator();
  const {colors} = useTheme();
  return (
    <Tab.Navigator
      backBehaviour="initialRoute"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          } else if (route.name === 'User') {
            iconName = 'person';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarButton: () => null,
          tabBarVisible: false,
        }}
      />
      <Tab.Screen
        name="User"
        component={User}
        options={({navigation}) => ({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{marginLeft: 14}}>
              <Ionicons name={'arrow-back'} color={colors.primary} size={24} />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={({navigation}) => ({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{marginLeft: 14}}>
              <Ionicons name={'arrow-back'} color={colors.primary} size={24} />
            </TouchableOpacity>
          ),
        })}
      />
    </Tab.Navigator>
  );
}

export default HomeTabs;
