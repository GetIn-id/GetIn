import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  Image,
  Linking,
} from 'react-native';
import {styles} from '../styles/Styles';
import {useTheme} from '@react-navigation/native';

const logo = require('../assets/checkbox2.png');

const Success = ({navigation, route}) => {
  const {colors} = useTheme();
  const message = route.params.message;
  const navUrl = route.params.navUrl;
  const sameDevice = route.params.sameDevice;

  useEffect(() => {
    setTimeout(() => {
      if (sameDevice) {
        Linking.openURL(navUrl);
      } else {
        navigation.navigate('HomeTabs');
      }
    }, 2500);
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <View
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <View style={styles.logoSection}>
          <Image style={styles.logo} source={logo} />
        </View>
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
            {message}
          </Text>
        </View>
        <View style={styles.buttonSection}></View>
      </View>
    </SafeAreaView>
  );
};

export default Success;
