import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, Image} from 'react-native';
import Button from '../features/Button';
import {styles} from '../styles/Styles';
import {getParams, decodelnurl, findlnurl} from 'js-lnurl';
import {useTheme} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
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
  const [k1, setk1] = useState(null);
  const [callback, setCallback] = useState(null);
  const [tag, setTag] = useState(null);
  const [domain, setDomain] = useState(null);
  const [auth, setAuth] = useState(null);
  const {colors} = useTheme();
  const encodedUrl = route.params;

  const stringToUint8Array = str => {
    return Uint8Array.from(str, x => x.charCodeAt(0));
  };

  const readKeychain = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const stringSeed = credentials.password;
        const jsonSeed = JSON.parse(stringSeed);
        const newSeed = Uint8Array.from(
          [...jsonSeed].map(ch => ch.charCodeAt()),
        );
        const newMnemonic = credentials.username;
        setMnemonic(newMnemonic);
        setSeed(newSeed);
      } else {
        console.log('No credentials stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  useEffect(() => {
    //readMnemonicFromStorage();
    readKeychain();
    if (encodedUrl) {
      try {
        const newUrl = findlnurl(encodedUrl.lnurl);
        const lnurl = decodelnurl(newUrl);
        setDecodedUrl(lnurl);
        getParams(lnurl).then(params => {
          setk1(params.k1);
          setCallback(params.callback);
          setDomain(params.domain);
          setTag(params.tag);
        });
      } catch (error) {
        console.error(
          'Invalid QR code. Does this app support sign in with Get In or lightning?',
        );
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

      const auth = `${callback}&sig=${signedK1hex}&key=${linkingPublicKeyHex}`;

      setAuth(auth);
    }
  }, [seed]);

  const handleSignIn = () => {
    fetch(auth)
      .then(response => response.json())
      .then(json => {
        console.log(json.status);
        navigation.navigate('Home', {
          message: `Succesfully signed in to ${domain}. Go to the web page.`,
        });
      })
      .catch(error => {
        console.error(error);
        navigation.navigate('Home', {
          message: `Sign in to ${domain} failed. Try again.`,
        });
      });
  };

  return (
    <SafeAreaView>
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
        </View>
        <View style={styles.SIbuttonSection}>
          <Button
            title="Cancel"
            style={styles.CancelButton}
            onPress={() => navigation.navigate('Home')}
          />
          <Button title="Get In" onPress={handleSignIn} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SignIn;
