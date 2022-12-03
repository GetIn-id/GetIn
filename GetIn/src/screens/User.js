import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  StatusBar,
  Modal,
  Image,
} from 'react-native';
import Button from '../features/Button';
import {styles} from '../styles/Styles';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useTheme} from '@react-navigation/native';
const logo = require('../assets/checkbox2.png');

function User() {
  const {getItem, setItem} = useAsyncStorage('user');
  const [modalVisible2, setModalVisible2] = useState(false);
  const [username, onChangeUsername] = useState('');
  const [email, onChangeEmail] = useState('');
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

  useEffect(() => {
    readUserFromStorage();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <View
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}></View>
      <View style={{marginTop: 15}}>
        <Text
          style={{
            marginLeft: '5%',
            color: colors.text,
            fontWeight: 'bold'
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
          fontWeight: 'bold'
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
}

export default User;
