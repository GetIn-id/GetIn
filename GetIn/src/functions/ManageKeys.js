import * as Keychain from 'react-native-keychain';
import {
    generatePrivateKey,
    getPublicKey,
  } from 'nostr-tools';

const readKeysFromStorage = async () => {
    try {
        const sk = await Keychain.getInternetCredentials('profile1');
        if (sk) {
        //   setSk(sk.password);
        //   setPk(getPublicKey(sk.password));
          //setIsLoading(false);
          return sk.password
        } else {
            try {
                const sk = generatePrivateKey();
                if (sk) {
                  try {
                    await Keychain.setInternetCredentials('profile1', 'sk', `${sk}`);
                    // setSk(sk);
                    // setPk(getPublicKey(sk));
                    return sk
                  } catch (error) {
                    console.log('Read key error', error);
                  }
                } else {
                  console.log('No key');
                }
              } catch (error) {
                console.log('Generating key error', error);
              }
        }
      } catch (error) {
        console.log("Private key couldn't be accessed!", error);
      }
  }
  
  export {readKeysFromStorage}