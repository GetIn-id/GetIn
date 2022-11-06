import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import Button from '../features/Button';
import {styles} from '../styles/Styles';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import {useTheme} from '@react-navigation/native';
const logo = require('../assets/logo.png');

const Settings = ({navigation}) => {
  const {getItem, setItem} = useAsyncStorage('user');
  const [modalVisible, setModalVisible] = useState(false);
  const [username, onChangeUsername] = useState('');
  const [email, onChangeEmail] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const {colors} = useTheme();

  const readUserFromStorage = async () => {
    const stringItem = await getItem();
    const jsonItem = JSON.parse(stringItem);
    onChangeUsername(jsonItem.username);
    onChangeEmail(jsonItem.email);
  };

  const writeUserToStorage = async newValue => {
    const jsonValue = JSON.stringify(newValue);
    await setItem(jsonValue);
    navigation.navigate('Home');
  };

  const getMnemonic = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const newMnemonic = credentials.username;
        setMnemonic(newMnemonic);
      } else {
        console.log('No credentials stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  useEffect(() => {
    readUserFromStorage();
    getMnemonic();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <View
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginHorizontal: 30,
              color: colors.text,
            }}>
            App Settings
          </Text>
          <View style={styles.divider}></View>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text}}>Language</Text>
            <Text style={{color: colors.text}}>English</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text}}>About us</Text>
            <Text style={{color: colors.text}}>webpage</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text}}>Back up phrase</Text>
            <Pressable
              // style={[styles.button, styles.buttonOpen]}
              onPress={() => setModalVisible(true)}>
              <Text style={{color: colors.text}}>Show</Text>
            </Pressable>
            {/* <Text>show</Text> */}
          </View>
          <View style={styles.divider}></View>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text}}>Version</Text>
            <Text style={{color: colors.text}}>0.0.1</Text>
          </View>
          <View style={styles.divider}></View>
        </View>
      </View>
      <View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            alignSelf: 'center',
            marginHorizontal: 30,
            color: colors.text,
          }}>
          User Info
        </Text>
        <Text
          style={{
            marginLeft: '5%',
            color: colors.text,
          }}>
          Username
        </Text>
        <TextInput
          style={{
            width: '90%',
            justifyContent: 'space-between',
            alignSelf: 'center',
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            borderColor: colors.border,
            color: colors.text,
          }}
          onChangeText={onChangeUsername}
          value={username}
          placeholder="no username added"
        />
      </View>
      <Text
        style={{
          marginLeft: '5%',
          color: colors.text,
        }}>
        Email
      </Text>
      <TextInput
        style={{
          width: '90%',
          justifyContent: 'space-between',
          alignSelf: 'center',
          height: 40,
          margin: 12,
          borderWidth: 1,
          padding: 10,
          borderColor: colors.border,
          color: colors.text,
        }}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="no email added"
      />
      <View style={styles.settingButton}>
        <Button
          title="Save"
          onPress={() => writeUserToStorage({username: username, email: email})}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View
            style={{
              margin: '5%',
              backgroundColor: colors.card,
              borderRadius: 0,
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
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                alignSelf: 'center',
                marginHorizontal: 30,
                color: colors.text,
              }}>
              Back up phrase:{' '}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                alignSelf: 'center',
                marginHorizontal: 30,
                paddingTop: 20,
              }}
              selectable={true}>
              {mnemonic}{' '}
            </Text>
            <Pressable
              //style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  alignSelf: 'center',
                  marginHorizontal: 30,
                  paddingTop: 20,
                }}>
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Settings;
