import React, {useState, useContext} from 'react';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import Button from '../features/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home';
import Settings from '../screens/Settings';
import User from '../screens/User';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {UsersContext} from './UserContext';
import { generateProfile } from '../functions/ManageKeys';

function HomeTabs() {
  const Tab = createBottomTabNavigator();
  const {colors} = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const handleOpen = () => setModalVisible(true);
  const handleClose = () => setModalVisible(false);

  const {setUser, userList} = useContext(UsersContext);

  const handleUser = profile => {
    setUser(profile);
    handleClose();
  };

  const Item = ({item, onPress}) => (
    <TouchableOpacity onPress={onPress} style={{marginVertical: 10}}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    return <Item item={item} onPress={() => handleUser(item.title)} />;
  };

  const navigateCreate = (navigation) => {
    navigation.navigate('CreateProfile')
    handleClose();
  }

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
          headerRight: () => (
            <TouchableOpacity onPress={handleOpen} style={{marginRight: 20}}>
              <Ionicons
                name={'people-outline'}
                color={colors.primary}
                size={24}
              />
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleClose}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>List of profiles</Text>
                    <FlatList
                      data={userList}
                      renderItem={renderItem}
                      keyExtractor={item => item.id}
                    />
                    <Button
                      //style={[styles.button, styles.buttonClose]}
                      onPress={() => navigateCreate(navigation)}
                      title="Create new"></Button>
                  </View>
                </View>
              </Modal>
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
              <Ionicons name={'user'} color={colors.primary} size={24} />
            </TouchableOpacity>
          ),
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 250,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  keyText: {
    marginBottom: 25,
    textAlign: 'center',
    selectable: 'true',
  },
});

export default HomeTabs;
