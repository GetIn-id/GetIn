import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  StatusBar,
  Modal,
  Pressable,
  Linking,
  Image,
} from 'react-native';
import Button from '../features/Button';
import {styles} from '../styles/Styles';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import {useTheme} from '@react-navigation/native';
import {mnemonicToSeed} from '@scure/bip39';
const logo = require('../assets/checkbox2.png');

const Settings = ({navigation}) => {
  const {getItem, setItem} = useAsyncStorage('user');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [username, onChangeUsername] = useState('');
  const [email, onChangeEmail] = useState('');
  const [backUp, onChangeBackUp] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [seed, setSeed] = useState('');
  const {colors} = useTheme();

  const readUserFromStorage = async () => {
    try {
      const stringItem = await getItem();
      if (stringItem) {
        const jsonItem = JSON.parse(stringItem);
        onChangeUsername(jsonItem.username);
        onChangeEmail(jsonItem.email);
      } else {
        console.log('No user info stored');
      }
    } catch (error) {
      console.log("Storage couldn't be accessed!", error);
    }
  };

  const writeUserToStorage = async newValue => {
    setModalVisible2(true);
    const jsonValue = JSON.stringify(newValue);
    await setItem(jsonValue);
    setTimeout(() => {
      setModalVisible2(false);
    }, 1250);
  };

  const getMnemonic = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const newMnemonic = credentials.username;
        setMnemonic(newMnemonic);
      } else {
        console.log('No mnemonic stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  const writeMnemonicToStorage = async (mnemonic, seed) => {
    await Keychain.resetGenericPassword();
    try {
      console.log(mnemonic);
      const seed = await mnemonicToSeed(mnemonic);
      const seedString = String.fromCharCode(...seed);
      await Keychain.setGenericPassword(mnemonic, seedString);
      await getMnemonic();
    } catch (error) {
      console.log('Keychain error', error);
    }
  };

  useEffect(() => {
    readUserFromStorage();
    getMnemonic();
  }, []);

  const UselessTextInput = props => {
    return (
      <TextInput
        {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable
        maxLength={200}
        autoCapitalize="none"
        autoFocus="true"
      />
    );
  };

  const handleBackUp = () => {
    setModalVisible3(!modalVisible3);
    writeMnemonicToStorage(backUp, seed);
  };

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
              marginBottom: 25,
            }}>
            App Settings
          </Text>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text}}>Language</Text>
            <Text style={{color: colors.text}}>English</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text}}>About us</Text>
            <Text
              style={{color: colors.text}}
              onPress={() => {
                Linking.openURL('https://getin.id');
              }}>
              Webpage
            </Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text}}>Back up phrase</Text>
            <Pressable onPress={() => setModalVisible(true)}>
              <Text style={{color: colors.text}}>Show</Text>
            </Pressable>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text}}>Import back up</Text>
            <Pressable onPress={() => setModalVisible3(true)}>
              <Text style={{color: colors.text}}>Import</Text>
            </Pressable>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible2);
        }}>
        <View style={styles.centeredView}>
          <View>
            <Image style={{width: 100, height: 100}} source={logo} />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible3);
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
                fontSize: 16,
                fontWeight: 'bold',
                alignSelf: 'center',
                marginHorizontal: 30,
                color: colors.text,
              }}>
              Enter your back up phrase:
            </Text>
            <View
              style={{
                borderWidth: 1,
                minWidth: "100%",
                minHeight: "20%",
                marginTop: 20,
                borderColor: colors.border,
                color: colors.text,
              }}>
              <UselessTextInput
                multiline
                numberOfLines={4}
                onChangeText={text => onChangeBackUp(text)}
                placeholder="word1 word2 word3 ..."
                value={backUp}
                style={{padding: 10}}
              />
            </View>
            <Pressable
              //style={[styles.button, styles.buttonClose]}
              onPress={handleBackUp}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  alignSelf: 'center',
                  marginHorizontal: 30,
                  paddingTop: 20,
                }}>
                Save
              </Text>
            </Pressable>
            <Pressable
              //style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible3(!modalVisible3)}>
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
