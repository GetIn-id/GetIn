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
import {useTheme} from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import KeyButton from '../features/KeyButton';
import Icon from 'react-native-vector-icons/Ionicons';
import KeyModal from '../features/KeyModal';

const logo = require('../assets/checkbox2.png');

function User() {
  const {colors} = useTheme();

  const [relay, setRelay] = useState(null);
  const [publicKey, setPublicKey] = useState(
    '66a2eec5ef4a0c232c3c7f8720838a446296194742fe001ccb8dbb926b72518b',
  );
  const [allEvents, setAllEvents] = useState([]);
  const [changeAbout, setChangeAbout] = useState('');
  const [changeWebsite, setChangeWebsite] = useState('');
  const [changeLightning, setChangeLightning] = useState('');
  const [changeNip, setChangeNip] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    name: '',
    display_name: 'Anon',
    picture: '',
    about: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const handleOpen = () => setModalVisible(true);
  const handleClose = () => setModalVisible(false);
  const defaultBanner = 'https://i.postimg.cc/k4mw8zK3/lilabanner2.png';

  useEffect(() => {
    const connectRelays = async () => {
      try {
        const relay = relayInit('wss://nos.lol');
        await relay.connect();
        relay.on('connect', () => {
          setRelay(relay);
          console.log(`connected to ${relay.url}`);
        });
        relay.on('error', () => {
          console.log(`failed to connect to ${relay.url}`);
        });
      } catch (error) {
        console.log('error connecting to relay');
      }
    };
    connectRelays();
  }, []);

  useEffect(() => {
    if (relay !== null) {
      try {
        let sub = relay.sub([
          {
            authors: [
              //'32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245' //66a2eec5ef4a0c232c3c7f8720838a446296194742fe001ccb8dbb926b72518b
              //'66a2eec5ef4a0c232c3c7f8720838a446296194742fe001ccb8dbb926b72518b',
              publicKey,
            ],
            kinds: [0],
            //limit: [2]
          },
        ]);
        sub.on('event', event => {
          if (allEvents.some(e => e.id === event.id)) {
            /* event already exists */
            console.log('event exist');
            setIsLoading(false);
          } else {
            allEvents.push(event);
            console.log(event);
            const content = JSON.parse(event.content);
            setMetaData(content);
            setChangeAbout(content.about);
            setChangeWebsite(content.website);
            setChangeLightning(content.lud16);
            setChangeNip(content.nip05);
            setIsLoading(false);
          }
        });
      } catch {
        console.log('subscribtion failed');
      }
    } else {
      console.log('no relay');
      setIsLoading(true);
    }
  }, [relay]);

  console.log(metaData);
  return (
    <SafeAreaView>
      <StatusBar />
      {isLoading ? (
        <View style={styles.circles}>
          <Progress.CircleSnail color={colors.primary} />
        </View>
      ) : (
        <View style={styles.screen}>
          <View style={styles.banner}>
            {metaData.banner ? (
              <Image
                style={styles.bannerImage}
                source={{
                  uri: metaData.banner,
                }}
              />
            ) : (
              <Image source={defaultBanner} />
            )}
          </View>
          <View>
            {metaData.picture ? (
              <Image
                style={styles.avatar}
                source={{
                  uri: metaData.picture,
                }}
              />
            ) : (
              <Image style={styles.logo} source={logo} />
            )}
          </View>
          <View style={styles.nameView}>
            <LinearGradient
              colors={['#b785edff', '#5d00c8ff']}
              start={{x: 0.1, y: 1}}
              end={{x: 1, y: 0}}
              style={styles.linearGradient}>
              <Text style={styles.nameText}>
                {metaData.display_name && metaData.display_name}
              </Text>
              <Text style={styles.nameIdText}>
                @{metaData.name && metaData.name}
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.buttonView}>
            <View style={styles.buttonColumn}>
              <Text style={styles.buttonText}>Private Key</Text>
              <KeyButton
                icon={
                  <Icon name="lock-closed-outline" size={30} color={'white'}
                  onPress={handleOpen}
                  />    
                }
              />
            </View>
            <View style={styles.buttonColumn}>
              <Text style={styles.buttonText}>Public Key</Text>
              <KeyButton
                icon={<Icon name="qr-code-outline" size={30} color={'white'} />}
              />
            </View>
          </View>
          <View style={styles.textfieldView}>
            <Text style={{color: colors.text}}>About me</Text>
            <TextInput
              placeholder="about me"
              multiline
              style={styles.multiInput}
              onChangeText={setChangeAbout}
              value={changeAbout}
            />
            <Text style={{color: colors.text}}>Website</Text>
            <TextInput
              placeholder="website"
              multiline
              style={styles.input}
              onChangeText={setChangeWebsite}
              value={changeWebsite}
            />
            <Text style={{color: colors.text}}>Lightning adress</Text>
            <TextInput
              placeholder="Lightning adress"
              multiline
              style={styles.input}
              onChangeText={setChangeLightning}
              value={changeLightning}
            />
            <Text style={{color: colors.text}}>nip-05 verification</Text>
            <TextInput
              placeholder="nip-05"
              multiline
              style={styles.input}
              onChangeText={setChangeNip}
              value={changeNip}
            />
          </View>
        </View>
      )}
      <KeyModal modalVisible={modalVisible} handleClose={handleClose} text={"testing"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
  },
  banner: {
    width: '100%',
    height: '20%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  avatar: {
    position: 'absolute',
    top: -60,
    left: '60%',
    right: 0,
    bottom: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    
  },
  nameView: {
    width: '100%',
    height: '12%',
    zIndex: -1,
    elevation: -1,
  },
  linearGradient: {
    height: '100%',
    width: '100%',
  },
  nameText: {
    marginTop: 20,
    marginLeft: '5%',
    fontSize: 20,
    color: 'white',
  },
  nameIdText: {
    marginLeft: '5%',
    fontSize: 14,
    color: 'white',
  },
  buttonView: {
    width: '70%',
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
  },
  buttonColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  buttonText: {
    fontSize: 14,
    marginBottom: 10,
  },
  textfieldView: {
    height: '45%',
    width: '90%',
    marginLeft: '5%',
  },
  multiInput: {
    height: '20%',
    width: '100%',
    padding: 10,
    backgroundColor: '#b785edff',
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    height: '10%',
    width: '100%',
    padding: 10,
    backgroundColor: '#b785edff',
    borderRadius: 10,
    marginBottom: 10,
  },
  circles: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});

export default User;
