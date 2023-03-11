import React, {useEffect, useState, useContext} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {relayInit, getPublicKey} from 'nostr-tools';
import Button from '../features/Button';
import {useTheme} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';
import {publishEvent} from '../functions/PublishEvent';
import {generateProfile, readKeysFromStorage} from '../functions/ManageKeys';
import { UsersContext } from '../features/UserContext';

const logo = require('../assets/logo_lila.png');

function CreateProfile() {
  const {colors} = useTheme();

  const [relay, setRelay] = useState(null);
  const [pk, setPk] = useState(null);
  const [sk, setSk] = useState(null);
  const [changeAbout, setChangeAbout] = useState('');
  const [changeUsername, setChangeUsername] = useState('');
  const [changeIdentifier, setChangeIdentifier] = useState('');




  const { user } = useContext(UsersContext);

  //connect to relay
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

  //publish updated metadata
  const handleSave = async () => {
    const sk = await generateProfile("profile3")
    setSk(sk);
    setPk(getPublicKey(sk));
    const changeWebsite = "";
    publishEvent(relay, pk, sk, changeAbout, changeWebsite, changeUsername, changeIdentifier );
  };

  return (
    <SafeAreaView>
      <StatusBar />
        <View style={styles.screen}>
          <View style={styles.textfieldView}>
          <Text style={{color: colors.text}}>Username</Text>
            <TextInput
              placeholder="Your username"
              multiline
              style={styles.input}
              onChangeText={setChangeUsername}
              value={changeUsername}
            />
            <Text style={{color: colors.text}}>Identifier</Text>
            <TextInput
              placeholder="your identifier"
              multiline
              style={styles.input}
              onChangeText={setChangeIdentifier}
              value={changeIdentifier}
            />
            <Text style={{color: colors.text}}>About me</Text>
            <TextInput
              placeholder="about me"
              multiline
              style={styles.multiInput}
              onChangeText={setChangeAbout}
              value={changeAbout}
            />
          </View>
          <Button
            title="Save"
            icon={<Icon name="save-outline" size={24} color={'white'} />}
            onPress={() => handleSave()}
          />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
  },
  textfieldView: {
    marginTop: "50%",
    height: '39%',
    width: '90%',
    marginLeft: '5%',
  },
  multiInput: {
    height: '20%',
    width: '100%',
    padding: 10,
    backgroundColor: '#d2b3f4ff',
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    height: '12%',
    width: '100%',
    padding: 10,
    backgroundColor: '#d2b3f4ff',
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default CreateProfile;
