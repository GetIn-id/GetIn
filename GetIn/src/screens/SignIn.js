import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, Image, Switch, Linking} from 'react-native';
import Button from '../features/Button';
import {styles} from '../styles/Styles';
import {getParams, decodelnurl, findlnurl} from 'js-lnurl';
import {useTheme} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import * as Progress from 'react-native-progress';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
// crypto imports
import {Buffer} from 'buffer';
import {HDKey} from '@scure/bip32';
import {HMAC as sha256HMAC} from 'fast-sha256';
import * as secp from '@noble/secp256k1';

const logo = require('../assets/logo.png');

function SignIn({navigation, route}) {
  const [mnemonic, setMnemonic] = useState(null);
  const [seed, setSeed] = useState(null);
  const [decodedUrl, setDecodedUrl] = useState(null);
  const [encodedUrl, setEncodedUrl] = useState(null);
  const [k1, setk1] = useState(null);
  const [callback, setCallback] = useState(null);
  const [tag, setTag] = useState(null);
  const [domain, setDomain] = useState(null);
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [invalidQr, setInvalidQr] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [sameDevice, setSameDevice] = useState(false);
  const {getItem, setItem} = useAsyncStorage('user');
  const [username, setUsername] = useState('');
  const {colors} = useTheme();

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    try {
      if (route.path) {
        setEncodedUrl(route.path);
        setSameDevice(true);
      } else {
        setEncodedUrl(route.params.lnurl);
        setSameDevice(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const stringToUint8Array = str => {
    return Uint8Array.from(str, x => x.charCodeAt(0));
  };

  const readUserFromStorage = async () => {
    try {
      const stringItem = await getItem();
      if (stringItem) {
        const jsonItem = JSON.parse(stringItem);
        setUsername(jsonItem.username);
      } else {
        console.log('No user info stored');
      }
    } catch (error) {
      console.log("Storage couldn't be accessed!", error);
    }
  };

  const readKeychain = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const stringSeed = credentials.password;
        const newSeed = Uint8Array.from(
          [...stringSeed].map(ch => ch.charCodeAt()),
        );
        const newMnemonic = credentials.username;
        setMnemonic(newMnemonic);
        setSeed(newSeed);
      } else {
        console.log('No seed stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    readUserFromStorage();
    if (encodedUrl) {
      try {
        //const newUrl = findlnurl(encodedUrl.lnurl);
        const newUrl = findlnurl(encodedUrl);
        const lnurl = decodelnurl(newUrl);
        setDecodedUrl(lnurl);
        getParams(lnurl).then(params => {
          setk1(params.k1);
          setCallback(params.callback);
          setDomain(params.domain);
          setTag(params.tag);
        });
        readKeychain();
      } catch (error) {
        setInvalidQr(true);
        console.log(error);
      }
    }
  }, [encodedUrl]);

  useEffect(() => {
    if (seed !== null) {
      const masterKey = HDKey.fromMasterSeed(seed);

      const hashingKey = masterKey.derive(`m/138'/0`);

      const hashingPrivKey = hashingKey.privateKey;

      const derivationMaterial = new sha256HMAC(hashingPrivKey)
        .update(stringToUint8Array(domain))
        .digest();

      const pathSuffix = new Uint32Array(
        derivationMaterial.buffer.slice(0, 16),
      );

      const path = `m/138'/${Array.from(pathSuffix)
        .map(n => (n & (2 ** 31) ? `${n & (2 ** 31 - 1)}'` : `${n}`))
        .join('/')}`;

      const linkingKey = masterKey.derive(path);
      const linkingPrivKey = linkingKey.privateKey;

      const linkingPublicKey = linkingKey.publicKey;

      const k1Buffer = Buffer.from(k1, 'hex');

      const signature = secp.signSync(k1Buffer, linkingPrivKey);

      const signatureBuffer = Buffer.from(signature, 'hex');
      const signedK1hex = signatureBuffer.toString('hex');

      const linkingPublicKeyBuffer = Buffer.from(linkingPublicKey);
      const linkingPublicKeyHex = linkingPublicKeyBuffer.toString('hex');

      if (username !== '' && isEnabled) {
        const auth = `${callback}&sig=${signedK1hex}&key=${linkingPublicKeyHex}&username=${username}`;
        setAuth(auth);
      } else {
        const auth = `${callback}&sig=${signedK1hex}&key=${linkingPublicKeyHex}`;
        setAuth(auth);
      }
      setLoading(false);
    }
  }, [seed, isEnabled]);

  const handleSignIn = () => {
    const domainSplit = domain.split('.');
    const navUrl = 'https://' + domainSplit[1] + '.' + domainSplit[2];
    setSending(true);
    fetch(auth)
      .then(response => response.json())
      .then(json => {
        setSending(false);
        navigation.navigate('Success', {
          message: `Succesfully signed in to ${domain}. Go to the web page.`,
          navUrl: navUrl,
          sameDevice: sameDevice,
        });
      })
      .catch(error => {
        console.error(error);
        navigation.navigate('HomeTabs', {
          message: `Sign in to ${domain} failed. Try again.`,
        });
      });
  };

  return (
    <SafeAreaView>
      {invalidQr ? (
        <View
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.container}>
          <View style={styles.SIlogoSection}>
            <Image style={styles.SIlogo} source={logo} />
          </View>
          <View style={styles.signInSection}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                alignSelf: 'center',
                marginHorizontal: 30,
                color: colors.text,
              }}>
              {domain}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                alignSelf: 'center',
                marginHorizontal: 30,
                paddingTop: 20,
              }}>
              Invalid QR code. This site does not support sign in with Get In.
            </Text>
          </View>
          <View style={styles.circles}>
            <Text style={styles.progress}></Text>
          </View>
          <View style={styles.SIbuttonSection}>
            <Button
              title="Cancel"
              style={styles.CancelButton}
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        </View>
      ) : (
        <View
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.container}>
          <View style={styles.SIlogoSection}>
            <Image style={styles.SIlogo} source={logo} />
          </View>
          <View style={styles.signInSection}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                alignSelf: 'center',
                marginHorizontal: 30,
                color: colors.text,
              }}>
              {domain}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                alignSelf: 'center',
                marginHorizontal: 30,
                paddingTop: 20,
              }}>
              Do you want to sign in to {domain}?
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 20,
                alignSelf: 'center',
                marginHorizontal: 30,
                paddingTop: 40,
                paddingBottom: 15,
              }}>
              Share user info
            </Text>
            <View style={styles.settingsCard}>
              <Text style={{color: colors.text}}>Username</Text>
              <Switch
                trackColor={{false: '#767577', true: colors.primary}}
                // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>
          {loading || sending ? (
            <View style={styles.circles}>
              <Progress.CircleSnail
                style={styles.progress}
                color={'#00e575ff'}
              />
            </View>
          ) : (
            <View style={styles.circles}>
              <Text style={styles.progress}></Text>
            </View>
          )}
          <View style={styles.SIbuttonSection}>
            <Button
              title="Cancel"
              style={styles.CancelButton}
              onPress={() => navigation.navigate('Home')}
            />
            {loading ? (
              <Button
                title="Get In"
                onPress={handleSignIn}
                disabled={true}
                style={styles.CancelButton}
              />
            ) : (
              <Button title="Get In" onPress={handleSignIn} disabled={false} />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default SignIn;
