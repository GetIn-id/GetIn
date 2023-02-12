import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const KeyButton = ({onPress, icon, disabled}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={styles.keyButton}>
      <LinearGradient
        colors={['#d2b3f4ff', '#5d00c8ff']}
        start={{x: 0.1, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.gradient}>
        {icon}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  keyButton: {
    width: '20%',
    height: '40%',
  },
  gradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default KeyButton;
