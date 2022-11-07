import {TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {styles} from '../styles/Styles';
import {useTheme} from '@react-navigation/native';


const Button = ({onPress, title, icon, disabled,  ...props}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.button, props.style]}>
      {icon}
      <Text
        style={{
          paddingLeft: 5,
          flexDirection: 'row',
          justifyContent: 'center',
          alignSelf: 'center',
          fontSize: 16,
          color: "white",
          fontWeight: "bold"
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
