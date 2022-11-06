import {TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {styles} from '../styles/Styles';
import {useTheme} from '@react-navigation/native';


const Button = ({onPress, title, icon, ...props}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, props.style]}>
      {icon}
      <Text
        style={{
          paddingLeft: 5,
          flexDirection: 'row',
          justifyContent: 'center',
          alignSelf: 'center',
          fontSize: 16,
          color: colors.text,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
