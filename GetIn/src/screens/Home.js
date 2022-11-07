import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, Text, View, Image} from 'react-native';
import {styles} from '../styles/Styles';
import BdkRn from 'bdk-rn';
import Button from '../features/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import {mnemonicToSeed} from '@scure/bip39';
import * as encoding from 'text-encoding';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import * as Keychain from 'react-native-keychain';
import * as Progress from 'react-native-progress';

const logo = require('../assets/Logo2.png');

const Home = ({navigation, route}) => {
  const [mnemonic, setMnemonic] = useState(null);
  const [seed, setSeed] = useState(null);
  const [loading, setLoading] = useState(false);
  const message = route.params;
  const {colors} = useTheme();
  const scheme = useColorScheme();

  const readMnemonicFromStorage = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setMnemonic(credentials.username);
        setLoading(false);
      } else {
        await createMnemonic();
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  const writeMnemonicToStorage = async (mnemonic, seed) => {
    try {
      await Keychain.setGenericPassword(mnemonic, seed);
      setMnemonic(mnemonic);
      readMnemonicFromStorage();
    } catch (error) {
      console.log('Keychain error', error);
    }
  };

  const createMnemonic = async () => {
    try {
      const {data} = await BdkRn.generateMnemonic({
        length: 12,
        network: 'mainnet',
      });
      if (data) {
        const seed = await mnemonicToSeed(data);
        setSeed(seed);
        const seedString = String.fromCharCode(...seed);
        writeMnemonicToStorage(data, seedString);
      } else {
        console.log('No mnemonic');
      }
    } catch (error) {
      console.log('BDK error', error);
    }
  };

  useEffect(() => {
    readMnemonicFromStorage();
    setLoading(true);
  }, []);

  return (
    <SafeAreaView>
      <StatusBar
        backgroundColor={scheme === 'dark' ? 'black' : 'white'}
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <View style={styles.logoSection}>
          <Image style={styles.logo} source={logo} />
        </View>
        {loading ? (
          <>
            <View style={styles.textSection}>
            <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginHorizontal: 30,
                  color: colors.text,
                }}>
                Get In
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  alignSelf: 'center',
                  marginHorizontal: 30,
                  paddingTop: 20,
                }}>
                Initializing app...
              </Text>
            </View>
            <View style={styles.circles}>
            <Progress.CircleSnail
              style={styles.progress}
              color={'#00e575ff'}
            />
            </View>
          </>
        ) : (
          <>
            <View style={styles.textSection}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginHorizontal: 30,
                  color: colors.text,
                }}>
                Get In
              </Text>
              {message ? (
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    alignSelf: 'center',
                    marginHorizontal: 30,
                    paddingTop: 20,
                  }}>
                  {message.message}
                </Text>
              ) : (
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    alignSelf: 'center',
                    marginHorizontal: 30,
                    paddingTop: 20,
                  }}>
                  Log in on a webpage by clicking the button below and scan the
                  QR code.
                </Text>
              )}
            </View>
            <View style={styles.buttonSection}>
              <Button
                title="QR code"
                icon={<Icon name="qr-code-outline" size={24} color={'white'} />}
                onPress={() => navigation.navigate('Scan QR')}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
