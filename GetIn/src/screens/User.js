import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  StatusBar,
  Modal,
  Image,
  StyleSheet,
} from 'react-native';
import {relayInit, nip19} from 'nostr-tools';
import Button from '../features/Button';
//import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useTheme} from '@react-navigation/native';
const logo = require('../assets/checkbox2.png');

function User() {
  //const {getItem, setItem} = useAsyncStorage('user');
  const [modalVisible2, setModalVisible2] = useState(false);
  const {colors} = useTheme();

  const [relay, setRelay] = useState(null);
  const [publicKey, setPublicKey] = useState(
    '66a2eec5ef4a0c232c3c7f8720838a446296194742fe001ccb8dbb926b72518b',
  );
  const [allEvents, setAllEvents] = useState([]);
  const [metaData, setMetaData] = useState({
    name: '',
    display_name: 'Anon',
    picture: '',
    about: '',
  });
  // const readUserFromStorage = async () => {
  //   try {
  //     const stringItem = await getItem();
  //     if (stringItem) {
  //       const jsonItem = JSON.parse(stringItem);
  //       onChangeUsername(jsonItem.username);
  //       onChangeEmail(jsonItem.email);
  //     } else {
  //       console.log('No user info stored');
  //     }
  //   } catch (error) {
  //     console.log("Storage couldn't be accessed!", error);
  //   }
  // };

  // const writeUserToStorage = async newValue => {
  //   setModalVisible2(true);
  //   const jsonValue = JSON.stringify(newValue);
  //   await setItem(jsonValue);
  //   setTimeout(() => {
  //     setModalVisible2(false);
  //   }, 1250);
  // };

  // useEffect(() => {
  //   readUserFromStorage();
  // }, []);

  useEffect(() => {
    const connectRelays = async () => {
      const relay = relayInit('wss://nostr.relayer.se');
      await relay.connect();
      relay.on('connect', () => {
        setRelay(relay);
        console.log(`connected to ${relay.url}`);
      });
      relay.on('error', () => {
        console.log(`failed to connect to ${relay.url}`);
      });
    };
    connectRelays();
  }, []);

  useEffect(() => {
    if (relay !== null) {
      let sub = relay.sub([
        {
          authors: [
            //'32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245' //66a2eec5ef4a0c232c3c7f8720838a446296194742fe001ccb8dbb926b72518b
            //'66a2eec5ef4a0c232c3c7f8720838a446296194742fe001ccb8dbb926b72518b',
            publicKey,
          ],
          kinds: [0],
        },
      ]);
      sub.on('event', event => {
        if (allEvents.some(e => e.id === event.id)) {
          /* event already exists */
          console.log('event exist');
        } else {
          allEvents.push(event);
          console.log(event);
          const content = JSON.parse(event.content);
          setMetaData(content);
        }
      });
    } else {
      console.log('no relay');
    }
  }, [relay]);

  console.log(metaData);
  return (
    <SafeAreaView>
      <StatusBar />
      <View
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <View style={styles.logoSection}>
          {metaData.picture !== '' ? (
            <Image
              style={styles.logo}
              source={{
                uri: metaData.picture,
              }}
            />
          ) : (
            <Image style={styles.logo} source={logo} />
          )}
        </View>
        <View style={styles.settingsView}>
          <View style={[styles.settingsCard, {marginTop: 25}]}>
            <Text style={{color: colors.text, fontWeight: 'bold'}}>
              Username
            </Text>
            <Text style={{color: colors.text}}>{metaData.display_name}</Text>
          </View>
          <View style={[styles.settingsCard, {marginTop: 25}]}>
            <Text style={{color: colors.text, fontWeight: 'bold'}}>
              Profile identifier
            </Text>
            <Text style={{color: colors.text}}>@{metaData.name}</Text>
          </View>
          <View style={[styles.settingsCard, {marginTop: 25}]}>
            <Text style={{color: colors.text, fontWeight: 'bold'}}>
              About me
            </Text>
            <Text style={{color: colors.text}}>{metaData.about}</Text>
          </View>
          <View style={[styles.settingsCard, {marginTop: 25}]}>
            <Text style={{color: colors.text, fontWeight: 'bold'}}>
              Website
            </Text>
            <Text style={{color: colors.text}}>{metaData.website}</Text>
          </View>
        </View>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoSection: {
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: '30%',
    height: '50%',
  },
  settingsView: {
    height: '35%',
  },
  settingsCard: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
});

export default User;
