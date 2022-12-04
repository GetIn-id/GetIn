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
  Alert,
} from 'react-native';
import Button from '../features/Button';
import {styles} from '../styles/Styles';
import * as Keychain from 'react-native-keychain';
import {useTheme} from '@react-navigation/native';
import {mnemonicToSeed} from '@scure/bip39';
import * as Progress from 'react-native-progress';

const logo = require('../assets/checkbox2.png');

const Settings = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [backUp1, onChangeBackUp1] = useState(null);
  const [backUp2, onChangeBackUp2] = useState(null);
  const [backUp3, onChangeBackUp3] = useState(null);
  const [backUp4, onChangeBackUp4] = useState(null);
  const [backUp5, onChangeBackUp5] = useState(null);
  const [backUp6, onChangeBackUp6] = useState(null);
  const [backUp7, onChangeBackUp7] = useState(null);
  const [backUp8, onChangeBackUp8] = useState(null);
  const [backUp9, onChangeBackUp9] = useState(null);
  const [backUp10, onChangeBackUp10] = useState(null);
  const [backUp11, onChangeBackUp11] = useState(null);
  const [backUp12, onChangeBackUp12] = useState(null);
  const [mnemonic, setMnemonic] = useState('');
  const [seed, setSeed] = useState('');
  const [loading, setLoading] = useState(false);
  const {colors} = useTheme();

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
      const seed = await mnemonicToSeed(mnemonic);
      const seedString = String.fromCharCode(...seed);
      await Keychain.setGenericPassword(mnemonic, seedString);
      await getMnemonic();
    } catch (error) {
      console.log('Keychain error', error);
    }
  };

  useEffect(() => {
    getMnemonic();
  }, []);

  const handleBackUp = async () => {
    setLoading(true);
    const backUp =
      backUp1 +
      ' ' +
      backUp2 +
      ' ' +
      backUp3 +
      ' ' +
      backUp4 +
      ' ' +
      backUp5 +
      ' ' +
      backUp6 +
      ' ' +
      backUp7 +
      ' ' +
      backUp8 +
      ' ' +
      backUp9 +
      ' ' +
      backUp10 +
      ' ' +
      backUp11 +
      ' ' +
      backUp12;
      let result = backUp.includes(null);
      if(!result) {
    try {
      await writeMnemonicToStorage(backUp, seed);
      setLoading(false);
      setModalVisible3(!modalVisible3);
      setModalVisible2(true);
      setTimeout(() => {
        setModalVisible2(false);
      }, 1750);
    } catch (error) {
      setLoading(false);
      setModalVisible3(!modalVisible3);
      Alert.alert(
        'Importing failed',
        'An error occured: ' + error ,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  } else {
    setLoading(false);
      setModalVisible3(!modalVisible3);
      Alert.alert(
        'Importing failed',
        'An error occurred. Did you type in all 12 words? Remember that the back-up phrase is case sensitive.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
  }
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <View
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <View>
          <View style={[styles.settingsCard, {marginTop: 15}]}>
            <Text style={{color: colors.text, fontWeight: 'bold'}}>
              Language
            </Text>
            <Text style={{color: colors.text}}>English</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text, fontWeight: 'bold'}}>
              About us
            </Text>
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
            <Text style={{color: colors.text, fontWeight: 'bold'}}>
              Back up phrase
            </Text>
            <Pressable onPress={() => setModalVisible(true)}>
              <Text style={{color: colors.text}}>Show</Text>
            </Pressable>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text, fontWeight: 'bold'}}>
              Import back up
            </Text>
            <Pressable onPress={() => setModalVisible3(true)}>
              <Text style={{color: colors.text}}>Import</Text>
            </Pressable>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.settingsCard}>
            <Text style={{color: colors.text, fontWeight: 'bold'}}>
              Version
            </Text>
            <Text style={{color: colors.text}}>0.1.0</Text>
          </View>
          <View style={styles.divider}></View>
        </View>
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
            <View style={styles.backUpRow}>
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp1}
                value={backUp1}
                placeholder="word 1"
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp2}
                value={backUp2}
                placeholder="word 2"
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp3}
                value={backUp3}
                placeholder="word 3"
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp4}
                value={backUp4}
                placeholder="word 4"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.backUpRow}>
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp5}
                value={backUp5}
                placeholder="word 5"
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp6}
                value={backUp6}
                placeholder="word 6"
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp7}
                value={backUp7}
                placeholder="word 7"
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp8}
                value={backUp8}
                placeholder="word 8"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.backUpRow}>
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp9}
                value={backUp9}
                placeholder="word 9"
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp10}
                value={backUp10}
                placeholder="word 10"
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp11}
                value={backUp11}
                placeholder="word 11"
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.backUpInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                onChangeText={onChangeBackUp12}
                value={backUp12}
                placeholder="word 12"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.backUpButton}>
              <Pressable onPress={() => setModalVisible3(!modalVisible3)}>
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
              <Pressable onPress={handleBackUp}>
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
            </View>
          </View>
        </View>
      </Modal>
      {loading ? (
        <View style={styles.loading}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Importing...</Text>
          {/* <Progress.CircleSnail style={styles.progress} color={'#00e575ff'} /> */}
        </View>
      ) : (
        <View />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible2(!modalVisible2);
        }}>
        <View style={styles.centeredView}>
          <View>
            <Image style={{width: 100, height: 100}} source={logo} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Settings;
